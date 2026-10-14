/** Build reference metadata from installed package manifests and checked-in component exports. */
import { readdir, readFile, realpath } from "node:fs/promises";
import { resolve } from "node:path";
import ts from "@typescript/typescript6";
import type { Plugin } from "vite";
import type { CodeReferencePackage } from "../src/references/types";
import {
  createCodeReferenceSourceModule,
  extractPackageReferenceSymbols,
} from "./code-reference-help";

const id = "virtual:kamod-code-references";
const resolvedId = `\0${id}`;
const helpId = "virtual:kamod-code-reference-help";
const resolvedHelpId = `\0${helpId}`;
const workspaces = ["core", "blocks", "docs", "themes", "typeset", "motion", "openui"];

/** GitHub only: registry strings and executable/non-web manifest URLs are not destinations. */
export function repositoryUrl(repository: unknown): string | undefined {
  const value =
    typeof repository === "string" ? repository : (repository as { url?: string } | undefined)?.url;
  if (!value) return;
  const normalized = value.replace(/^git\+/, "").replace(/\.git$/, "");
  if (/^[\w.-]+\/[\w.-]+$/.test(normalized)) return `https://github.com/${normalized}`;
  return /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/.test(normalized) ? normalized : undefined;
}

export function codeReferencePlugin(): Plugin {
  const root = resolve(import.meta.dirname, "../../..");
  let catalog: ReturnType<typeof buildCatalog> | undefined;
  let helpCatalog: ReturnType<typeof buildHelpCatalog> | undefined;
  const sourceHelp = new Map<string, ReturnType<typeof buildSourceHelp>>();
  const packageHelp = new Map<string, ReturnType<typeof buildPackageHelp>>();
  const buildCatalog = async () => {
    const repositories: Record<string, string> = {};
    for (const workspace of workspaces) {
      const directory = resolve(root, "packages", workspace);
      const manifest = JSON.parse(await readFile(resolve(directory, "package.json"), "utf8"));
      repositories[manifest.name] = "https://github.com/kamod-ch/kamod-ui";
      for (const name of Object.keys({
        ...manifest.dependencies,
        ...manifest.peerDependencies,
        ...manifest.devDependencies,
      })) {
        try {
          const dependency = JSON.parse(
            await readFile(resolve(directory, "node_modules", name, "package.json"), "utf8"),
          );
          const href = repositoryUrl(dependency.repository);
          if (href) repositories[name] = href;
        } catch {
          /* Optional/uninstalled packages have no verified destination. */
        }
      }
    }
    const components: Record<string, { slug: string; file: string }> = {};
    const directory = resolve(root, "packages/core/src/components");
    for (const path of (await readdir(directory, { recursive: true })).sort()) {
      if (!/\.(ts|tsx)$/.test(path) || /\.test\.| 2\./.test(path)) continue;
      const source = await readFile(resolve(directory, path), "utf8");
      const file = ts.createSourceFile(
        path,
        source,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      );
      for (const node of file.statements) {
        if (
          !ts.canHaveModifiers(node) ||
          !ts.getModifiers(node)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
        )
          continue;
        const names = ts.isVariableStatement(node)
          ? node.declarationList.declarations.map((d) => d.name)
          : "name" in node
            ? [node.name]
            : [];
        for (const name of names)
          if (name && ts.isIdentifier(name as ts.Node)) {
            components[(name as ts.Identifier).text] = {
              slug: path.split("/")[0],
              file: `packages/core/src/components/${path}`,
            };
          }
      }
    }
    const files = (
      await Promise.all(
        ["core", "blocks"].map(async (workspace) =>
          (await readdir(resolve(root, "packages", workspace, "src"), { recursive: true }))
            .filter((path) => /\.(ts|tsx|css)$/.test(path) && !/\.test\.| 2\./.test(path))
            .map((path) => `packages/${workspace}/src/${path}`),
        ),
      )
    )
      .flat()
      .sort();
    // A small name-to-module index enables prose detection without shipping declaration details.
    const symbols: Record<string, { module: string; imported: string }[]> = {};
    for (const name of ["preact", "@preact/signals"]) {
      const pending = packageHelp.get(name) ?? buildPackageHelp(name);
      packageHelp.set(name, pending);
      const declarations = await pending;
      for (const [module, exports] of Object.entries(declarations))
        for (const symbol of exports) {
          const entries = (symbols[symbol.name] ??= []);
          if (!entries.some((entry) => entry.module === module))
            entries.push({ module, imported: symbol.name });
        }
    }
    return { repositories, components, files, symbols };
  };
  const buildHelpCatalog = async () => {
    const navigation = await (catalog ??= buildCatalog());
    const packages: Record<string, CodeReferencePackage> = {};
    const record = (manifest: Record<string, unknown>, workspace = false) => {
      if (typeof manifest.name !== "string") return;
      packages[manifest.name] = {
        name: manifest.name,
        description: typeof manifest.description === "string" ? manifest.description : "",
        repository: workspace
          ? "https://github.com/kamod-ch/kamod-ui"
          : repositoryUrl(manifest.repository),
        homepage:
          typeof manifest.homepage === "string" && /^https?:\/\//.test(manifest.homepage)
            ? manifest.homepage
            : undefined,
        license: typeof manifest.license === "string" ? manifest.license : undefined,
      };
    };
    for (const workspace of workspaces) {
      const directory = resolve(root, "packages", workspace);
      const manifest = JSON.parse(await readFile(resolve(directory, "package.json"), "utf8"));
      record(manifest, true);
      for (const name of Object.keys({
        ...manifest.dependencies,
        ...manifest.peerDependencies,
        ...manifest.devDependencies,
      })) {
        if (Object.hasOwn(packages, name)) continue;
        try {
          record(
            JSON.parse(
              await readFile(resolve(directory, "node_modules", name, "package.json"), "utf8"),
            ),
          );
        } catch {
          /* Uninstalled optional packages have no source facts to display. */
        }
      }
    }
    const groups: Record<string, string[]> = {};
    for (const file of navigation.files) {
      const component = file.match(
        /^packages\/core\/src\/components\/([^/]+)\/.*\.(?:ts|tsx)$/,
      )?.[1];
      if (component) (groups[component] ??= []).push(file);
    }
    groups.cn = ["packages/core/src/lib/utils.ts"];
    return { packages, groups };
  };
  const buildSourceHelp = async (slug: string) => {
    const paths = (await (helpCatalog ??= buildHelpCatalog())).groups[slug];
    if (!paths) throw new Error(`Unknown source-reference module: ${slug}`);
    const sources = await Promise.all(
      paths.map(async (file) => ({ file, source: await readFile(resolve(root, file), "utf8") })),
    );
    let guide = "";
    try {
      guide = await readFile(
        resolve(root, "packages/docs/src/docs/pages", `${slug}-doc.tsx`),
        "utf8",
      );
    } catch {
      /* Undocumented core exports retain source links without invented local anchors. */
    }
    return createCodeReferenceSourceModule(slug, sources, guide);
  };
  const buildPackageHelp = async (name: string) => {
    const directory = await realpath(resolve(root, "packages/docs/node_modules", name));
    const manifest = JSON.parse(await readFile(resolve(directory, "package.json"), "utf8"));
    const result: Record<string, ReturnType<typeof extractPackageReferenceSymbols>> = {};
    const entries = name === "preact" ? [".", "./hooks"] : [".", "./utils"];
    for (const entry of entries) {
      const typePath =
        manifest.exports?.[entry]?.types || (entry === "." ? manifest.types : undefined);
      if (typeof typePath !== "string") continue;
      const file = resolve(directory, typePath);
      const source = await readFile(file, "utf8");
      const symbols = extractPackageReferenceSymbols(source, typePath);
      // A single, verified relative re-export level covers Preact's public DOM contracts.
      for (const match of source.matchAll(/export\s+\*\s+from\s+["'](\.\.?\/[^"']+)["']/g)) {
        try {
          const path = resolve(file, "..", `${match[1]}.d.ts`);
          symbols.push(...extractPackageReferenceSymbols(await readFile(path, "utf8"), match[1]));
        } catch {
          /* An unavailable declaration cannot provide tooltip facts. */
        }
      }
      if (name === "@preact/signals" && entry === ".") {
        const dependency = resolve(directory, "..", "signals-core");
        const coreManifest = JSON.parse(
          await readFile(resolve(dependency, "package.json"), "utf8"),
        );
        const coreSource = await readFile(resolve(dependency, coreManifest.types), "utf8");
        const tree = ts.createSourceFile(typePath, source, ts.ScriptTarget.Latest, true);
        const reexports = new Set(
          tree.statements.flatMap((statement) =>
            ts.isExportDeclaration(statement) &&
            statement.exportClause &&
            ts.isNamedExports(statement.exportClause)
              ? statement.exportClause.elements.map(
                  (element) => element.propertyName?.text || element.name.text,
                )
              : [],
          ),
        );
        symbols.push(
          ...extractPackageReferenceSymbols(coreSource, coreManifest.types).filter((symbol) =>
            reexports.has(symbol.name),
          ),
        );
      }
      result[entry === "." ? name : `${name}/${entry.slice(2)}`] = symbols;
    }
    return result;
  };
  return {
    name: "kamod-code-references",
    resolveId: (source) =>
      source === id
        ? resolvedId
        : source === helpId || source.startsWith(`${helpId}/`)
          ? `\0${source}`
          : undefined,
    async load(source) {
      if (source === resolvedId)
        return `export default ${JSON.stringify(await (catalog ??= buildCatalog()))}`;
      if (source === resolvedHelpId) {
        const { packages, groups } = await (helpCatalog ??= buildHelpCatalog());
        return `export default {packages:${JSON.stringify(packages)},packageLoaders:{${["preact", "@preact/signals"].map((name) => `${JSON.stringify(name)}:()=>import(${JSON.stringify(`${helpId}/dependency/${name}`)}).then(module=>module.default)`).join(",")}},loaders:{${Object.keys(
          groups,
        )
          .sort()
          .map(
            (slug) =>
              `${JSON.stringify(slug)}:()=>import(${JSON.stringify(`${helpId}/${slug}`)}).then(module=>module.default)`,
          )
          .join(",")}}};`;
      }
      if (source.startsWith(`${resolvedHelpId}/dependency/`)) {
        const name = source.slice(`${resolvedHelpId}/dependency/`.length);
        if (!["preact", "@preact/signals"].includes(name))
          throw new Error(`Unknown reference package: ${name}`);
        const result = packageHelp.get(name) ?? buildPackageHelp(name);
        packageHelp.set(name, result);
        return `export default ${JSON.stringify(await result)};`;
      }
      if (source.startsWith(`${resolvedHelpId}/`)) {
        const slug = source.slice(resolvedHelpId.length + 1);
        const group = (await (helpCatalog ??= buildHelpCatalog())).groups[slug];
        for (const file of group ?? []) this.addWatchFile(resolve(root, file));
        const result = sourceHelp.get(slug) ?? buildSourceHelp(slug);
        sourceHelp.set(slug, result);
        return `export default ${JSON.stringify(await result)};`;
      }
    },
    configureServer(server) {
      const invalidate = (_event: string, path: string) => {
        if (
          !/package\.json$|packages\/(core|blocks)\/src\/.*\.(ts|tsx|css)$|packages\/docs\/src\/docs\/pages\/.*-doc\.tsx$/.test(
            path,
          )
        )
          return;
        catalog = undefined;
        helpCatalog = undefined;
        sourceHelp.clear();
        packageHelp.clear();
        for (const module of server.moduleGraph.idToModuleMap.values())
          if (module.id === resolvedId || module.id?.startsWith(resolvedHelpId))
            server.moduleGraph.invalidateModule(module);
      };
      server.watcher.on("all", invalidate);
      server.httpServer?.once("close", () => server.watcher.off("all", invalidate));
    },
  };
}
