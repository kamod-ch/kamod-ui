import { Renderer, type RendererObject } from "marked";
import render from "preact-render-to-string";
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
        return /docs-reference-code|docs-brand-link/.test(html)
          ? html.replace(/^<a /, '<a class="docs-inline-code-link" ')
          : html;
      } finally {
        linkDepth--;
      }
    },
  };
}
