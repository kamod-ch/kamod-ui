/** @file Native section permalinks shared by the application shell documentation. */
import { LinkIcon } from "@kamod-ch/icons/lucide";
import type { ComponentChildren } from "preact";

/**
 * Reveals a decorative link icon on hover or keyboard focus when the page gutter fits it.
 * Narrow layouts keep the heading clickable without reserving space for the icon.
 * @param props - The fragment target (or `top`) and the visible heading content.
 */
export const ShellHeadingLink = ({ id, children }: { id: string; children: ComponentChildren }) => (
  <a class="blocks-doc-heading-link" href={`#${id}`}>
    <span class="blocks-doc-heading-icon" aria-hidden="true">
      <LinkIcon size={14} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </span>
    {children}
  </a>
);
