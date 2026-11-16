import { symbolToKamodSlug } from "./doc-snippet-rewrite.ts";

export type ConsumerImportStyle = "barrel" | "subpath";

const NAMED_IMPORT = /import\s+(type\s+)?\{([\s\S]*?)\}\s+from\s+(["'])([^"']+)\3;?/g;

type ImportMatch = {
  start: number;
  end: number;
  typeOnly: boolean;
  names: string[];
  specifier: string;
  quote: string;
  semi: boolean;
};

function consumerImportMatches(source: string): ImportMatch[] {
  const matches: ImportMatch[] = [];
  for (const match of source.matchAll(NAMED_IMPORT)) {
    const specifier = match[4]!;
    if (!isConsumerSpecifier(specifier)) continue;
    const lineStart = source.lastIndexOf("\n", match.index - 1) + 1;
    if (source.slice(lineStart, match.index).includes("//")) continue;
    const full = match[0];
    matches.push({
      start: match.index,
      end: match.index + full.length,
      typeOnly: Boolean(match[1]),
      names: splitNames(match[2]!),
      specifier,
      quote: match[3]!,
      semi: full.trimEnd().endsWith(";"),
    });
  }
  return matches;
}

export function hasConsumerImport(source: string): boolean {
  return consumerImportMatches(source).length > 0;
}

function isConsumerSpecifier(specifier: string): boolean {
  return (
    specifier === "@kamod-ch/ui" ||
    specifier.startsWith("@kamod-ch/ui/") ||
    specifier.startsWith("@/components/kamod-ui/")
  );
}

/** Keep an already-specific package subpath until the reader chooses the barrel. */
export function initialConsumerImportStyle(source: string): ConsumerImportStyle {
  const consumer = consumerImportMatches(source).map((match) => match.specifier);
  const hasLocal = consumer.some((specifier) => specifier.startsWith("@/components/kamod-ui/"));
  const hasBarrel = consumer.some((specifier) => specifier === "@kamod-ch/ui");
  const hasSubpath = consumer.some((specifier) => specifier.startsWith("@kamod-ch/ui/"));
  if (hasSubpath && !hasLocal && !hasBarrel) return "subpath";
  return "barrel";
}

function splitNames(body: string): string[] {
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
  return parts.map((part) => part.trim()).filter(Boolean);
}

function symbolForSlug(symbol: string): string {
  return symbol
    .trim()
    .replace(/^type\s+/, "")
    .split(/\s+as\s+/i)[0]!
    .trim();
}

function targetSpecifier(
  specifier: string,
  symbol: string,
  style: ConsumerImportStyle,
  slugs: readonly string[],
): string {
  if (style === "barrel") return "@kamod-ch/ui";
  if (specifier.startsWith("@/components/kamod-ui/")) {
    return `@kamod-ch/ui/${specifier.slice("@/components/kamod-ui/".length)}`;
  }
  if (specifier.startsWith("@kamod-ch/ui/")) return specifier;
  const slug = symbolToKamodSlug(symbolForSlug(symbol), slugs);
  return slug ? `@kamod-ch/ui/${slug}` : "@kamod-ch/ui";
}

/**
 * Rewrite Kamod imports in a copyable snippet to the barrel package or its subpath exports.
 * Install commands, comments, and imports from other packages stay unchanged.
 */
export function presentConsumerImports(
  source: string,
  style: ConsumerImportStyle,
  slugs: readonly string[],
): string {
  const matches = consumerImportMatches(source);
  if (matches.length === 0) return source;

  const quote = matches[0]!.quote;
  const semi = matches.some((match) => match.semi);
  const groups = new Map<string, { typeOnly: boolean; specifier: string; names: string[] }>();
  const order: string[] = [];
  for (const match of matches) {
    for (const name of match.names) {
      const specifier = targetSpecifier(match.specifier, name, style, slugs);
      const key = `${match.typeOnly ? "type" : "value"}:${specifier}`;
      let group = groups.get(key);
      if (!group) {
        group = { typeOnly: match.typeOnly, specifier, names: [] };
        groups.set(key, group);
        order.push(key);
      }
      if (!group.names.includes(name)) group.names.push(name);
    }
  }

  const indent = source.slice(
    source.lastIndexOf("\n", matches[0]!.start - 1) + 1,
    matches[0]!.start,
  );
  const ending = semi ? ";" : "";
  const emitted = order
    .map((key) => {
      const group = groups.get(key)!;
      const keyword = group.typeOnly ? "import type " : "import ";
      return `${indent}${keyword}{ ${group.names.join(", ")} } from ${quote}${group.specifier}${quote}${ending}`;
    })
    .join("\n");

  let next = source;
  for (let i = matches.length - 1; i >= 1; i--) {
    const match = matches[i]!;
    const lineStart = next.lastIndexOf("\n", match.start - 1) + 1;
    const start = next.slice(lineStart, match.start).trim() === "" ? lineStart : match.start;
    let end = match.end;
    if (next[end] === "\r") end++;
    if (next[end] === "\n") end++;
    next = next.slice(0, start) + next.slice(end);
  }
  const first = matches[0]!;
  return next.slice(0, first.start) + emitted + next.slice(first.end);
}
