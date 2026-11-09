/**
 * Rewrites docs-authored examples into copyable consumer code (@kamod-ch/ui subpaths).
 * Local preview aliases and barrel imports are authoring conveniences only.
 */

import { docPackageImportPath, resolveSnippetImports } from "./doc-snippet-mode";
import {
  buildDocsPageSlugsLongestFirst,
  rewriteKamodCoreImportsInDocString,
  symbolToKamodSlug,
} from "./doc-snippet-rewrite";
import { kamodUiExportSubpaths } from "./doc-ui-export-slugs";
import type { DocPageModule } from "./types";

const exportSubpaths = new Set<string>(kamodUiExportSubpaths);

const LOCAL_UI_IMPORT =
  /import\s+(type\s+)?\{([^}]*)\}\s+from\s+["']@\/components\/kamod-ui\/([^"']+)["']/g;
const LOCAL_UI_PROSE = /@\/components\/kamod-ui\/([a-z0-9-]+(?:\/[a-z0-9.-]+)*)/g;

function splitImportSymbols(body: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (ch === "<") depth++;
    else if (ch === ">") depth = Math.max(0, depth - 1);
    else if (ch === "," && depth === 0) {
      parts.push(body.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(body.slice(start));
  return parts.map((p) => p.trim()).filter(Boolean);
}

function stripImportAlias(part: string): string {
  return (
    part
      .trim()
      .split(/\s+as\s+/i)[0]
      ?.trim() ?? ""
  );
}

function packagePathForUiSubpath(subpath: string): string | null {
  if (exportSubpaths.has(subpath)) return docPackageImportPath(subpath);
  const root = subpath.split("/")[0] ?? "";
  if (exportSubpaths.has(root)) return docPackageImportPath(root);
  return null;
}

function emitPackageUiImports(
  bySubpath: Map<string, { isTypeImport: boolean; names: string[] }>,
): string[] {
  const lines: string[] = [];
  const keys = [...bySubpath.keys()].sort();
  for (const subpath of keys) {
    const g = bySubpath.get(subpath)!;
    const names = [...new Set(g.names)];
    const kw = g.isTypeImport ? "import type " : "import ";
    const target = packagePathForUiSubpath(subpath);
    if (!target) {
      lines.push(
        `${kw}{ ${names.join(", ")} } from "${docPackageImportPath(subpath)}" // verify export in your installed version`,
      );
      continue;
    }
    lines.push(`${kw}{ ${names.join(", ")} } from "${target}"`);
  }
  return lines;
}

function rewriteBarrelImports(
  source: string,
  fallbackSlug: string,
  docSlugsLongestFirst: readonly string[],
): string {
  let out = source;
  const importRe = /import\s+(type\s+)?\{([^}]*)\}\s+from\s+["']@kamod-ch\/ui["']/g;
  const replacements: Array<{ start: number; end: number; text: string }> = [];
  let m: RegExpExecArray | null;

  while ((m = importRe.exec(source)) !== null) {
    const full = m[0];
    const isTypeImport = Boolean(m[1]);
    const body = m[2];
    const start = m.index;
    const end = start + full.length;

    if (/[……]/.test(body) || /\.\.\./.test(body)) {
      replacements.push({
        start,
        end,
        text: `import { ${body.trim()} } from "${docPackageImportPath(fallbackSlug)}"`,
      });
      continue;
    }

    const symbols = splitImportSymbols(body);
    const bySubpath = new Map<string, { isTypeImport: boolean; names: string[] }>();
    const unresolved: string[] = [];

    for (const sym of symbols) {
      const slug = symbolToKamodSlug(sym, docSlugsLongestFirst);
      const display = sym.trim();
      if (slug) {
        if (!bySubpath.has(slug)) bySubpath.set(slug, { isTypeImport, names: [] });
        const g = bySubpath.get(slug)!;
        g.names.push(display.includes(" as ") ? display : stripImportAlias(sym));
        g.isTypeImport = g.isTypeImport && isTypeImport;
      } else if (display && display !== "…" && display !== "...") {
        unresolved.push(display);
      }
    }

    const lines: string[] = emitPackageUiImports(bySubpath);
    if (unresolved.length) {
      lines.push(
        `import { ${unresolved.join(", ")} } from "@kamod-ch/ui" // barrel: no dedicated subpath mapping in docs`,
      );
    }
    replacements.push({ start, end, text: lines.join("\n") });
  }

  for (let i = replacements.length - 1; i >= 0; i--) {
    const r = replacements[i]!;
    out = out.slice(0, r.start) + r.text + out.slice(r.end);
  }
  return out;
}

function rewriteLocalAliasImports(source: string): string {
  let out = source;
  const replacements: Array<{ start: number; end: number; text: string }> = [];
  let m: RegExpExecArray | null;
  LOCAL_UI_IMPORT.lastIndex = 0;

  while ((m = LOCAL_UI_IMPORT.exec(source)) !== null) {
    const full = m[0];
    const isTypeImport = Boolean(m[1]);
    const body = m[2];
    const subpath = m[3]!.trim();
    const start = m.index;
    const end = start + full.length;
    const target = packagePathForUiSubpath(subpath);
    const kw = isTypeImport ? "import type " : "import ";
    const module = target ?? `${docPackageImportPath(subpath)}`;
    const suffix = target ? "" : " // verify export in your installed version";
    replacements.push({
      start,
      end,
      text: `${kw}{ ${body.trim()} } from "${module}"${suffix}`,
    });
  }

  for (let i = replacements.length - 1; i >= 0; i--) {
    const r = replacements[i]!;
    out = out.slice(0, r.start) + r.text + out.slice(r.end);
  }
  return out;
}

function rewriteLocalAliasProse(source: string): string {
  return source.replace(LOCAL_UI_PROSE, (match, subpath: string) => {
    const target = packagePathForUiSubpath(subpath);
    return target ?? match;
  });
}

/** Produce snippet text intended for copy, clipboard, and download in the docs UI. */
export function docConsumerSnippet(
  source: string,
  doc: Pick<DocPageModule, "slug" | "snippetImports">,
  docSlugsLongestFirst: readonly string[],
): string {
  if (source.trim() === "pnpm add @kamod-ch/ui") return source;
  let out = rewriteLocalAliasImports(source);
  out = rewriteBarrelImports(out, doc.slug, docSlugsLongestFirst);
  out = rewriteLocalAliasProse(out);
  return out;
}

/** Docs-local alias snippet for optional “copy source” (previews inside this repository). */
export function docLocalAuthoringSnippet(
  source: string,
  doc: Pick<DocPageModule, "slug" | "snippetImports">,
  docSlugsLongestFirst: readonly string[],
): string {
  if (resolveSnippetImports(doc as DocPageModule) === "local") {
    return rewriteKamodCoreImportsInDocString(source, doc.slug, docSlugsLongestFirst);
  }
  if (LOCAL_UI_IMPORT.test(source) || source.includes("@/components/kamod-ui/")) {
    LOCAL_UI_IMPORT.lastIndex = 0;
    return source;
  }
  return rewriteKamodCoreImportsInDocString(source, doc.slug, docSlugsLongestFirst);
}

export function docSnippetForDisplay(
  source: string,
  doc: DocPageModule,
  docSlugsLongestFirst: readonly string[] = buildDocsPageSlugsLongestFirst([doc.slug]),
): { consumer: string; local: string; mode: "local" | "package" } {
  const mode = resolveSnippetImports(doc);
  const consumer = docConsumerSnippet(source, doc, docSlugsLongestFirst);
  const local = docLocalAuthoringSnippet(source, doc, docSlugsLongestFirst);
  return { consumer: mode === "package" ? consumer : local, local, mode };
}

export function listUnmappedLocalUiImports(source: string): string[] {
  const missing = new Set<string>();
  let m: RegExpExecArray | null;
  LOCAL_UI_IMPORT.lastIndex = 0;
  while ((m = LOCAL_UI_IMPORT.exec(source)) !== null) {
    const subpath = m[3]!.trim();
    if (!packagePathForUiSubpath(subpath)) missing.add(subpath);
  }
  LOCAL_UI_PROSE.lastIndex = 0;
  while ((m = LOCAL_UI_PROSE.exec(source)) !== null) {
    const subpath = m[1]!;
    if (!packagePathForUiSubpath(subpath)) missing.add(subpath);
  }
  return [...missing].sort();
}
