/** Retained source offsets, with literal whitespace for joins created by import folding. */
export type CodeSourcePart = { start: number; end: number } | string;

export const escapeCodeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

/**
 * Select retained source from trusted highlighter markup in one pass.
 * Reopen spanning tokens at retained boundaries; never parse the language again.
 */
export function selectCodeMarkup(html: string, parts: readonly CodeSourcePart[]) {
  const stack: string[] = [];
  const output: string[] = [];
  let partIndex = 0;
  let sourceOffset = 0;
  let writing = false;
  const setWriting = (next: boolean) => {
    if (writing === next) return;
    output.push(next ? stack.join("") : "</span>".repeat(stack.length));
    writing = next;
  };
  const nextRange = () => {
    while (typeof parts[partIndex] === "string") {
      output.push(escapeCodeHtml(parts[partIndex] as string));
      partIndex += 1;
    }
    return parts[partIndex] as Exclude<CodeSourcePart, string> | undefined;
  };
  let range = nextRange();
  for (const match of html.matchAll(
    /<span\b[^>]*>|<\/span>|&(?:#\d+|#x[\da-f]+|\w+);|[^<&]+|[<&]/gi,
  )) {
    const fragment = match[0];
    if (fragment.startsWith("<span")) {
      if (writing) output.push(fragment);
      stack.push(fragment);
    } else if (fragment === "</span>") {
      if (writing) output.push(fragment);
      stack.pop();
    } else {
      const entity = /^&(?:#\d+|#x[\da-f]+|\w+);$/i.test(fragment);
      const length = entity ? 1 : fragment.length;
      const start = sourceOffset;
      const end = sourceOffset + length;
      while (sourceOffset < end && range) {
        if (sourceOffset < range.start) {
          setWriting(false);
          sourceOffset = Math.min(end, range.start);
        } else {
          setWriting(true);
          const retainedEnd = Math.min(end, range.end);
          output.push(
            entity ? fragment : fragment.slice(sourceOffset - start, retainedEnd - start),
          );
          sourceOffset = retainedEnd;
          if (sourceOffset === range.end) {
            setWriting(false);
            partIndex += 1;
            range = nextRange();
          }
        }
      }
      sourceOffset = end;
    }
  }
  setWriting(false);
  return output.join("");
}
