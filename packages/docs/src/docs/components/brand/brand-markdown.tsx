import { Renderer, type RendererObject } from "marked";
import render from "preact-render-to-string";
import { InlineCodeReference } from "../../../references/InlineCodeReference";
import { inlineSourceReference, referenceAttributes } from "../../../references/inline-references";
import { InlineCodeLink, InlineReferenceCode } from "../InlineCodeLink";
import { inlineReference } from "../inline-reference-catalog";
import { PathDisplay } from "../PathDisplay";
import { BrandLink, brandPattern, isBrandLabel, ReferenceLink } from "./BrandText";
import { kamodReferenceHref } from "./kamod-references";

/** Share prose branding with Markdown while leaving fences, HTML escaping and existing links intact. */
export function brandMarkdownRenderer(renderer: RendererObject): RendererObject {
  let linkDepth = 0;
  return {
    ...renderer,
    text(token) {
      const html = Renderer.prototype.text.call(this, token);
      // Nested tokens already passed through their own renderers.
      return linkDepth || ("tokens" in token && token.tokens)
        ? html
        : html.replace(brandPattern, (label: string) =>
            render(<ReferenceLink>{label}</ReferenceLink>),
          );
    },
    codespan(token) {
      const source = inlineSourceReference(token.text);
      if (source)
        return render(
          linkDepth ? (
            <code>{token.text}</code>
          ) : (
            <InlineCodeReference reference={source}>{token.text}</InlineCodeReference>
          ),
        );
      const reference = inlineReference(token.text);
      if (reference)
        return render(
          linkDepth ? (
            <InlineReferenceCode>{token.text}</InlineReferenceCode>
          ) : (
            <InlineCodeLink href={reference.href}>{token.text}</InlineCodeLink>
          ),
        );
      if (kamodReferenceHref(token.text))
        return render(<PathDisplay path={token.text} link={!linkDepth} />);
      if (isBrandLabel(token.text))
        return `<code>${render(<BrandLink link={!linkDepth}>{token.text}</BrandLink>)}</code>`;
      return (renderer.codespan ?? Renderer.prototype.codespan).call(this, token);
    },
    link(token) {
      const child = token.tokens.length === 1 ? token.tokens[0] : undefined;
      const label =
        child && (child.type === "text" || child.type === "codespan") ? child.text : undefined;
      const source =
        typeof label === "string" ? inlineSourceReference(label, token.href) : undefined;
      // Retain the author's destination while decorating exact named labels.
      if (
        token.tokens.length === 1 &&
        token.tokens[0].type === "text" &&
        (inlineReference(token.text) || isBrandLabel(token.text))
      ) {
        token = { ...token, tokens: [{ type: "codespan", raw: token.text, text: token.text }] };
      }
      linkDepth++;
      try {
        const html = (renderer.link ?? Renderer.prototype.link).call(this, token);
        if (source) {
          // Serialize attributes with Preact so authored paths and labels stay escaped.
          const opening = render(
            <a
              class="kamod-code-reference docs-inline-source-reference"
              {...referenceAttributes(source)}
            />,
          )
            .replace(/<\/a>$/, "")
            .replace(/>$/, " ");
          return html.replace(/^<a /, opening);
        }
        return /docs-reference-code|docs-brand-link/.test(html)
          ? html.replace(/^<a /, '<a class="docs-inline-code-link" ')
          : html;
      } finally {
        linkDepth--;
      }
    },
  };
}
