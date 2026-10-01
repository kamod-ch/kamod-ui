import type { ComponentChildren } from "preact";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import type { DocSection } from "../../types";

/** Keep existing section anchors while sharing the block documentation's heading and prose styles. */
export function ComponentDocSection({
  section,
  children,
}: {
  section: DocSection;
  children?: ComponentChildren;
}) {
  return (
    <section
      id={section.id}
      class="docs-section blocks-doc-section component-doc-section"
      aria-labelledby={`${section.id}-title`}
    >
      <h2 id={`${section.id}-title`} tabIndex={-1}>
        <BlockHeadingLink id={section.id}>{section.title}</BlockHeadingLink>
      </h2>
      <p class="docs-copy">
        {section.text
          .split(/(`[^`]+`|\b[\w-]+="[^"]+")/g)
          .map((part, index) =>
            part.startsWith("`") ? (
              <code key={index}>{part.slice(1, -1)}</code>
            ) : /^[\w-]+="/.test(part) ? (
              <code key={index}>{part}</code>
            ) : (
              part
            ),
          )}
      </p>
      {children}
    </section>
  );
}
