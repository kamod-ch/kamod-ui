import { readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const srcRoot = join(packageRoot, "src");

const PURE_SUBPATHS = [
  "./utils",
  "./lib/utils",
  "./alert",
  "./aspect-ratio",
  "./avatar",
  "./badge",
  "./breadcrumb",
  "./button",
  "./button-group",
  "./calendar",
  "./card",
  "./chart",
  "./checkbox",
  "./code",
  "./copy-button",
  "./data-table",
  "./direction",
  "./empty",
  "./field",
  "./image",
  "./input",
  "./input-group",
  "./item",
  "./kbd",
  "./label",
  "./locale-segment-group",
  "./native-select",
  "./pagination",
  "./progress",
  "./prose",
  "./radio-group",
  "./scroll-area",
  "./selectable-card",
  "./separator",
  "./skeleton",
  "./spinner",
  "./switch",
  "./table",
  "./textarea",
  "./theme-toggle",
  "./toggle",
  "./toggle-group",
  "./typography",
  "./video",
];

const extensions = [".tsx", ".ts", ".jsx", ".js"];

function resolveImport(fromFile: string, specifier: string): string | null {
  if (!specifier.startsWith(".")) return null;
  const base = resolve(dirname(fromFile), specifier);
  const candidates = [
    base,
    ...extensions.map((extension) => base + extension),
    ...extensions.map((extension) => join(base, `index${extension}`)),
  ];
  for (const candidate of candidates) {
    try {
      if (statSync(candidate).isFile()) return candidate;
    } catch {
      // try the next candidate
    }
  }
  return null;
}

function importsSignals(entry: string): boolean {
  const seen = new Set<string>();
  const visit = (file: string) => {
    if (seen.has(file)) return;
    seen.add(file);
    const source = readFileSync(file, "utf8");
    const specifiers = [...source.matchAll(/(?:from|import)\s*\(?\s*["']([^"']+)["']/g)].map(
      (match) => match[1],
    );
    for (const specifier of specifiers) {
      if (specifier === "@preact/signals" || specifier.includes("lib/signals")) return;
      const next = resolveImport(file, specifier);
      if (next) visit(next);
    }
  };
  visit(entry);
  for (const file of seen) {
    const source = readFileSync(file, "utf8");
    if (source.includes("@preact/signals") || source.includes("lib/signals")) return true;
  }
  return false;
}

function entryFile(subpath: string): string {
  const packageJson = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf8")) as {
    exports: Record<string, { import?: string }>;
  };
  const specifier = packageJson.exports[subpath]?.import;
  if (!specifier) throw new Error(`Missing export ${subpath}`);
  const relative = specifier.replace(/^\.\/dist\//, "").replace(/\.js$/, ".ts");
  const file = join(srcRoot, relative);
  try {
    if (statSync(file).isFile()) return file;
  } catch {
    // fall through to index.ts
  }
  return join(srcRoot, relative.replace(/\.ts$/, ""), "index.ts");
}

describe("subpath signal boundary", () => {
  it("keeps presentational entries free of @preact/signals", () => {
    const signalFree = PURE_SUBPATHS.filter((subpath) => !importsSignals(entryFile(subpath)));
    expect(signalFree).toEqual(PURE_SUBPATHS);
  });
});
