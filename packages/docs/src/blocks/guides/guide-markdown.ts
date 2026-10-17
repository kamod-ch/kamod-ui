import { Marked, Renderer, type Token, type Tokens } from "marked";
import { withBasePath } from "../../base-path";
import { brandMarkdownRenderer } from "../../docs/components/brand/brand-markdown";
import { codeFenceMarkup } from "../../docs/components/code-fence-markup";
import { type CodeLanguage, resolveCodeLanguage } from "../../docs/components/code-language";
import { isDisplayPath } from "../../docs/components/PathDisplay";
import { renderPathMarkup } from "../../docs/components/path-markup";
import type { DocContentsSection } from "../../docs/types";

export type GuidePart =
  | { kind: "dependencies"; dependencies: string[] }
  | { kind: "html"; html: string }
  | { kind: "heading"; id: string; title: string; level?: 3 | 4 | 5 | 6 }
  | { kind: "code"; code: string; language: CodeLanguage; filePath?: string };
export type GuideSection = {
  id: string;
  title: string;
  parts: GuidePart[];
  children?: DocContentsSection[];
};

const escape = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
export type GuideTableRenderer = (
  table: Tokens.Table,
  inline: (tokens: Token[]) => string,
) => string | undefined;

const createMarkdown = (renderTable?: GuideTableRenderer) =>
  new Marked({
    renderer: brandMarkdownRenderer({
      code({ text, lang }) {
        // Fences inside lists/quotes remain in their prose; HighlightedProse colors them on demand.
        const [name, filePath] = (lang ?? "").trim().split(/\s+/);
        const language = resolveCodeLanguage(text, name, filePath);
        const source = text.endsWith("\n") ? text : `${text}\n`;
        return codeFenceMarkup(source, language, filePath);
      },
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
        const custom = renderTable?.(token, (tokens) => this.parser.parseInline(tokens));
        if (custom !== undefined) return custom;
        return `<div class="block-guide-table" tabindex="0" role="region" aria-label="Reference table">${Renderer.prototype.table.call(this, token)}</div>`;
      },
    }),
  });

/** Parse checked-in Markdown only. Keep code as Preact components for accessible Copy controls. */
export function parseGuide(source: string, renderTable?: GuideTableRenderer): GuideSection[] {
  const markdown = createMarkdown(renderTable);
  const sections: GuideSection[] = [];
  const ids = new Set<string>();
  const parents: {
    depth: number;
    entry: { id: string; label: string; children?: DocContentsSection[] };
  }[] = [];
  let pending: Token[] = [];
  let current: GuideSection | undefined;
  const flush = () => {
    if (pending.length && current)
      current.parts.push({ kind: "html", html: markdown.parser(pending) });
    pending = [];
  };
  for (const token of markdown.lexer(source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, ""))) {
    if (token.type === "heading" && token.depth >= 2 && token.depth <= 6) {
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
        parents.length = 0;
      } else if (current) {
        while (parents.length && parents.at(-1)!.depth >= token.depth) parents.pop();
        const parent = parents.at(-1)?.entry;
        const siblings = parent ? (parent.children ??= []) : (current.children ??= []);
        const entry = { id, label: token.text };
        siblings.push(entry);
        parents.push({ depth: token.depth, entry });
        current.parts.push({
          kind: "heading",
          id,
          title: token.text,
          ...(token.depth > 3 ? { level: token.depth as 4 | 5 | 6 } : {}),
        });
      }
    } else if (token.type === "code" && current) {
      flush();
      const [language, filePath] = (token.lang ?? "").trim().split(/\s+/);
      // Explicit opt-in keeps ordinary shell examples unchanged and installs copyable in Markdown.
      if (language === "bash" && filePath === "package-manager") {
        const packages = token.text.match(
          /^pnpm add ((?:@[\w.-]+\/)?[\w.-]+(?: (?:@[\w.-]+\/)?[\w.-]+)*)$/,
        )?.[1];
        if (!packages) throw new Error("Package-manager fences require a plain pnpm add command");
        current.parts.push({ kind: "dependencies", dependencies: packages.split(" ") });
        continue;
      }
      current.parts.push({
        kind: "code",
        code: token.text,
        language: resolveCodeLanguage(token.text, language, filePath),
        filePath,
      });
    } else {
      pending.push(token);
    }
  }
  flush();
  return sections;
}
