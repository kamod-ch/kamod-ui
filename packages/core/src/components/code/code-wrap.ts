/** Split trusted highlighter markup without breaking tokens that span source lines. */
export function readableCodeLines(html: string, source: string) {
  const stack: { open: string; close: string }[] = [];
  const lines: string[] = [];
  const endings = source.match(/\r\n|\r|\n/g) ?? [];
  let line = "";
  for (const part of html.split(/(<(?:span|a)\b[^>]*>|<\/(?:span|a)>|\r\n|\r|\n)/g)) {
    if (/^[\r\n]+$/.test(part)) {
      lines.push(
        line +
          stack
            .map(({ close }) => close)
            .reverse()
            .join(""),
      );
      line = stack.map(({ open }) => open).join("");
    } else {
      line += part;
      if (/^<(span|a)\b/.test(part))
        stack.push({ open: part, close: part.startsWith("<a ") ? "</a>" : "</span>" });
      else if (/^<\/(?:span|a)>$/.test(part)) stack.pop();
    }
  }
  lines.push(line);
  return source
    .split(/\r\n|\r|\n/)
    .map((text, index) => {
      const indent = text.match(/^[\t ]*/)![0];
      const columns = [...indent].reduce(
        (width, char) => width + (char === "\t" ? 2 - (width % 2) : 1),
        0,
      );
      let remaining = indent.length;
      const content = lines[index].replace(/(<[^>]+>)|([^<]+)/g, (part, tag, value: string) => {
        if (tag || !remaining) return part;
        const length = Math.min(remaining, value.match(/^[\t ]*/)![0].length);
        remaining -= length;
        return value.slice(length);
      });
      // Retain literal whitespace in the DOM for selection; CSS only changes its visual width.
      return `<span class="docs-code-line" style="--code-indent-ch:${columns}ch"><span class="docs-code-indent">${indent}</span>${content}</span>${(endings[index] ?? "").replaceAll("\r", "&#13;")}`;
    })
    .join("");
}
