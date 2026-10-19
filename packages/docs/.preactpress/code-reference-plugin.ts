/** Build reference metadata from installed package manifests and checked-in component exports. */
import { readdir, readFile, realpath } from "node:fs/promises";
import { resolve } from "node:path";
import ts from "@typescript/typescript6";
import type { Plugin } from "vite";
import { docsNavigation } from "../src/docs/generated-navigation";
import {
  createCodeReferenceSourceModule,
  extractPackageReferenceSymbols,
} from "./code-reference-help";
import { buildInlineReferenceCatalog } from "./inline-reference-catalog";
import { buildReferencePackages } from "./reference-package-catalog";
import {
  buildTechnologyProjectResources,
  isTechnologyResourceSource,
} from "./technology-project-resources";
import { technologySnapshotFile } from "./technology-reference-snapshots";

const id = "virtual:kamod-code-references";
const resolvedId = `\0${id}`;
const helpId = "virtual:kamod-code-reference-help";
const resolvedHelpId = `\0${helpId}`;
const declarationPackages = ["preact", "@preact/signals", "@kamod-ch/themes"];

export function codeReferencePlugin(): Plugin {
  const root = resolve(import.meta.dirname, "../../..");
  let catalog: ReturnType<typeof buildCatalog> | undefined;
  let helpCatalog: ReturnType<typeof buildHelpCatalog> | undefined;
  let inlineCatalog: ReturnType<typeof buildInlineReferenceCatalog> | undefined;
  const inline = () => (inlineCatalog ??= buildInlineReferenceCatalog(root));
  let projectResources: ReturnType<typeof buildTechnologyProjectResources> | undefined;
  const resources = () =>
    (projectResources ??= inline().then(({ families }) =>
      buildTechnologyProjectResources(root, families.page),
    ));
  let packageCatalog: ReturnType<typeof buildReferencePackages> | undefined;
  const packageFacts = () => (packageCatalog ??= buildReferencePackages(root));
  const sourceHelp = new Map<string, ReturnType<typeof buildSourceHelp>>();
  const packageHelp = new Map<string, ReturnType<typeof buildPackageHelp>>();
  const buildCatalog = async () => {
    const { repositories, packageSources } = await packageFacts();
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
    for (const name of declarationPackages) {
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
    const componentLabels: Record<string, string> = {};
    for (const doc of docsNavigation) {
      if (doc.group !== "components") continue;
      const label = doc.label.replace(/[^a-z0-9]/gi, "").toLowerCase();
      const names = Object.keys(components).filter(
        (name) => components[name].slug === doc.slug && name.toLowerCase() === label,
      );
      if (names.length === 1) componentLabels[doc.label.toLowerCase()] = names[0];
    }
    return {
      repositories,
      packageSources,
      components,
      componentLabels,
      files,
      symbols,
      inline: (await inline()).index,
    };
  };
  const buildHelpCatalog = async () => {
    const navigation = await (catalog ??= buildCatalog());
    const { packages } = await packageFacts();
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
      if (source === resolvedId) {
        this.addWatchFile(technologySnapshotFile(root));
        return `export default ${JSON.stringify(await (catalog ??= buildCatalog()))}`;
      }
      if (source === resolvedHelpId) {
        const { packages, groups } = await (helpCatalog ??= buildHelpCatalog());
        const familyLoaders = Object.keys((await inline()).families)
          .map(
            (kind) =>
              `${JSON.stringify(kind)}:()=>import(${JSON.stringify(`${helpId}/inline/${kind}`)}).then(module=>module.default)`,
          )
          .join(",");
        return `export default {packages:${JSON.stringify(packages)},technologyResources:()=>import(${JSON.stringify(`${helpId}/technology-resources`)}).then(module=>module.default),inlineLoaders:{${familyLoaders}},packageLoaders:{${declarationPackages.map((name) => `${JSON.stringify(name)}:()=>import(${JSON.stringify(`${helpId}/dependency/${name}`)}).then(module=>module.default)`).join(",")}},loaders:{${Object.keys(
          groups,
        )
          .sort()
          .map(
            (slug) =>
              `${JSON.stringify(slug)}:()=>import(${JSON.stringify(`${helpId}/${slug}`)}).then(module=>module.default)`,
          )
          .join(",")}}};`;
      }
      if (source === `${resolvedHelpId}/technology-resources`) {
        const indexed = await resources();
        for (const file of indexed.files) this.addWatchFile(file);
        return `export default ${JSON.stringify(indexed.resources)};`;
      }
      if (source.startsWith(`${resolvedHelpId}/inline/`)) {
        this.addWatchFile(technologySnapshotFile(root));
        const kind = source.slice(`${resolvedHelpId}/inline/`.length);
        const families = (await inline()).families;
        if (!Object.hasOwn(families, kind))
          throw new Error(`Unknown inline-reference family: ${kind}`);
        return `export default ${JSON.stringify(families[kind])};`;
      }
      if (source.startsWith(`${resolvedHelpId}/dependency/`)) {
        const name = source.slice(`${resolvedHelpId}/dependency/`.length);
        if (!declarationPackages.includes(name))
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
      server.watcher.add(technologySnapshotFile(root));
      const invalidate = (_event: string, path: string) => {
        if (
          path !== technologySnapshotFile(root) &&
          !isTechnologyResourceSource(path) &&
          !/package\.json$|packages\/(core|blocks)\/src\/.*\.(ts|tsx|css|json)$|packages\/docs\/(?:docs|blocks)\/.*\.md$|packages\/docs\/src\/(?:references\/catalog\/|docs\/|blocks\/(?:detail\/|BlockOverviewPage)).*\.(ts|tsx)$/.test(
            path,
          )
        )
          return;
        catalog = undefined;
        packageCatalog = undefined;
        inlineCatalog = undefined;
        projectResources = undefined;
        helpCatalog = undefined;
        sourceHelp.clear();
        packageHelp.clear();
        for (const module of server.moduleGraph.idToModuleMap.values())
          if (module.id === resolvedId || module.id?.startsWith(resolvedHelpId))
            server.moduleGraph.invalidateModule(module);
        // Browser family promises must not keep data from a previous authored snapshot/index.
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("all", invalidate);
      server.httpServer?.once("close", () => server.watcher.off("all", invalidate));
    },
  };
}
