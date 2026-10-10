import type { CodeLanguage } from "./code-language";

const trivia = String.raw`(?:\s|//[^\r\n]*|/\*[\s\S]*?\*/)*`;
const identifier = String.raw`[$\p{ID_Start}][$\p{ID_Continue}]*(?![$\p{ID_Continue}])`;
const quoted = String.raw`(?:"(?:\\[^\r\n]|[^"\\\r\n])*"|'(?:\\[^\r\n]|[^'\\\r\n])*')`;
const named = String.raw`\{(?:${trivia}(?:${identifier}|${quoted}|,))*${trivia}\}`;
const namespace = String.raw`\*${trivia}as\b${trivia}${identifier}`;
const bindings = String.raw`(?:${identifier}(?:${trivia},${trivia}(?:${named}|${namespace}))?|${named}|${namespace})`;
const attributes = String.raw`(?:${trivia}(?:with|assert)\b${trivia}\{(?:${trivia}(?:${identifier}|${quoted}|[:,]))*${trivia}\})?`;
// Only complete static declarations qualify. Dynamic imports and executable code stay visible.
const declaration = new RegExp(
  String.raw`^import\b${trivia}(?:${quoted}|(?:type\b${trivia})?${bindings}${trivia}from\b${trivia}${quoted})${attributes}[\t ]*(?:;|(?=\r?\n|$))`,
  "u",
);
const leadingTrivia = new RegExp(`^${trivia}`, "u");
const directive = new RegExp(String.raw`^${quoted}[\t ]*(?:;|(?=\r?\n|$))`, "u");

/** Only normalize a join created by folding, never blank lines inside retained code. */
function joinRetainedSource(before: string, after: string) {
  const leading = after.match(/^(?:[\t ]*\r?\n)+/)?.[0];
  if (!leading) return before + after;
  // Scan only the suffix: an unanchored repeated-newline regex retries every
  // earlier blank line when a preserved comment separates it from the suffix.
  let cursor = before.length;
  let trailingStart = cursor;
  while (cursor > 0) {
    const character = before[--cursor];
    if (character === " " || character === "\t") continue;
    if (character !== "\n") break;
    if (before[cursor - 1] === "\r") cursor -= 1;
    trailingStart = cursor;
  }
  if (trailingStart === before.length) return before + after;
  const trailing = before.slice(trailingStart);
  const newline = trailing.includes("\r\n") ? "\r\n" : "\n";
  return before.slice(0, trailingStart) + newline.repeat(2) + after.slice(leading.length);
}

/**
 * Find the leading JS/TS import declarations without shipping a language parser.
 * Keep comments/directives, stop at executable code, and leave unsupported syntax alone.
 * Offsets refer to the original source; folding never changes the copied document.
 */
export function findCodeImports(code: string, language: CodeLanguage) {
  if (!["tsx", "jsx", "typescript", "javascript"].includes(language)) return null;
  const ranges: { start: number; end: number }[] = [];
  let cursor = code.startsWith("#!") ? code.indexOf("\n") + 1 : 0;
  let lineStart = 0;
  let scannedTo = 0;
  while (cursor < code.length) {
    cursor += code.slice(cursor).match(leadingTrivia)![0].length;
    const remaining = code.slice(cursor);
    const match = remaining.match(declaration);
    if (match) {
      const end = cursor + match[0].length;
      // Inspect each intervening segment once, even for many imports on one line.
      const newline = code.slice(scannedTo, cursor).lastIndexOf("\n");
      if (newline !== -1) lineStart = scannedTo + newline + 1;
      scannedTo = cursor;
      const lineEnding = code.slice(end).match(/^[\t ]*(?:\r?\n|$)/);
      // Remove indentation and the newline only when this declaration owns the line.
      // Same-line comments and executable code must stay exactly where they are.
      const wholeLine = /^[\t ]*$/.test(code.slice(lineStart, cursor)) && lineEnding;
      ranges.push({
        start: wholeLine ? lineStart : cursor,
        end: wholeLine ? end + lineEnding[0].length : end,
      });
      cursor = end;
    } else {
      const prologue = ranges.length === 0 && remaining.match(directive);
      if (!prologue) break;
      cursor += prologue[0].length;
    }
  }
  if (!ranges.length) return null;
  let previous = 0;
  let folded = "";
  for (const { start, end } of ranges) {
    folded = joinRetainedSource(folded, code.slice(previous, start));
    previous = end;
  }
  folded = joinRetainedSource(folded, code.slice(previous));
  return { count: ranges.length, folded: folded.replace(/^(?:[\t ]*\r?\n)+/, "") };
}
