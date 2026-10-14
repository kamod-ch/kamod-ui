import catalog from "virtual:kamod-code-references";
import type { CodeReferenceResolver } from "@kamod-ch/ui/code";
import { withBasePath } from "../base-path";
import { kamodReferenceHref } from "../docs/components/brand/kamod-references";
import { inlineReference } from "../docs/components/inline-reference-catalog";
import { docsNavigation } from "../docs/generated-navigation";

const files = new Set(catalog.files);
const componentFor = (name: string | undefined) =>
  name && Object.hasOwn(catalog.components, name) ? catalog.components[name] : undefined;
const routes = new Set<string>(docsNavigation.map((doc) => doc.slug));
const packages: Readonly<Record<string, string>> = {
  "@kamod-ch/ui": "/docs/components",
  "@kamod-ch/blocks": "/blocks",
  "@kamod-ch/themes": "/docs/theming/installation",
  "@kamod-ch/icons": "/docs/icons-package/installation",
  "@kamod-ch/hooks": "/docs/hooks-package/installation",
  "@kamod-ch/signals": "/docs/signals-package/installation",
  "@kamod-ch/state": "/docs/state-package/installation",
  "@kamod-ch/i18n": "/docs/i18n-package/installation",
  "@kamod-ch/ui-motion": "/docs/ui-motion/installation",
  "@formisch/preact": "/docs/formisch/installation",
};
const rootPackage = (module: string) =>
  module.startsWith("@") ? module.split("/").slice(0, 2).join("/") : module.split("/")[0];

/** Prefer actual local API/source guides, then checkout-derived files or installed GitHub metadata. */
export const resolveCodeReference: CodeReferenceResolver = ({
  module,
  imported,
  local,
  filePath,
}) => {
  if (module.startsWith(".") && filePath?.startsWith("packages/")) {
    const parts = filePath.replaceAll("\\", "/").split("/").slice(0, -1);
    for (const segment of module.split("/")) {
      if (segment === "..") parts.pop();
      else if (segment !== ".") parts.push(segment);
    }
    const path = parts.join("/");
    const file = [path, `${path}.tsx`, `${path}.ts`, `${path}/index.tsx`, `${path}/index.ts`].find(
      (path) => files.has(path),
    );
    if (file) {
      const component = componentFor(imported);
      return component?.file === file && routes.has(component.slug)
        ? withBasePath(`/docs/${component.slug}/installation#api-reference`)
        : `https://github.com/kamod-ch/kamod-ui/blob/main/${file}`;
    }
    return;
  }
  const uiAlias = /^@\/(?:components\/kamod-ui\/|lib\/utils)/.test(module);
  const name = uiAlias ? "@kamod-ch/ui" : rootPackage(module);
  if (module.split("/").some((segment) => segment === "." || segment === "..")) return;
  const repository =
    (Object.hasOwn(catalog.repositories, name) ? catalog.repositories[name] : undefined) ??
    kamodReferenceHref(name);
  const guide = Object.hasOwn(packages, name) ? packages[name] : undefined;
  const exportName = imported === "default" ? local : imported;
  if (name === "@kamod-ch/ui") {
    const slug = uiAlias ? module.split("/").at(-1) : module.slice(name.length + 1).split("/")[0];
    if (!imported || imported === "*") {
      return withBasePath(
        ["utils", "lib"].includes(slug ?? "") && module.endsWith("utils")
          ? "/docs/cn/installation#api-reference"
          : routes.has(slug ?? "")
            ? `/docs/${slug}/installation#api-reference`
            : guide!,
      );
    }
    if (exportName === "cn") return withBasePath("/docs/cn/installation#api-reference");
    const component = componentFor(exportName);
    if (component && (!slug || slug === component.slug || slug === "index")) {
      return routes.has(component.slug)
        ? withBasePath(`/docs/${component.slug}/installation#api-reference`)
        : `${repository}/blob/main/${component.file}`;
    }
    return repository;
  }
  if (name === "@kamod-ch/blocks" && exportName) {
    const reference = inlineReference(exportName);
    if (reference?.kind === "block") return withBasePath(reference.href);
  }
  if (name === "@formisch/preact" && imported)
    return withBasePath("/docs/formisch/installation#anatomy");
  if (!imported || imported === "*") return guide ? withBasePath(guide) : repository;
  // These package guides have no separate on-site source for each imported helper/icon.
  const reference = exportName ? inlineReference(exportName) : undefined;
  if (reference?.kind === "api" && name.startsWith("@kamod-ch/")) return reference.href;
  return repository;
};
