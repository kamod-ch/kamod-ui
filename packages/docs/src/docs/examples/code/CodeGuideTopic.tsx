import type { ComponentChildren } from "preact";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";

/** Keep authored topics linkable and aligned with the shared documentation hierarchy. */
export function CodeGuideTopic({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ComponentChildren;
}) {
  return (
    <section class="blocks-api-section" aria-labelledby={id}>
      <h3 id={id} tabIndex={-1}>
        <BlockHeadingLink id={id}>{title}</BlockHeadingLink>
      </h3>
      {children}
    </section>
  );
}
