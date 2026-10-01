import type { ComponentChildren } from "preact";
import { BlockHeadingLink } from "../../blocks/BlockHeadingLink";

/** Uses the same section rhythm and native permalinks as the block guides. */
export function LibraryGuideSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ComponentChildren;
}) {
  return (
    <section class="blocks-doc-section block-guide-section" aria-labelledby={id}>
      <h2 id={id} tabIndex={-1}>
        <BlockHeadingLink id={id}>{title}</BlockHeadingLink>
      </h2>
      {children}
    </section>
  );
}
