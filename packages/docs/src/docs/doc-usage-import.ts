/** The article and lazy reference previews share the exact default usage import. */
import { rewriteKamodCoreImportsInDocString } from "./doc-snippet-imports";

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

/** Preserve authored overrides; otherwise follow the same local-source rewrite as the guide. */
export function docUsageImport({
  slug,
  usageImportSnippet,
}: {
  slug: string;
  usageImportSnippet?: string;
}) {
  if (usageImportSnippet) return usageImportSnippet;
  const componentName = docComponentName(slug);
  return rewriteKamodCoreImportsInDocString(
    `import { ${imports[slug] ?? componentName} } from "@kamod-ch/ui";`,
    slug,
  );
}
