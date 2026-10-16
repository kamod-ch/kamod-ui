/** Block previews read registered source and reuse the installation guide's own import formatter. */
import type { BlockCategory, BlockOverviewEntry } from "../src/blocks/block-categories";
import { getBlockOverviewDetails } from "../src/blocks/block-overview-details";
import { variantImport } from "../src/blocks/detail/variant-examples";
import { getVariantFieldDescription } from "../src/blocks/detail/variant-field-descriptions";
import type { CodeReferenceHelpSection } from "../src/references/types";
import { extractCodeReferenceSymbols } from "./code-reference-help";

export function blockReferenceSections(
  category: BlockCategory,
  block: BlockOverviewEntry,
  sources: { file: string; source: string }[],
): CodeReferenceHelpSection[] {
  const shell = category === "application-shell";
  const number = block.id.split("-").at(-1)!;
  const component = shell
    ? `ApplicationShell${number}`
    : block.id
        .split("-")
        .map((part) => part[0].toUpperCase() + part.slice(1))
        .join("");
  const href = `/blocks/${category}/${block.id}`;
  const prefix = shell ? "application-shell" : block.id;
  const dependencies = getBlockOverviewDetails(category, block).dependencies;
  const localImport = shell
    ? `import { ${component} } from "./components/${number === "1" ? "application-shell-1" : `application-shell/${block.id}`}";`
    : variantImport({ component, category, block });
  const sections: CodeReferenceHelpSection[] = [
    {
      title: "Dependencies & setup",
      detail: "Local source",
      source: { label: "Styles and import", href: `${href}#${prefix}-styles` },
      description:
        "Copy the **complete registered file set**, install only missing dependencies, and import from the copied local folder.",
      rows: [{ label: "Dependencies", value: `\`pnpm add ${dependencies.join(" ")}\`` }],
      code: { language: "tsx", value: localImport, caption: "Guide import" },
      note: "Keep your existing theme owner; [CSS setup](/docs/theming/installation#css-setup) covers Tailwind source scanning and shared styles.",
    },
  ];
  const definitions = sources
    .filter(
      ({ file }) =>
        shell ||
        (category === "sidebar"
          ? /\/sidebar\/(?:shared|data)\//.test(file)
          : /\/(?:login-form|signup-form|auth-utils)\.tsx?$/.test(file)),
    )
    .flatMap(({ file, source }) => extractCodeReferenceSymbols(source, file))
    .filter((symbol) => symbol.kind === "type" && symbol.declaration)
    .filter(
      (symbol, position, all) => all.findIndex((other) => other.name === symbol.name) === position,
    );
  const primary =
    definitions.find((symbol) => symbol.name === `${component}Props` && symbol.fields?.length) ??
    definitions.find((symbol) => symbol.name.endsWith("Props") && symbol.fields?.length);
  if (primary)
    sections.push({
      title: shell ? "Props & data" : "Local props & data",
      detail: primary.name,
      contractName: primary.name,
      source: { label: "Props and data reference", href: `${href}#${prefix}-prop-reference` },
      fields: primary.fields!.map((field) => ({
        ...field,
        description:
          field.description ||
          (shell ? "" : getVariantFieldDescription(primary.name, field.name, field.type)),
      })),
      note: shell
        ? "Only directly declared fields are included; follow the complete contract for inherited shell inputs."
        : "These inputs configure a copied local helper; the exported demonstration page has no public props.",
    });
  const selected = definitions
    .filter((symbol) => symbol === primary || primary?.typeNames.includes(symbol.name))
    .slice(0, 3);
  if (selected.length)
    sections.push({
      title: "Data type reference",
      detail: "Copied contracts",
      source: {
        label: "Complete data contracts",
        href: `${href}#${prefix}-${shell ? (number === "1" ? "data-types" : "data-contracts") : "data-types"}`,
      },
      definitions: selected.map((symbol) => ({
        name: symbol.name,
        code: symbol.declaration!,
        source: {
          label: `${symbol.name} source`,
          href: `https://github.com/kamod-ch/kamod-ui/blob/main/${symbol.file}`,
        },
      })),
      note: "Source definitions keep imported types named; copy their supporting files together with the composition.",
    });
  return sections;
}
