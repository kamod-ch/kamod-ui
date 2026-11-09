import type { DocPageModule } from "./types";

/** Package-oriented snippets are the default for installable component, form, and motion guides. */
export function resolveSnippetImports(doc: DocPageModule): "local" | "package" {
  if (doc.snippetImports) return doc.snippetImports;
  if (doc.navGroup === "packages") return "package";
  if (doc.guideContents) return "local";
  if (
    doc.navGroup === "forms" ||
    doc.navGroup === "motion" ||
    doc.navGroup === "components" ||
    !doc.navGroup
  ) {
    return "package";
  }
  return "local";
}

export function docPackageImportPath(slugOrSubpath: string): string {
  return `@kamod-ch/ui/${slugOrSubpath}`;
}
