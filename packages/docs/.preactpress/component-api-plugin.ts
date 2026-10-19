/** Extract documentation metadata during development/build; no compiler ships to the browser. */
import { readdir, readFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import ts from "@typescript/typescript6";
import type { Plugin } from "vite";

const catalogId = "virtual:kamod-component-api";
const resolvedCatalogId = `\0${catalogId}`;
type SourceGroups = Record<string, string[]>;

/** SSR reads every type synchronously; browsers request only the current component. */
export function componentApiCatalogModule(slugs: string[], ssr: boolean) {
  const entries = slugs.map((slug, index) => ({ slug, name: `types${index}` }));
  if (!ssr)
    return `export const sources = {}; export const loaders = {${entries
      .map(
        ({ slug }) =>
          `${JSON.stringify(slug)}: () => import(${JSON.stringify(`${catalogId}/${slug}`)}).then(module => module.default)`,
      )
      .join(",")}};`;
  return `${entries
    .map(({ slug, name }) => `import ${name} from ${JSON.stringify(`${catalogId}/${slug}`)};`)
    .join("\n")}\nexport const sources = {${entries
    .map(({ slug, name }) => `${JSON.stringify(slug)}: ${name}`)
    .join(",")}}; export const loaders = {};`;
}

/** Keep declarations verbatim and mark only required fields declared directly in a type. */
export function extractComponentTypes(source: string, filePath: string) {
  const file = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const docs = (node: ts.Node) =>
    (ts.getJSDocCommentsAndTags(node) as ts.JSDoc[])
      .map((doc) => (typeof doc.comment === "string" ? doc.comment : ""))
      .filter(Boolean)
      .join(" ");
  const members = (node: ts.Node): ts.TypeElement[] => {
    if (ts.isTypeLiteralNode(node) || ts.isInterfaceDeclaration(node)) return [...node.members];
    if (ts.isIntersectionTypeNode(node)) return node.types.flatMap(members);
    if (ts.isParenthesizedTypeNode(node)) return members(node.type);
    return [];
  };
  return file.statements.flatMap((node) => {
    if (!ts.isTypeAliasDeclaration(node) && !ts.isInterfaceDeclaration(node)) return [];
    const exported =
      node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false;
    if (!exported && !node.name.text.endsWith("Props")) return [];
    return [
      {
        name: node.name.text,
        source: node.getFullText(file).trim(),
        filePath,
        exported,
        description: docs(node),
        fields: members(ts.isTypeAliasDeclaration(node) ? node.type : node).flatMap((member) => {
          if (!ts.isPropertySignature(member) && !ts.isMethodSignature(member)) return [];
          return [
            {
              name: ts.isStringLiteral(member.name) ? member.name.text : member.name.getText(file),
              type: ts.isPropertySignature(member)
                ? (member.type?.getText(file) ?? "unknown")
                : member.getText(file),
              required: !member.questionToken,
              description: docs(member),
            },
          ];
        }),
      },
    ];
  });
}

export function componentApiPlugin(): Plugin {
  const repoRoot = resolve(import.meta.dirname, "../../..");
  const coreDirectory = resolve(repoRoot, "packages/core/src/components");
  const formsDirectory = resolve(repoRoot, "packages/docs/src/docs/forms/formisch");
  let groups: Promise<SourceGroups> | undefined;
  const discover = () =>
    (groups ??= Promise.all(
      [coreDirectory, formsDirectory].map(async (directory) => {
        const paths = await readdir(directory, { recursive: true });
        return paths
          .filter((path) => /\.(ts|tsx)$/.test(path) && !/\.test\.| 2\./.test(path))
          .sort()
          .map((path) => ({
            slug: directory === formsDirectory ? "formisch" : path.split(/[\\/]/)[0],
            path: resolve(directory, path),
          }));
      }),
    ).then((collections) => {
      const result: SourceGroups = {};
      for (const { slug, path } of collections.flat()) (result[slug] ??= []).push(path);
      return result;
    }));
  return {
    name: "kamod-component-api",
    enforce: "pre",
    resolveId(id) {
      if (id === catalogId || id.startsWith(`${catalogId}/`)) return `\0${id}`;
    },
    buildStart() {
      groups = undefined;
    },
    configureServer(server) {
      // New or removed declarations must update the virtual import lists during development.
      const invalidate = (path: string) => {
        if (![coreDirectory, formsDirectory].some((directory) => path.startsWith(`${directory}/`)))
          return;
        groups = undefined;
        for (const module of server.moduleGraph.idToModuleMap.values())
          if (module.id?.startsWith(resolvedCatalogId)) server.moduleGraph.invalidateModule(module);
      };
      server.watcher.on("add", invalidate).on("unlink", invalidate);
      server.httpServer?.once("close", () => {
        server.watcher.off("add", invalidate).off("unlink", invalidate);
      });
    },
    async load(id, options) {
      if (id === resolvedCatalogId) {
        const sources = await discover();
        return componentApiCatalogModule(Object.keys(sources).sort(), Boolean(options?.ssr));
      }
      if (id.startsWith(`${resolvedCatalogId}/`)) {
        const slug = id.slice(resolvedCatalogId.length + 1);
        const paths = (await discover())[slug];
        if (!paths) throw new Error(`Unknown component API: ${slug}`);
        return `${paths
          .map(
            (path, index) =>
              `import types${index} from ${JSON.stringify(`${path}?component-api`)};`,
          )
          .join("\n")}\nexport default [${paths.map((_, index) => `...types${index}`).join(",")}];`;
      }
      if (!id.endsWith("?component-api")) return;
      const file = id.slice(0, -"?component-api".length);
      this.addWatchFile(file);
      const definitions = extractComponentTypes(
        await readFile(file, "utf8"),
        relative(repoRoot, file).replaceAll("\\", "/"),
      );
      return `export default ${JSON.stringify(definitions)};`;
    },
  };
}
