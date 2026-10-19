import { withBasePath } from "../../base-path";
import { apiTableRowOwners } from "../../docs/components/component-detail/component-api-owners";
import type {
  CodeReferenceHelpSection,
  CodeReferenceSourceModule,
  CodeReferenceSourceSymbol,
} from "../types";
import { referenceSectionLinks as localSource } from "./reference-section-links";

const identity = (value: string) => value.replace(/[^a-z0-9]/gi, "").toLowerCase();
/** Match the same owners and supporting prose as the full page's documented API table. */
function documentedFields(
  module: CodeReferenceSourceModule,
  table: CodeReferenceHelpSection,
  guide: string,
) {
  const definitions = module.symbols.filter((entry) => entry.kind === "type" && entry.typeId);
  const title = table.contractName ?? table.detail ?? module.title;
  return table.fields!.map((field) => {
    const owners = apiTableRowOwners(definitions, title, field.name);
    const propName = field.name.split(/\s+/).at(-1)!.replace(/\?$/, "");
    const declared = owners[0]?.fields?.find(({ name }) => name === propName);
    return {
      ...field,
      required: declared?.required ?? field.required,
      description:
        field.description ||
        declared?.description ||
        `Configure \`${field.name}\` for **${title}**. Compare its accepted type with the [Usage Guidance](${guide}#usage) before supplying a value.`,
      owners: owners.map((owner) => ({ label: owner.name, href: `${guide}#${owner.typeId}` })),
    };
  });
}

/** An overview keeps its actual composition table; exact subcomponents keep only their own rows. */
export function referenceSourceSections(
  module: CodeReferenceSourceModule,
  symbol: CodeReferenceSourceSymbol,
  guide: string | undefined,
): CodeReferenceHelpSection[] {
  const sections: CodeReferenceHelpSection[] = [];
  const needed = new Set(symbol.typeNames);
  const overview = symbol.kind === "component" && identity(symbol.name) === identity(module.title);
  if (symbol.kind === "component" && guide) {
    sections.push(...(module.sections ?? []).filter((section) => !section.fields).map(localSource));
    const tables = (module.sections ?? []).filter((section) => section.fields?.length);
    const matching =
      tables.find((section) => identity(section.contractName ?? "") === identity(symbol.name)) ??
      (overview
        ? tables[0]
        : tables.find((section) =>
            section.fields?.some((field) =>
              apiTableRowOwners(
                module.symbols,
                section.contractName ?? section.detail ?? module.title,
                field.name,
              ).some((owner) => owner.name === `${symbol.name}Props`),
            ),
          ));
    if (matching) {
      const fields = documentedFields(module, matching, guide).filter(
        (field) =>
          overview ||
          (!field.name.endsWith("()") &&
            field.owners?.some((owner) => owner.label === `${symbol.name}Props`)),
      );
      for (const field of fields) for (const owner of field.owners ?? []) needed.add(owner.label);
      if (fields.length) sections.push(localSource({ ...matching, fields }));
    } else if (symbol.fields?.length) {
      sections.push({
        title: "Props & data",
        detail: "Declared fields",
        contractName: `${symbol.name}Props`,
        fields: symbol.fields,
        source: { label: "Component API", href: withBasePath(`${guide}#api-reference`) },
        note: "Inherited attributes remain in the complete type.",
      });
    }
  }
  // Follow ownership forward. Reverse consumers remain index links, not contract chapters.
  const definitions = new Map(
    module.symbols
      .filter((entry) => entry.kind === "type" && entry.typeId)
      .map((entry) => [entry.name, entry]),
  );
  if (symbol.kind === "type") needed.add(symbol.name);
  for (const name of needed)
    for (const dependency of definitions.get(name)?.typeNames ?? []) needed.add(dependency);
  const declarations = (overview ? [...definitions.keys()] : [...needed]).flatMap((name) => {
    const entry = definitions.get(name);
    return entry?.declaration ? [entry] : [];
  });
  if (declarations.length && guide)
    sections.push({
      title: "Data type reference",
      detail: "Source definitions",
      source: {
        label: "Complete data type reference",
        href: withBasePath(`${guide}#component-data-types`),
      },
      definitions: declarations.map((entry) => ({
        name: entry.name,
        code: entry.declaration!,
        filePath: entry.file,
        description: entry.description,
        exported: entry.exported,
        fields: entry.fields,
        source: {
          label: `${entry.name} complete definition`,
          href: withBasePath(`${guide}#${entry.typeId}`),
        },
      })),
      note: "Imports and inherited types stay named.",
    });
  return sections;
}
