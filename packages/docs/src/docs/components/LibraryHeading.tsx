import type { ComponentChildren } from "preact";
import { BlockHeadingLink } from "../../blocks/BlockHeadingLink";

/** Use the documentation's permalink treatment for directory sections and guide cards. */
export function LibraryHeading({
  id,
  level = 2,
  children,
}: {
  id: string;
  level?: 2 | 3;
  children: ComponentChildren;
}) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <Heading id={id} class="library-heading">
      <BlockHeadingLink id={id}>{children}</BlockHeadingLink>
    </Heading>
  );
}
