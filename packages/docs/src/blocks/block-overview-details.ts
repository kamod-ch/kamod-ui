/** Presentation and setup links shared by overview cards and basic block guides. */
import type { BlockCategory, BlockOverviewEntry } from "./block-categories";

import { blockSourceUrl } from "./block-links";

const notes: Record<BlockCategory, string> = {
  sidebar:
    "Adapt the sample navigation and page content to your own routes. The source includes the shared sidebar components used by this variant.",
  "application-shell":
    "Supply your navigation, breadcrumbs and account data, then render your pages inside the shell. Routing and user actions stay under your control.",
  login:
    "Connect the form callbacks to your authentication service. Explore the validation and submission feedback before adapting the fields and branding.",
  signup:
    "Connect registration callbacks to your account service, then adapt the fields, terms links and branding to your signup flow.",
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
export function getBlockOverviewDetails(category: BlockCategory, block: BlockOverviewEntry) {
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
