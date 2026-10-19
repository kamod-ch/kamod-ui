import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import ts from "@typescript/typescript6";
import { marked } from "marked";
import { docsRouteManifest } from "../src/docs/generated-manifest.ts";
import { docsNavigation } from "../src/docs/generated-navigation.ts";
import type { CodeReferenceHelp } from "../src/references/types.ts";

/** Read authored literal heading IDs without importing/evaluating a page or its demo components. */
export function sourceSectionIds(source: string, category?: string, prefix = "") {
  const tree = ts.createSourceFile(
    "page.tsx",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const ids = new Set<string>();
  const visit = (node: ts.Node) => {
    if (ts.isConditionalExpression(node) && category) {
      const condition = node.condition.getText(tree).match(/^category === ["']([^"']+)["']$/);
      if (condition) {
        visit(category === condition[1] ? node.whenTrue : node.whenFalse);
        return;
      }
    }
    if (
      ts.isPropertyAssignment(node) &&
      /^(id|headingId)$/.test(node.name.getText(tree)) &&
      ts.isStringLiteral(node.initializer)
    )
      ids.add(node.initializer.text);
    if (
      ts.isJsxAttribute(node) &&
      /^(id|headingId)$/.test(node.name.getText(tree)) &&
      node.initializer &&
      ts.isStringLiteral(node.initializer)
    )
      ids.add(node.initializer.text);
    if (
      prefix &&
      ts.isCallExpression(node) &&
      node.expression.getText(tree) === "heading" &&
      node.arguments[0] &&
      ts.isStringLiteral(node.arguments[0])
    )
      ids.add(`${prefix}-${node.arguments[0].text}`);
    ts.forEachChild(node, visit);
  };
  visit(tree);
  return [...ids];
}

/** Canonical routes only; section redirects reuse their owning page at lookup time. */
export async function buildReferencePages(root: string) {
  const routes: Record<string, string[]> = {};
  const pages: Record<string, CodeReferenceHelp> = {};
  const add = (path: string, title: string, description: string, sections: string[]) => {
    routes[path] = [...new Set(["page-title", ...sections])];
    pages[`page:${path}`] = {
      kind: "page",
      name: title,
      module: path,
      originLabel: "Page",
      description:
        description ||
        `Documentation for ${title}. Open the page for its examples and reference sections.`,
      docs: { label: "Read the page", href: path },
    };
  };
  for (const route of docsRouteManifest) {
    const doc = docsNavigation.find(({ slug }) => slug === route.slug);
    add(`/docs/${route.slug}/installation`, doc?.label ?? route.slug, "", [...route.sections]);
  }
  const field = (source: string, name: string) =>
    source.match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1]?.replace(/^['"]|['"]$/g, "") ?? "";
  for (const area of ["docs", "blocks"]) {
    const directory = resolve(root, "packages/docs", area);
    for (const file of (await readdir(directory, { recursive: true })).sort()) {
      if (!file.endsWith(".md") || /(?:^|\/)(?:preview|collapsed|mobile)(?:\/|\.md$)/.test(file))
        continue;
      if (area === "docs" && docsRouteManifest.some(({ slug }) => file.startsWith(`${slug}/`)))
        continue;
      const source = await readFile(resolve(directory, file), "utf8");
      if (/^pageKind: ["']?component-doc["']?$/m.test(source)) continue;
      const title = field(source, "title");
      if (!title) continue;
      const path =
        `/${area}/${file.replace(/(?:\/index)?\.md$/, "").replace(/^index$/, "")}`.replace(
          /\/$/,
          "",
        );
      if (routes[path]) continue;
      const content = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
      const sections = marked.lexer(content).flatMap((token) =>
        token.type === "heading" && token.depth >= 2
          ? [
              token.text
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, ""),
            ]
          : [],
      );
      add(path, title, field(source, "description"), sections);
    }
  }
  for (const [path, file] of Object.entries({
    "/docs/components": "docs/DocsOverviewContent.tsx",
    "/docs/packages": "docs/DocsPackagesOverviewContent.tsx",
    "/docs/forms": "docs/DocsFormsOverviewContent.tsx",
    "/blocks": "blocks/BlockOverviewPage.tsx",
  })) {
    const source = await readFile(resolve(root, "packages/docs/src", file), "utf8");
    routes[path].push(...sourceSectionIds(source));
  }
  return { routes, pages };
}
