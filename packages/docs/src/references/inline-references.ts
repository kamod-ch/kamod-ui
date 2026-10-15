import catalog from "virtual:kamod-code-references";
import { inlineReference } from "../docs/components/inline-reference-catalog";
import { packageApiReferences } from "../docs/components/package-api-references";
import { packageLabels, rootPackageName } from "./catalog/packages";
import { resolveCodeReference } from "./destinations";
import { inlineContextReference } from "./inline-context-reference";
import type { CodeReferenceHelpRequest } from "./types";

const componentSlugs = new Set(Object.values(catalog.components).map(({ slug }) => slug));
const files = new Set(catalog.files);

/** Resolve verified symbols or whole context labels, preserving the exact visible code. */
export function inlineSourceReference(
  label: string,
  href?: string,
): CodeReferenceHelpRequest | undefined {
  const text = label.trim().replace(/^([A-Za-z_$][\w$]*)\(\)$/, "$1");
  if (!text) return;
  if (href !== undefined && !/^(?:https?:\/\/|\/(?!\/)|#)/i.test(href)) return;
  let module: string;
  let imported: string | undefined;
  const isModule =
    !/\s|[<>"'`{}=()]/.test(text) && Object.hasOwn(catalog.repositories, rootPackageName(text));
  const named = inlineReference(text);
  const componentName = Object.hasOwn(catalog.componentLabels, text.toLowerCase())
    ? catalog.componentLabels[text.toLowerCase()]
    : named?.label;
  if (Object.hasOwn(catalog.components, text) || text === "cn") {
    module = "@kamod-ch/ui";
    imported = text;
  } else if (componentName && Object.hasOwn(catalog.components, componentName)) {
    module = "@kamod-ch/ui";
    imported = componentName;
  } else if (Object.hasOwn(packageApiReferences, text)) {
    const source = packageApiReferences[text].href.match(
      /github\.com\/kamod-ch\/kamod-([^/]+)\/blob\/main\/packages\/core\/src\/(.+)$/,
    );
    if (!source) return;
    module = `@kamod-ch/${source[1]}${source[2].startsWith("preact") ? "/preact" : ""}`;
    imported = text;
  } else if (Object.hasOwn(catalog.symbols, text)) {
    const entries = catalog.symbols[text];
    if (entries.length !== 1) return;
    ({ module, imported } = entries[0]);
  } else if (
    text === label.trim() &&
    named?.kind === "package" &&
    Object.hasOwn(packageLabels, text.toLowerCase())
  ) {
    module = packageLabels[text.toLowerCase()];
  } else if (text !== label.trim()) {
    // Empty-call normalization applies to verified symbols, never a product or package name.
    return;
  } else if (text.startsWith("@/components/kamod-ui/") || text === "@/lib/utils") {
    const slug = text.split("/").at(-1);
    if (text !== "@/lib/utils" && !componentSlugs.has(slug ?? "")) return;
    module = text;
  } else if (files.has(text)) {
    // A real repository file uses the existing relative-file contract, with an explicit base.
    module = `./${text.split("/").at(-1)}`;
    const destination = `https://github.com/kamod-ch/kamod-ui/blob/main/${text}`;
    return { label, module, filePath: text, href: href ?? destination };
  } else if (isModule && text.includes("/")) {
    const block = inlineContextReference(catalog.inline, label, href);
    if (block?.referenceId?.startsWith("block:")) return block;
    // A real package specifier stays a module even when its authored link points to a page.
    module = text;
  } else {
    const contextual = inlineContextReference(catalog.inline, label, href);
    if (contextual && (!isModule || !contextual.referenceId?.startsWith("page:")))
      return contextual;
    if (!isModule) return;
    module = text;
  }
  const destination = resolveCodeReference({ module, imported, local: imported });
  if (!destination) return;
  return { label, module, imported, local: imported, href: href ?? destination };
}

/** One metadata contract for component-rendered prose and delegated Markdown/raw JSX terms. */
export const referenceAttributes = (request: CodeReferenceHelpRequest) => ({
  "data-code-module": request.module,
  "data-code-imported": request.imported,
  "data-code-local": request.local,
  "data-code-file": request.filePath,
  "data-code-reference": request.referenceId,
  "data-code-href": request.href,
});
