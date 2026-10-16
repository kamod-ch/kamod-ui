import type { CodeLanguage } from "./code-language";
import type { CodeSourcePart } from "./code-markup";

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

/** Find a complete CSS import without treating semicolons in strings/functions as terminators. */
function cssImportLength(text: string) {
  if (!/^@import\s+(?:["']|url\()/i.test(text)) return 0;
  let depth = 0;
  let quote = "";
  for (let index = 7; index < text.length; index++) {
    const char = text[index];
    if (char === "\\") {
      index++;
      continue;
    }
    if (quote) {
      if (char === quote) quote = "";
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === "/" && text[index + 1] === "*") {
      const end = text.indexOf("*/", index + 2);
      if (end === -1) return 0;
      index = end + 1;
    } else if (char === "(") depth++;
    else if (char === ")") {
      if (--depth < 0) return 0;
    } else if (char === "{" || char === "}") return 0;
    else if (char === ";" && depth === 0) return index + 1;
  }
  return 0;
}

/** Only normalize a join created by folding, never blank lines inside retained code. */
function retainedJoin(before: string, after: string) {
  const leading = after.match(/^(?:[\t ]*\r?\n)+/)?.[0];
  if (!leading) return null;
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
  if (trailingStart === before.length) return null;
  const trailing = before.slice(trailingStart);
  const newline = trailing.includes("\r\n") ? "\r\n" : "\n";
  return { beforeEnd: trailingStart, afterStart: leading.length, separator: newline.repeat(2) };
}

/** Trim normalized whitespace from the offset map as well as the displayed source. */
function trimParts(parts: CodeSourcePart[], length: number, fromStart = false) {
  while (length > 0 && parts.length) {
    const index = fromStart ? 0 : parts.length - 1;
    const part = parts[index];
    const size = typeof part === "string" ? part.length : part.end - part.start;
    const removed = Math.min(length, size);
    if (removed === size) parts.splice(index, 1);
    else if (typeof part === "string")
      parts[index] = fromStart ? part.slice(removed) : part.slice(0, -removed);
    else if (fromStart) part.start += removed;
    else part.end -= removed;
    length -= removed;
  }
}

/**
 * Find leading JS/TS declarations or CSS import rules without shipping a language parser.
 * Keep comments/directives, stop at executable code, and leave unsupported syntax alone.
 * Offsets refer to the original source; folding never changes the copied document.
 */
export function findCodeImports(code: string, language: CodeLanguage) {
  const css = language === "css";
  if (!css && !["tsx", "jsx", "typescript", "javascript"].includes(language)) return null;
  const ranges: { start: number; end: number }[] = [];
  let cursor = code.startsWith("#!") ? code.indexOf("\n") + 1 : 0;
  let lineStart = 0;
  let scannedTo = 0;
  while (cursor < code.length) {
    cursor += code.slice(cursor).match(leadingTrivia)![0].length;
    const remaining = code.slice(cursor);
    const length = css ? cssImportLength(remaining) : remaining.match(declaration)?.[0].length;
    if (length) {
      const end = cursor + length;
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
      const prologue = css
        ? remaining.match(/^@(?:charset\s+["'][^"']+["']|layer\s+[\w.-]+(?:\s*,\s*[\w.-]+)*)\s*;/i)
        : ranges.length === 0 && remaining.match(directive);
      if (!prologue) break;
      cursor += prologue[0].length;
    }
  }
  if (!ranges.length) return null;
  let previous = 0;
  let folded = "";
  const parts: CodeSourcePart[] = [];
  const retain = (start: number, end: number) => {
    if (start === end) return;
    const after = code.slice(start, end);
    const join = retainedJoin(folded, after);
    if (join) {
      trimParts(parts, folded.length - join.beforeEnd);
      parts.push(join.separator);
      start += join.afterStart;
      folded = folded.slice(0, join.beforeEnd) + join.separator + after.slice(join.afterStart);
    } else folded += after;
    if (start < end) parts.push({ start, end });
  };
  for (const { start, end } of ranges) {
    retain(previous, start);
    previous = end;
  }
  retain(previous, code.length);
  const leading = folded.match(/^(?:[\t ]*\r?\n)+/)?.[0].length ?? 0;
  trimParts(parts, leading, true);
  return { count: ranges.length, folded: folded.slice(leading), parts };
}
