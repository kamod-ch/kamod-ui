import { type ComponentChildren, createContext } from "preact";
import { useContext } from "preact/hooks";
import { BlockHeadingLink } from "../BlockHeadingLink";
import type { BlockCategory } from "../block-categories";
import { BlockGuideContents } from "./BlockGuideContents";
import { BlockGuideFooter } from "./BlockGuideFooter";
import type { BlockGuideIdentity, BlockGuideSection } from "./types";

const GuideContext = createContext<readonly BlockGuideSection[]>([]);

/** Resolves headings from the same definitions used by the contents links. */
export function BlockGuideHeading({ id, level = 3 }: { id: string; level?: 2 | 3 }) {
  const sections = useContext(GuideContext);
  const heading = sections
    .flatMap((section) => [section, ...(section.children ?? [])])
    .find((entry) => entry.id === id);
  if (!heading) throw new Error(`Missing block guide heading: ${id}`);
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <Heading id={id} tabIndex={-1}>
      <BlockHeadingLink id={id}>
        {heading.step && (
          <span class="blocks-doc-step-index" aria-hidden="true">
            {heading.step}.{" "}
          </span>
        )}
        {heading.label}
      </BlockHeadingLink>
    </Heading>
  );
}

/** Shared section frame, preserving rich introductions without layout-specific flags. */
export function BlockDocSection({
  id,
  introduction,
  className = "",
  children,
}: {
  id: string;
  introduction?: ComponentChildren;
  className?: string;
  children: ComponentChildren;
}) {
  const section = useContext(GuideContext).find((entry) => entry.id === id);
  if (!section) throw new Error(`Missing block guide section: ${id}`);
  return (
    <section class={`blocks-doc-section ${className}`} aria-labelledby={id}>
      <header class="blocks-doc-section-header">
        <p class="blocks-doc-eyebrow">{section.eyebrow}</p>
        <BlockGuideHeading id={id} level={2} />
        {introduction}
      </header>
      {children}
    </section>
  );
}

/** One responsive guide grid, native contents navigation and footer for every variant. */
export function BlockDocumentation({
  block,
  category,
  sections,
  contentsId = `${block.id}-contents`,
}: {
  block: BlockGuideIdentity;
  category: BlockCategory;
  sections: readonly BlockGuideSection[];
  /** Preserve an existing contents anchor when migrating a guide. */
  contentsId?: string;
}) {
  return (
    <GuideContext.Provider value={sections}>
      <section class="blocks-doc-guide" aria-label={`${block.title} documentation`}>
        <div class="blocks-detail-documentation">
          <BlockGuideContents block={block} sections={sections} id={contentsId} />
          <div class="blocks-doc-body">
            {sections.map(({ id, Content }) => (
              <Content key={id} />
            ))}
          </div>
          <BlockGuideFooter block={block} category={category} />
        </div>
      </section>
    </GuideContext.Provider>
  );
}
