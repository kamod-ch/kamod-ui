import type { ComponentChildren } from "preact";
import { BlockHeadingLink } from "../../blocks/BlockHeadingLink";
import { BlockGuideContents } from "../../blocks/detail/BlockGuideContents";
import type { GuideSection } from "../../blocks/guides/guide-markdown";
import type { DocContentsSection } from "../types";
import { CodeBlock } from "./CodeBlock";

/** One reading layout for Markdown-backed block and component guides. */
export function GuideArticle({
  id,
  title,
  header,
  sections,
  contents,
  children,
}: {
  id: string;
  title: string;
  header: ComponentChildren;
  sections: readonly GuideSection[];
  contents: readonly DocContentsSection[];
  children?: ComponentChildren;
}) {
  return (
    <article class="block-guide" id="top">
      {header}
      <BlockGuideContents
        id={`${id}-mobile-contents`}
        sections={contents}
        pageTitle={title}
        mobile
      />
      <div class="block-guide-documentation">
        <div class="blocks-doc-body">
          {sections.map((section) => (
            <section
              key={section.id}
              class="blocks-doc-section block-guide-section"
              aria-labelledby={section.id}
            >
              <h2 id={section.id} tabIndex={-1}>
                <BlockHeadingLink id={section.id}>{section.title}</BlockHeadingLink>
              </h2>
              {section.parts.map((part, index) =>
                part.kind === "html" ? (
                  <div
                    key={index}
                    class="block-guide-prose"
                    dangerouslySetInnerHTML={{ __html: part.html }}
                  />
                ) : part.kind === "heading" ? (
                  <h3 key={part.id} id={part.id} tabIndex={-1}>
                    <BlockHeadingLink id={part.id}>{part.title}</BlockHeadingLink>
                  </h3>
                ) : (
                  <CodeBlock
                    key={index}
                    code={part.code}
                    language={part.language}
                    filePath={part.filePath}
                  />
                ),
              )}
            </section>
          ))}
          {children}
        </div>
      </div>
    </article>
  );
}
