/** Presentation and setup links shared by overview cards and basic block guides. */
import type { BlockCategory, BlockOverviewEntry } from "./block-categories.ts";

import { blockSourceUrl } from "./block-links.ts";

const notes: Record<BlockCategory, string> = {
  sidebar:
    "Adapt the sample navigation and page content to your own routes. The source includes the shared sidebar components used by this variant.",
  "application-shell":
    "Supply your navigation, breadcrumbs and account data, then render your pages inside the shell. Routing and user actions stay under your control.",
  login:
    "Connect the form callbacks to your authentication service. Explore the validation and submission feedback before adapting the fields and branding.",
  signup:
    "Connect registration callbacks to your account service, then adapt the fields, terms links and branding to your signup flow.",
  "app-sidebar":
    "Wire navigation, team and user callbacks to your routes. Wrap the sidebar in SidebarProvider and render your pages in SidebarInset.",
  auth: "Connect submit and OAuth callbacks to your authentication service. Catalog variants use typed props; network and session logic stay in your app.",
  marketing:
    "Pass typed content props into each section component. Replace demo copy and links, then compose sections on your landing pages.",
  dashboard:
    "Supply controlled data and event handlers for charts, lists and layout shells. Demo fixtures illustrate structure; your app owns persistence.",
  communication:
    "Provide messages, threads and send handlers from your backend. Previews use fixtures; production code should avoid shipping demo data.",
  commerce:
    "Connect payment and checkout callbacks to your PSP or tokenization layer. Never persist PAN/CVC; use hosted fields in production.",
};

/** Turn registry titles into readable variant labels without changing their route IDs. */
export function getBlockDisplayName(title: string) {
  return title
    .split("-")
    .map((part) =>
      /^\d+$/.test(part) ? String(Number(part)) : part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join(" ");
}

/** Derive presentation and setup data without importing a live block component. */
export function getBlockOverviewDetails(
  category: BlockCategory,
  block: Pick<BlockOverviewEntry, "id" | "title" | "dependencies">,
) {
  const displayName = getBlockDisplayName(block.title);
  // Registry dependencies are direct imports; UI also requires these setup peers.
  const dependencies = [
    ...new Set([
      ...block.dependencies,
      ...(block.dependencies.includes("@kamod-ch/ui")
        ? ["@kamod-ch/themes", "@preact/signals"]
        : []),
    ]),
  ];
  return {
    displayName,
    dependencies,
    note: notes[category],
    sourceUrl: blockSourceUrl(category, block.id),
    installationId:
      category === "application-shell"
        ? "application-shell-installation"
        : `${block.id}-installation`,
  };
}
