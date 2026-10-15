import type { ComponentChildren } from "preact";
import { BlockHeadingLink } from "../../blocks/BlockHeadingLink";
import type { GuideSection } from "../../blocks/guides/guide-markdown";
import { GuideParts } from "./GuideParts";

/** One reading layout for Markdown-backed block and component guides. */
export function GuideArticle({
  header,
  sections,
  sectionContent,
  children,
}: {
  header: ComponentChildren;
  sections: readonly GuideSection[];
  /** Supplement a named section with live examples, retaining its prose and heading. */
  sectionContent?: Readonly<Record<string, ComponentChildren>>;
  children?: ComponentChildren;
}) {
  return (
    <article class="block-guide" id="top">
      {header}
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
              <GuideParts parts={section.parts} />
              {sectionContent?.[section.id]}
            </section>
          ))}
          {children}
        </div>
      </div>
    </article>
  );
}
