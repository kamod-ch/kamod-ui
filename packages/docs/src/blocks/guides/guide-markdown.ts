import { Marked, Renderer, type Token } from "marked";
import { withBasePath } from "../../base-path";
import { isDisplayPath } from "../../docs/components/PathDisplay";
import { renderPathMarkup } from "../../docs/components/path-markup";

export type GuidePart =
  | { kind: "html"; html: string }
  | { kind: "heading"; id: string; title: string }
  | { kind: "code"; code: string; language: "tsx" | "bash" | "css" | "text"; filePath?: string };
export type GuideSection = {
  id: string;
  title: string;
  parts: GuidePart[];
  children?: { id: string; label: string }[];
};

const escape = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
const markdown = new Marked({
  renderer: {
    codespan(token) {
      return isDisplayPath(token.text)
        ? renderPathMarkup(token.text)
        : Renderer.prototype.codespan.call(this, token);
    },
    html: ({ text }) => escape(text),
    link({ href, tokens }) {
      const label = this.parser.parseInline(tokens);
      if (!/^(\/[^/]|#|https:\/\/)/.test(href)) return label;
      const target = href.startsWith("/") ? withBasePath(href) : href;
      return `<a href="${escape(target)}">${label}</a>`;
    },
    table(token) {
      return `<div class="block-guide-table" tabindex="0" role="region" aria-label="Reference table">${Renderer.prototype.table.call(this, token)}</div>`;
    },
  },
});

/** Parse checked-in Markdown only. Keep code as Preact components for accessible Copy controls. */
export function parseGuide(source: string): GuideSection[] {
  const sections: GuideSection[] = [];
  const ids = new Set<string>();
  let pending: Token[] = [];
  let current: GuideSection | undefined;
  const flush = () => {
    if (pending.length && current)
      current.parts.push({ kind: "html", html: markdown.parser(pending) });
    pending = [];
  };
  for (const token of markdown.lexer(source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, ""))) {
    if (token.type === "heading" && (token.depth === 2 || token.depth === 3)) {
      flush();
      const id = token.text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      if (ids.has(id)) throw new Error(`Duplicate block guide heading: ${id}`);
      ids.add(id);
      if (token.depth === 2) {
        current = { id, title: token.text, parts: [] };
        sections.push(current);
      } else if (current) {
        (current.children ??= []).push({ id, label: token.text });
        current.parts.push({ kind: "heading", id, title: token.text });
      }
    } else if (token.type === "code" && current) {
      flush();
      const [language, filePath] = (token.lang ?? "text").split(/\s+/);
      current.parts.push({
        kind: "code",
        code: token.text,
        language:
          language === "tsx" || language === "bash" || language === "css" ? language : "text",
        filePath,
      });
    } else {
      pending.push(token);
    }
  }
  flush();
  return sections;
}
