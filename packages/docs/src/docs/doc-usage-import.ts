/** The article and lazy reference previews share the exact default usage import. */
import { docConsumerSnippet } from "./doc-consumer-snippet.ts";
import {
  docsPageSlugsLongestFirst,
  rewriteKamodCoreImportsInDocString,
} from "./doc-snippet-imports.ts";
import { docPackageImportPath, resolveSnippetImports } from "./doc-snippet-mode.ts";
import type { DocPageModule } from "./types.ts";

const imports: Record<string, string> = {
  button: "Button, Spinner",
  "button-group": "Button, ButtonGroup",
  tabs: "Tabs, TabsContent, TabsList, TabsTrigger",
  "alert-dialog":
    "AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger",
};

/** Shared component name used in import snippets and documentation source labels. */
export const docComponentName = (slug: string) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");

/** Preserve authored overrides; otherwise emit package subpaths or local aliases for the active mode. */
export function docUsageImport(
  doc: Pick<DocPageModule, "slug" | "usageImportSnippet" | "snippetImports">,
) {
  const { slug, usageImportSnippet } = doc;
  if (usageImportSnippet) {
    return resolveSnippetImports(doc as DocPageModule) === "package"
      ? docConsumerSnippet(usageImportSnippet, doc, docsPageSlugsLongestFirst)
      : usageImportSnippet;
  }
  const names = imports[slug] ?? docComponentName(slug);
  if (resolveSnippetImports(doc as DocPageModule) === "package") {
    return `import { ${names} } from "${docPackageImportPath(slug)}";`;
  }
  return rewriteKamodCoreImportsInDocString(`import { ${names} } from "@kamod-ch/ui";`, slug);
}
