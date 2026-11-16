import { existsSync, readFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import type { Plugin } from "vite";

const coreRoot = resolve(import.meta.dirname, "../../core");
const docsRoot = resolve(import.meta.dirname, "..");

type PackageExport = string | { types?: string; import?: string; default?: string };

/** Map a published `dist` target onto the source file Vite and TypeScript should read. */
function sourceFileForPublished(published: string): string | null {
  const normalized = published.replace(/^\.\//, "");
  if (!normalized.startsWith("dist/")) return null;
  let rel = normalized.slice("dist/".length);
  if (rel.endsWith(".d.ts")) rel = `${rel.slice(0, -5)}.ts`;
  else if (rel.endsWith(".js")) rel = `${rel.slice(0, -3)}.ts`;
  const candidates = rel.endsWith(".ts") ? [rel, rel.replace(/\.ts$/, ".tsx")] : [rel];
  for (const candidate of candidates) {
    const file = resolve(coreRoot, "src", candidate);
    if (existsSync(file)) return file;
  }
  return null;
}

function publishedTarget(value: PackageExport): string | null {
  if (typeof value === "string") return value;
  return value.import ?? value.default ?? value.types ?? null;
}

export type UiSourceEntry = { specifier: string; file: string };

/** Every `@kamod-ch/ui` export, resolved to the current core source file. */
export function kamodUiSourceEntries(): UiSourceEntry[] {
  const manifest = JSON.parse(readFileSync(resolve(coreRoot, "package.json"), "utf8")) as {
    exports: Record<string, PackageExport>;
  };
  const entries: UiSourceEntry[] = [];
  for (const [key, value] of Object.entries(manifest.exports)) {
    const published = publishedTarget(value);
    if (!published) continue;
    const file = sourceFileForPublished(published);
    if (!file) {
      throw new Error(`No core source file for @kamod-ch/ui export ${key} (${published})`);
    }
    const specifier = key === "." ? "@kamod-ch/ui" : `@kamod-ch/ui${key.slice(1)}`;
    entries.push({ specifier, file });
  }
  return entries.sort((a, b) => b.specifier.length - a.specifier.length);
}

/**
 * Docs-local `@/components/kamod-ui/*` redirect.
 * `@kamod-ch/ui` exports are resolved by {@link kamodUiSourceAliasPlugin}. One alias per export
 * makes Vite's native resolver drop optional peers such as `@kamod-ch/themes`.
 */
export function kamodUiViteAliases(): { find: RegExp; replacement: string }[] {
  return [
    {
      find: /^@\/components\/kamod-ui\/(.+)$/,
      replacement: `${resolve(coreRoot, "src/components")}/$1/index.ts`,
    },
  ];
}

/** Resolve every `@kamod-ch/ui` export to the current core source file. */
export function kamodUiSourceAliasPlugin(): Plugin {
  const entries = new Map(kamodUiSourceEntries().map((entry) => [entry.specifier, entry.file]));
  return {
    name: "kamod-ui-source-alias",
    enforce: "pre",
    resolveId(id) {
      return entries.get(id);
    },
  };
}

/** `packages/docs/tsconfig.json` paths for the same source files. */
export function kamodUiTsconfigPaths(): Record<string, string[]> {
  const paths: Record<string, string[]> = {
    "@/components/kamod-ui/*": ["../core/src/components/*/index.ts"],
  };
  for (const entry of kamodUiSourceEntries()) {
    const rel = relative(docsRoot, entry.file).replaceAll("\\", "/");
    paths[entry.specifier] = [rel.startsWith(".") ? rel : `./${rel}`];
  }
  return paths;
}
