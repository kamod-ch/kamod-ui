/**
 * Single metadata source for block navigation, overview grids, counts, and roadmap pages.
 */

import { type BlockCategory, blockCategories } from "./block-categories";
import {
  type BlockNavKey,
  blockCategoryStatuses,
  HIDDEN_BLOCK_NAV_KEYS,
  PLACEHOLDER_BLOCK_CATEGORIES,
  visibleBlockNavItems,
} from "./block-nav-config";

export { HIDDEN_BLOCK_NAV_KEYS, PLACEHOLDER_BLOCK_CATEGORIES, visibleBlockNavItems };

export type PublishedBlockOverviewItem = {
  key: string;
  label: string;
  href: string;
  count: number;
  description: string;
};

export function overviewTeaser(description: string): string {
  return `${description.replace(/[`*]/g, "").split(". ")[0]}.`;
}

export type BlockNavigationEntry = {
  key: string;
  label: string;
  href: string;
  variantCount: number;
  added?: boolean;
  updated?: boolean;
};

export type PlannedBlockCategory = (typeof PLACEHOLDER_BLOCK_CATEGORIES)[number];

export function publishedBlockNavigationEntries(): BlockNavigationEntry[] {
  return visibleBlockNavItems
    .filter((item) => item.key in blockCategories)
    .map((item) => {
      const key = item.key as BlockNavKey;
      const count = blockCategories[item.key as BlockCategory].blocks.length;
      return {
        key: item.key,
        label: item.label,
        href: item.href,
        variantCount: count,
        added: blockCategoryStatuses[key] === "added",
        updated: blockCategoryStatuses[key] === "updated",
      };
    });
}

export function publishedBlockOverviewList(): PublishedBlockOverviewItem[] {
  const items: PublishedBlockOverviewItem[] = [];
  for (const entry of publishedBlockNavigationEntries()) {
    const category = blockCategories[entry.key as BlockCategory];
    items.push({
      key: entry.key,
      label: entry.label,
      href: entry.href,
      count: entry.variantCount,
      description: category.description,
    });
  }
  return items.sort((a, b) => a.label.localeCompare(b.label));
}

export function blockLibraryCounts() {
  const published = publishedBlockNavigationEntries();
  return {
    availableCategories: published.length,
    availableVariants: published.reduce((sum, entry) => sum + entry.variantCount, 0),
    plannedCategories: PLACEHOLDER_BLOCK_CATEGORIES.length,
  };
}

/** Suggested available collections when a planned category page has no variants yet. */
export function plannedCategoryAlternatives(plannedKey: string): PublishedBlockOverviewItem[] {
  const published = publishedBlockOverviewList();
  const hints: Record<string, string[]> = {
    bento: ["marketing"],
    blog: ["marketing"],
    "blog-post": ["marketing"],
    banner: ["marketing"],
    checkout: ["marketing"],
    "chart-card": ["marketing"],
    "chart-group": ["marketing"],
    contact: ["marketing"],
    community: ["marketing"],
    careers: ["marketing"],
    "case-studies": ["marketing"],
    "case-study": ["marketing"],
    "book-a-demo": ["marketing"],
    "application-shell": ["application-shell"],
  };
  const keys = hints[plannedKey] ?? ["application-shell", "sidebar", "marketing"];
  return keys
    .map((key) => published.find((item) => item.key === key))
    .filter((item): item is PublishedBlockOverviewItem => Boolean(item))
    .slice(0, 3);
}

export function plannedCategoryTeaser(label: string): string {
  return `${label} is on the block library roadmap and does not include copyable variants yet.`;
}

export function blockOverviewIntroCounts() {
  const { availableCategories, availableVariants, plannedCategories } = blockLibraryCounts();
  return { availableCategories, availableVariants, plannedCategories };
}
