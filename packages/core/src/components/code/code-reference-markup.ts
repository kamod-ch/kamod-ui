import { escapeCodeHtml } from "./code-markup";
import type { CodeReference } from "./code-references";

/** Add text-free anchors inside trusted syntax tokens, preserving their colors and exact source. */
export function linkCodeMarkup(html: string, references: readonly CodeReference[]) {
  if (!references.length) return html;
  const output: string[] = [];
  let offset = 0;
  let index = 0;
  let depth = 0;
  let linkDepth = -1;
  const close = () => {
    if (linkDepth < 0) return;
    output.push("</a>");
    linkDepth = -1;
  };
  const advance = () => {
    if (references[index] && offset === references[index].end) {
      close();
      index++;
    }
  };
  for (const match of html.matchAll(
    /<span\b[^>]*>|<\/span>|&(?:#\d+|#x[\da-f]+|\w+);|[^<&]+|[<&]/gi,
  )) {
    const fragment = match[0];
    advance();
    if (fragment.startsWith("<span")) {
      output.push(fragment);
      depth++;
    } else if (fragment === "</span>") {
      if (linkDepth === depth) close();
      output.push(fragment);
      depth--;
    } else {
      const entity = /^&(?:#\d+|#x[\da-f]+|\w+);$/i.test(fragment);
      let cursor = 0;
      const length = entity ? 1 : fragment.length;
      while (cursor < length) {
        advance();
        const reference = references[index];
        if (reference && offset >= reference.start && offset < reference.end && linkDepth < 0) {
          // Reference navigation leaves embedded previews and preserves intercepted route fragments.
          const context = [
            ["module", reference.module],
            ["imported", reference.imported],
            ["local", reference.local],
            ["file", reference.filePath],
          ]
            .map(([key, value]) => (value ? ` data-code-${key}="${escapeCodeHtml(value)}"` : ""))
            .join("");
          output.push(
            `<a class="kamod-code-reference" href="${escapeCodeHtml(reference.href)}" target="_top"${context}>`,
          );
          linkDepth = depth;
        }
        const end = Math.min(
          length - cursor,
          reference
            ? (offset >= reference.start ? reference.end : reference.start) - offset
            : length,
        );
        if (end <= 0) {
          index++;
          continue;
        }
        output.push(entity ? fragment : fragment.slice(cursor, cursor + end));
        cursor += end;
        offset += end;
      }
    }
  }
  close();
  return output.join("");
}
