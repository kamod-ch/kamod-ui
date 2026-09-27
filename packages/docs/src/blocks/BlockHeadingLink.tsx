/** @file Native section permalinks shared by block headers and documentation. */
import { LinkIcon } from "@kamod-ch/icons/lucide";
import type { ComponentChildren, JSX } from "preact";

/**
 * Reveals a decorative link icon on hover or keyboard focus when the page gutter fits it.
 * Narrow layouts keep the heading clickable without reserving space for the icon.
 * @param props - The fragment target (or `top`) and the visible heading content.
 */
export const BlockHeadingLink = ({
  id,
  children,
  onClick,
}: {
  id: string;
  children: ComponentChildren;
  onClick?: JSX.MouseEventHandler<HTMLAnchorElement>;
}) => (
  <a class="blocks-doc-heading-link" href={`#${id}`} onClick={onClick}>
    <span class="blocks-doc-heading-icon" aria-hidden="true">
      <LinkIcon size={14} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </span>
    {children}
  </a>
);
