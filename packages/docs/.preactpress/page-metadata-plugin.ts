import ts from "@typescript/typescript6";
import type { Plugin } from "vite";

// Layout owns these routes. Until their full page JSON loads it only needs to know
// whether to show the compact preview loading view; the document head keeps its metadata.
const ownedPageKinds = new Set([
  "not-found",
  "home",
  "kitchen-sink",
  "blocks-overview",
  "blocks-guide",
  "getting-started-guide",
  "docs-overview",
  "docs-forms-overview",
  "docs-packages-overview",
  "component-doc",
  "component-preview",
  "blocks-sidebar",
  "blocks-sidebar-detail",
  "blocks-application-shell",
  "blocks-application-shell-detail",
  "application-shell-block-preview",
  "blocks-app-sidebar",
  "blocks-auth-detail",
  "blocks-auth",
  "blocks-auth-catalog",
  "blocks-marketing",
  "blocks-dashboard",
  "blocks-communication",
  "blocks-commerce",
  "block-preview",
  "app-sidebar-block-preview",
  "auth-block-preview",
  "catalog-auth-block-preview",
  "marketing-block-preview",
  "dashboard-block-preview",
  "communication-block-preview",
  "commerce-block-preview",
]);

type PageMetadata = Record<string, unknown> & {
  kind?: string;
  meta?: Record<string, unknown>;
};

/** Keep pending-route metadata small; fetched page data and SSR retain the complete record. */
export function compactPageMetadataModule(source: string): string {
  const file = ts.createSourceFile(
    "pages.js",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS,
  );
  let declaration: ts.VariableDeclaration | undefined;
  for (const statement of file.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    declaration ??= statement.declarationList.declarations.find(
      (item) => ts.isIdentifier(item.name) && item.name.text === "pagesMeta",
    );
  }
  const initializer = declaration?.initializer;
  if (!initializer || !ts.isObjectLiteralExpression(initializer))
    throw new Error("PreactPress pagesMeta changed shape; review the page metadata optimization.");
  let pages: Record<string, PageMetadata>;
  try {
    // PreactPress 2.2 emits this initializer with JSON.stringify. Parse data only,
    // never execute generated module text; reject upstream format changes explicitly.
    pages = JSON.parse(initializer.getText(file));
  } catch {
    throw new Error(
      "PreactPress pagesMeta is no longer JSON; review the page metadata optimization.",
    );
  }
  for (const [route, page] of Object.entries(pages)) {
    if (page.kind !== "markdown" || !ownedPageKinds.has(String(page.meta?.pageKind))) continue;
    const { kind, title, description, tags, image, pageType } = page;
    pages[route] = {
      kind,
      title,
      description,
      ...(Array.isArray(tags) && tags.length ? { tags } : {}),
      ...(image ? { image } : {}),
      ...(pageType ? { pageType } : {}),
      meta: {
        pageKind: page.meta!.pageKind,
        ...(page.meta!.titleTemplate !== undefined
          ? { titleTemplate: page.meta!.titleTemplate }
          : {}),
      },
    };
  }
  return `${source.slice(0, initializer.getStart(file))}${JSON.stringify(pages)}${source.slice(initializer.end)}`;
}

/** Touch only the browser's generated metadata module; keep SSR and other virtual modules intact. */
export function pageMetadataPlugin(): Plugin {
  return {
    name: "kamod-page-metadata",
    enforce: "post",
    transform(source, id, options) {
      if (options?.ssr || id !== "\0virtual:preactpress-pages") return;
      return { code: compactPageMetadataModule(source), map: null };
    },
  };
}
