/** Render prompt Markdown as inert documentation, keeping source/HTML examples literal. */
import { Marked } from "marked";

const escape = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
const markdown = new Marked({
  gfm: true,
  renderer: {
    html: ({ text }) => escape(text),
    image: ({ text }) => escape(text),
    link({ href, tokens }) {
      const text = this.parser.parseInline(tokens);
      // Only web references belong in these briefs; do not activate executable URL schemes.
      try {
        const url = new URL(href);
        if (url.protocol === "https:" || url.protocol === "http:")
          return `<a href="${escape(url.href)}">${text}</a>`;
      } catch {
        /* Invalid or relative references stay readable text. */
      }
      return text;
    },
    heading({ tokens, depth }) {
      const level = Math.min(6, depth + 4);
      return `<h${level}>${this.parser.parseInline(tokens)}</h${level}>`;
    },
  },
});

export function renderPromptMarkdown(prompt: string) {
  return markdown.parse(prompt, { async: false });
}
