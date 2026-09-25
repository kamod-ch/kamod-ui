/** Upstream destinations shared by category headers, variant cards and setup guides. */
import type { BlockCategory } from "./block-categories";

export const repositoryUrl = "https://github.com/kamod-ch/kamod-ui";

/** Omit the variant ID to link to the entire category's implementation folder. */
export function blockSourceUrl(category: BlockCategory, blockId?: string) {
  return `${repositoryUrl}/tree/main/packages/blocks/src/${category}${blockId ? `/${blockId}` : ""}`;
}

/** Prefill a report with its source context; opening the link never submits an issue. */
export function blockIssueUrl(label: string, sourceUrl: string, kind: "Block" | "Category") {
  const query = new URLSearchParams({
    title: `bug(blocks): ${label} — `,
    body: `${kind}: ${label}\nSource: ${sourceUrl}\n\n### What happened?\n\n### Steps to reproduce\n\n1. \n\n### Expected behavior\n\n${kind === "Block" ? "### Browser and screen size\n\n" : ""}`,
  });
  return `${repositoryUrl}/issues/new?${query}`;
}
