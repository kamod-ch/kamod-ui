import type { ComponentChildren } from "preact";
import { BlockHeadingLink } from "../../blocks/BlockHeadingLink";

/** One focusable page-title destination and native permalink for every documentation header. */
export function PageTitle({ children }: { children: ComponentChildren }) {
  return (
    <h1 id="page-title" tabIndex={-1}>
      <BlockHeadingLink id="page-title">{children}</BlockHeadingLink>
    </h1>
  );
}
