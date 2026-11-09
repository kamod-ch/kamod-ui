import { describe, expect, it } from "vitest";
import { blockCategories } from "./block-categories";
import {
  blockLibraryCounts,
  PLACEHOLDER_BLOCK_CATEGORIES,
  publishedBlockNavigationEntries,
  publishedBlockOverviewList,
} from "./block-library-metadata";
import { HIDDEN_BLOCK_NAV_KEYS, visibleBlockNavItems } from "./block-nav-config";

describe("block-library-metadata", () => {
  it("derives published counts only from implemented categories", () => {
    const published = publishedBlockNavigationEntries();
    const expected = visibleBlockNavItems.filter((item) => item.key in blockCategories);
    expect(published).toHaveLength(expected.length);
    const counts = blockLibraryCounts();
    expect(counts.plannedCategories).toBe(PLACEHOLDER_BLOCK_CATEGORIES.length);
    expect(counts.availableCategories).toBe(published.length);
    expect(counts.availableVariants).toBe(
      published.reduce((sum, entry) => sum + entry.variantCount, 0),
    );
  });

  it("keeps overview list aligned with published navigation", () => {
    const list = publishedBlockOverviewList();
    for (const item of list) {
      expect(HIDDEN_BLOCK_NAV_KEYS.has(item.key)).toBe(false);
      expect(blockCategories[item.key as keyof typeof blockCategories].blocks.length).toBe(
        item.count,
      );
    }
  });
});
