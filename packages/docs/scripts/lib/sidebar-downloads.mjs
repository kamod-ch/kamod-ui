/** Build-only sidebar installer: follow real imports, relocate files and produce deterministic ZIPs. */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { strToU8, zipSync } from "fflate";
import ts from "typescript";

export const blocksRoot = resolve(import.meta.dirname, "../../../blocks");
const manifestPath = resolve(blocksRoot, "src/sidebar/installation-manifest.json");
const sourceRoot = resolve(blocksRoot, "src");
const slash = (path) => path.replaceAll("\\", "/");

/** Inspect syntax, not text replacements: comments and ordinary strings are never rewritten. */
export function moduleReferences(filename, source) {
  const tree = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true);
  const references = [];
  function visit(node) {
    const specifier =
      ts.isImportDeclaration(node) || ts.isExportDeclaration(node)
        ? node.moduleSpecifier
        : ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)
          ? node.argument.literal
          : ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword
            ? node.arguments[0]
            : undefined;
    if (specifier && ts.isStringLiteral(specifier)) {
      references.push({
        value: specifier.text,
        start: specifier.getStart(tree) + 1,
        end: specifier.end - 1,
      });
    } else if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
      throw new Error(`Non-literal dynamic import cannot be exported: ${filename}`);
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);
  return references;
}

function resolveLocal(importer, specifier) {
  const [path, query = ""] = specifier.split("?");
  const base = resolve(dirname(importer), path);
  const filename = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}/index.ts`,
    `${base}/index.tsx`,
  ].find((candidate) => existsSync(candidate) && statSync(candidate).isFile());
  if (!filename || !filename.startsWith(`${sourceRoot}/`)) {
    throw new Error(`Unresolvable or out-of-scope import in ${importer}: ${specifier}`);
  }
  return { filename, query: query ? `?${query}` : "" };
}

/** Stable installation paths retain only useful subfolders inside a single variant directory. */
function destination(filename, id) {
  const path = slash(relative(sourceRoot, filename));
  if (path.startsWith(`sidebar/${id}/`)) return path.slice(`sidebar/${id}/`.length);
  if (path.startsWith("sidebar/shared/"))
    return `components/${path.slice("sidebar/shared/".length)}`;
  if (path.startsWith("sidebar/data/")) return path.slice("sidebar/".length);
  if (path.startsWith("shared/branding/")) return path.slice("shared/".length);
  throw new Error(`No installation destination for ${path}`);
}

function collect(id) {
  const files = new Map();
  function visit(filename) {
    if (files.has(filename)) return;
    if (!/\.(tsx?|svg)$/.test(filename)) throw new Error(`Unsupported source asset: ${filename}`);
    const source = readFileSync(filename, "utf8");
    const refs = /\.[cm]?[jt]sx?$/.test(filename) ? moduleReferences(filename, source) : [];
    const imports = refs
      .filter((ref) => ref.value.startsWith("."))
      .map((ref) => ({
        ...ref,
        ...resolveLocal(filename, ref.value),
      }));
    files.set(filename, { filename, source, imports });
    for (const imported of imports) visit(imported.filename);
  }
  visit(resolve(sourceRoot, `sidebar/${id}/index.ts`));
  return [...files.values()].sort((a, b) =>
    destination(a.filename, id).localeCompare(destination(b.filename, id), "en"),
  );
}

/** The source viewer and archive consume the very same rewritten contents and destination labels. */
export function createSidebarInstallation(id) {
  if (!/^sidebar-\d{2}$/.test(id)) throw new Error(`Invalid sidebar ID: ${id}`);
  const collected = collect(id);
  const labels = new Set();
  const sources = {};
  const entries = collected.map((file) => {
    const label = destination(file.filename, id);
    if (labels.has(label)) throw new Error(`Duplicate installation destination: ${label}`);
    labels.add(label);
    let content = file.source;
    for (const imported of [...file.imports].sort((a, b) => b.start - a.start)) {
      const target = destination(imported.filename, id);
      let specifier = slash(relative(dirname(label), target)).replace(/\.(tsx?|jsx?)$/, "");
      if (!specifier.startsWith(".")) specifier = `./${specifier}`;
      content =
        content.slice(0, imported.start) + specifier + imported.query + content.slice(imported.end);
    }
    sources[label] = content;
    return {
      path: slash(relative(blocksRoot, file.filename)),
      label,
      kind: label === `${id}.tsx` ? "page" : "support",
    };
  });
  const priority = (label) => (label === `${id}.tsx` ? 0 : label === "index.ts" ? 1 : 2);
  entries.sort(
    (a, b) => priority(a.label) - priority(b.label) || a.label.localeCompare(b.label, "en"),
  );
  const license = readFileSync(resolve(blocksRoot, "../../LICENSE.md"), "utf8");
  sources["LICENSE.md"] = license;
  entries.push({ path: "../../LICENSE.md", label: "LICENSE.md", kind: "support" });
  // Fixed timestamps make identical sources produce identical archives across builds.
  const archive = Object.fromEntries(
    entries.map(({ label }) => [
      `${id}/${label}`,
      [strToU8(sources[label]), { mtime: new Date(2000, 0, 1) }],
    ]),
  );
  return { id, files: entries, sources, zip: zipSync(archive, { level: 6 }) };
}

export function createSidebarInstallations() {
  return readdirSync(resolve(sourceRoot, "sidebar"))
    .filter((id) => /^sidebar-\d{2}$/.test(id))
    .sort()
    .map(createSidebarInstallation);
}

/** Only metadata is checked in. Source JSON and ZIP assets are emitted by the docs build. */
export function writeInstallationManifest(installations = createSidebarInstallations()) {
  const manifest = Object.fromEntries(installations.map(({ id, files }) => [id, files]));
  const output = `${JSON.stringify(manifest, null, 2)}\n`;
  if (!existsSync(manifestPath) || readFileSync(manifestPath, "utf8") !== output)
    writeFileSync(manifestPath, output);
  return manifest;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const installations = createSidebarInstallations();
  writeInstallationManifest(installations);
  console.log(`Updated installation manifest for ${installations.length} sidebar variants.`);
}
