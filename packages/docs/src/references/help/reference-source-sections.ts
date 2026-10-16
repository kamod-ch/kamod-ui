import { withBasePath } from "../../base-path";
import type {
  CodeReferenceHelpSection,
  CodeReferenceSourceModule,
  CodeReferenceSourceSymbol,
} from "../types";

const identity = (value: string) => value.replace(/[^a-z0-9]/gi, "").toLowerCase();
const localSource = (section: CodeReferenceHelpSection) => ({
  ...section,
  source: section.source && { ...section.source, href: withBasePath(section.source.href) },
});

/** Select a symbol's documented rows, never another export's similarly named props table. */
export function referenceSourceSections(
  module: CodeReferenceSourceModule,
  symbol: CodeReferenceSourceSymbol,
  guide: string | undefined,
): CodeReferenceHelpSection[] {
  const sections: CodeReferenceHelpSection[] = [];
  if (symbol.kind === "component" && guide) {
    sections.push(...(module.sections ?? []).filter((section) => !section.fields).map(localSource));
    const declared = new Map((symbol.fields ?? []).map((field) => [field.name, field]));
    const tables = (module.sections ?? []).filter((section) => section.fields?.length);
    const matching =
      tables.find((section) => identity(section.contractName ?? "") === identity(symbol.name)) ??
      tables.find((section) =>
        section.fields?.some((field) => field.name.startsWith(`${symbol.name} `)),
      );
    if (matching) {
      const fields = matching
        .fields!.filter(
          (field) =>
            !field.name.endsWith("()") &&
            (!/^[A-Z]\w+\s/.test(field.name) || field.name.startsWith(`${symbol.name} `)),
        )
        .map((field) => {
          const source = declared.get(field.name.split(/\s+/).at(-1)!);
          return {
            ...field,
            required: source?.required ?? field.required,
            description: field.description || source?.description || "",
          };
        });
      if (fields.length) sections.push(localSource({ ...matching, fields }));
    } else if (symbol.fields?.length) {
      sections.push({
        title: "Props & data",
        detail: "Declared fields",
        contractName: `${symbol.name}Props`,
        fields: symbol.fields,
        source: guide
          ? { label: "Component API", href: withBasePath(`${guide}#api-reference`) }
          : undefined,
        note: "Only fields declared directly by this component are shown; inherited attributes stay in the full contract.",
      });
    }
  }
  // Reverse consumers belong in the index; a chapter explains only this symbol's own contracts.
  const definitions = new Map(
    module.symbols
      .filter((entry) => entry.kind === "type" && entry.typeId)
      .map((entry) => [entry.name, entry]),
  );
  const needed = new Set(symbol.typeNames);
  if (symbol.kind === "type") needed.add(symbol.name);
  for (const name of needed)
    for (const dependency of definitions.get(name)?.typeNames ?? []) needed.add(dependency);
  const declarations = [...needed]
    .flatMap((name) => {
      const entry = definitions.get(name);
      return entry?.declaration ? [entry] : [];
    })
    .slice(0, 3);
  if (declarations.length && guide)
    sections.push({
      title: "Local type definitions",
      detail: "Source contracts",
      source: { label: "Props and data definitions", href: withBasePath(`${guide}#api-reference`) },
      definitions: declarations.map((entry) => ({
        name: entry.name,
        code: entry.declaration!,
        source: {
          label: `${entry.name} complete definition`,
          href: withBasePath(`${guide}#${entry.typeId}`),
        },
      })),
      note: "These are the source declarations; imported and inherited types remain named rather than expanded.",
    });
  return sections;
}
