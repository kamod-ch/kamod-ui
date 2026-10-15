import { BlockHeadingLink } from "../../blocks/BlockHeadingLink";
import { DependencyCommands } from "../../blocks/detail/DependencyCommands";
import type { GuideSection } from "../../blocks/guides/guide-markdown";
import { CodeBlock } from "./CodeBlock";
import { HighlightedProse } from "./HighlightedProse";

/** Render authored guide parts with shared source readers and reference-aware inline prose. */
export function GuideParts({
  parts,
  headingOffset = 0,
}: {
  parts: GuideSection["parts"];
  /** Embedded topics sit one heading level deeper than full-page guide sections. */
  headingOffset?: number;
}) {
  return (
    <>
      {parts.map((part, index) => {
        if (part.kind === "html")
          return <HighlightedProse key={index} className="block-guide-prose" html={part.html} />;
        if (part.kind === "dependencies")
          return <DependencyCommands key={index} dependencies={part.dependencies} />;
        if (part.kind === "code")
          return (
            <CodeBlock
              key={index}
              code={part.code}
              language={part.language}
              filePath={part.filePath}
            />
          );
        const Heading = `h${Math.min(6, (part.level ?? 3) + headingOffset)}` as
          | "h3"
          | "h4"
          | "h5"
          | "h6";
        return (
          <Heading key={part.id} id={part.id} tabIndex={-1}>
            <BlockHeadingLink id={part.id}>{part.title}</BlockHeadingLink>
          </Heading>
        );
      })}
    </>
  );
}
