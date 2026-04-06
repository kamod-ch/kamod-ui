/**
 * Pure rewrite of `from "@kamod-ui/core"` into shadcn-style `@/components/kamod-ui/<slug>` paths.
 * Package install commands (`pnpm add @kamod-ui/core`) stay unchanged.
 * Pass `docSlugsLongestFirst` from `docsPageSlugsLongestFirst` (registry) or collect from doc page files in tooling.
 */

export function buildDocsPageSlugsLongestFirst(slugs: readonly string[]): string[] {
  return [...new Set(slugs)].sort((a, b) => b.length - a.length);
}

const SYMBOL_SLUG_OVERRIDES: Record<string, string> = {
  DateRange: "calendar",
  Theme: "typography",
};

export function pascalCaseToKebab(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function stripImportAlias(part: string): string {
  return (
    part
      .trim()
      .split(/\s+as\s+/i)[0]
      ?.trim() ?? ""
  );
}

export function symbolToKamodSlug(
  symbol: string,
  docSlugsLongestFirst: readonly string[],
): string | null {
  const base = stripImportAlias(symbol);
  if (!base || base === "…" || base === "...") return null;
  if (SYMBOL_SLUG_OVERRIDES[base]) return SYMBOL_SLUG_OVERRIDES[base];
  const kebab = pascalCaseToKebab(base);
  for (const slug of docSlugsLongestFirst) {
    if (kebab === slug) return slug;
    if (kebab.startsWith(`${slug}-`)) return slug;
  }
  return null;
}

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

function emitKamodImports(
  bySlug: Map<string, { isTypeImport: boolean; names: string[] }>,
): string[] {
  const lines: string[] = [];
  const slugs = [...bySlug.keys()].sort();
  for (const slug of slugs) {
    const g = bySlug.get(slug)!;
    const names = [...new Set(g.names)];
    const kw = g.isTypeImport ? "import type " : "import ";
    lines.push(`${kw}{ ${names.join(", ")} } from "@/components/kamod-ui/${slug}"`);
  }
  return lines;
}

function rewriteImportStatements(
  source: string,
  fallbackSlug: string,
  docSlugsLongestFirst: readonly string[],
): string {
  let out = source;
  const importRe = /import\s+(type\s+)?\{([^}]*)\}\s+from\s+"@kamod-ui\/core"/g;
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
        text: `import { ${body.trim()} } from "@/components/kamod-ui/${fallbackSlug}"`,
      });
      continue;
    }

    const symbols = splitImportSymbols(body);
    const bySlug = new Map<string, { isTypeImport: boolean; names: string[] }>();
    const lucideParts: string[] = [];

    for (const sym of symbols) {
      const slug = symbolToKamodSlug(sym, docSlugsLongestFirst);
      if (slug) {
        const display = sym.trim();
        if (!bySlug.has(slug)) bySlug.set(slug, { isTypeImport, names: [] });
        const g = bySlug.get(slug)!;
        g.names.push(display.includes(" as ") ? display : stripImportAlias(sym));
        g.isTypeImport = g.isTypeImport && isTypeImport;
      } else {
        const trimmed = sym.trim();
        if (trimmed && trimmed !== "…") lucideParts.push(trimmed);
      }
    }

    const lines: string[] = [];
    if (lucideParts.length) {
      lines.push(`import { ${lucideParts.join(", ")} } from "lucide-preact"`);
    }
    lines.push(...emitKamodImports(bySlug));
    replacements.push({ start, end, text: lines.join("\n") });
  }

  for (let i = replacements.length - 1; i >= 0; i--) {
    const r = replacements[i]!;
    out = out.slice(0, r.start) + r.text + out.slice(r.end);
  }

  return out;
}

function rewriteProseRefs(source: string, fallbackSlug: string): string {
  let s = source;
  const path = `@/components/kamod-ui/${fallbackSlug}`;
  s = s.replace(/from `@kamod-ui\/core`/g, `from \`${path}\``);
  s = s.replace(/\bImport ([^.!?\n]+?) from @kamod-ui\/core\b/g, `Import $1 from \`${path}\``);
  s = s.replace(/\bimport `([^`]+)` from @kamod-ui\/core\b/gi, `import \`$1\` from \`${path}\``);
  s = s.replace(/\bfrom @kamod-ui\/core([.!,?])/g, `from \`${path}\`$1`);
  s = s.replace(/@kamod-ui\/core/g, (match, offset, str) => {
    if (str[offset - 1] === "`" || str[offset - 1] === "'") return match;
    const before = str.slice(Math.max(0, offset - 48), offset);
    if (/(pnpm|npm|yarn)\s+add\s+$/i.test(before)) return match;
    return path;
  });
  return s;
}

/**
 * Rewrite `from "@kamod-ui/core"` inside a doc code / prose string.
 * `fallbackSlug` resolves ellipsis imports and bare `@kamod-ui/core` prose mentions.
 */
export function rewriteKamodCoreImportsInDocString(
  source: string,
  fallbackSlug: string,
  docSlugsLongestFirst: readonly string[],
): string {
  if (source.trim() === "pnpm add @kamod-ui/core") return source;
  let out = rewriteImportStatements(source, fallbackSlug, docSlugsLongestFirst);
  out = rewriteProseRefs(out, fallbackSlug);
  return out;
}

export function docImportFrom(slug: string): string {
  return `@/components/kamod-ui/${slug}`;
}
