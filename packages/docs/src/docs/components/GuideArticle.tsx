import type { ComponentChildren } from "preact";
import { BlockHeadingLink } from "../../blocks/BlockHeadingLink";
import { DependencyCommands } from "../../blocks/detail/DependencyCommands";
import type { GuideSection } from "../../blocks/guides/guide-markdown";
import { CodeBlock } from "./CodeBlock";
import { HighlightedProse } from "./HighlightedProse";

/** One reading layout for Markdown-backed block and component guides. */
export function GuideArticle({
  header,
  sections,
  children,
}: {
  header: ComponentChildren;
  sections: readonly GuideSection[];
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
              {section.parts.map((part, index) =>
                part.kind === "html" ? (
                  <HighlightedProse key={index} className="block-guide-prose" html={part.html} />
                ) : part.kind === "heading" ? (
                  <GuideSubheading key={part.id} part={part} />
                ) : part.kind === "dependencies" ? (
                  <DependencyCommands key={index} dependencies={part.dependencies} />
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

function GuideSubheading({
  part,
}: {
  part: Extract<GuideSection["parts"][number], { kind: "heading" }>;
}) {
  const Heading = `h${part.level ?? 3}` as "h3" | "h4" | "h5" | "h6";
  return (
    <Heading id={part.id} tabIndex={-1}>
      <BlockHeadingLink id={part.id}>{part.title}</BlockHeadingLink>
    </Heading>
  );
}
