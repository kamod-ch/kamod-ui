/** Render prompt Markdown as inert documentation, keeping source/HTML examples literal. */

import { Marked, Renderer } from "marked";
import { brandMarkdownRenderer } from "../docs/components/brand/brand-markdown";
import { codeFenceMarkup } from "../docs/components/code-fence-markup";
import { resolveCodeLanguage } from "../docs/components/code-language";
import { highlightCode } from "../docs/components/highlight-code";
import { isDisplayPath } from "../docs/components/PathDisplay";
import { renderPathMarkup } from "../docs/components/path-markup";

const escape = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
const markdown = new Marked({
  gfm: true,
  renderer: brandMarkdownRenderer({
    code({ text, lang }) {
      const [name, filePath] = (lang ?? "").trim().split(/\s+/);
      const language = resolveCodeLanguage(text, name, filePath);
      const source = text.endsWith("\n") ? text : `${text}\n`;
      const html = language === "text" ? escape(source) : highlightCode(source, language);
      return codeFenceMarkup(source, language, filePath, html);
    },
    codespan(token) {
      return isDisplayPath(token.text)
        ? renderPathMarkup(token.text)
        : Renderer.prototype.codespan.call(this, token);
    },
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
      return `<h${level} data-prompt-depth="${depth}">${this.parser.parseInline(tokens)}</h${level}>`;
    },
  }),
});

export function renderPromptMarkdown(prompt: string) {
  return markdown.parse(prompt, { async: false });
}
