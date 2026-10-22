import { describe, expect, it } from "vitest";
import { blockCategories, catalogBlockCategories } from "./block-categories";
import {
  HIDDEN_BLOCK_NAV_KEYS,
  PLACEHOLDER_BLOCK_CATEGORIES,
  visibleBlockNavItems,
} from "./block-nav-config";
import { publishedBlockOverviewItems } from "./block-overview-items";

describe("published block overview items", () => {
  it("lists every visible nav category except placeholders", () => {
    const items = publishedBlockOverviewItems();
    expect(items).toHaveLength(visibleBlockNavItems.length);
    expect(items.map((item) => item.key).sort()).toEqual(
      visibleBlockNavItems.map((item) => item.key).sort(),
    );
  });

  it("covers published blockCategories keys without shared or planned keys", () => {
    const keys = publishedBlockOverviewItems().map((item) => item.key);
    for (const key of Object.keys(blockCategories)) {
      if (HIDDEN_BLOCK_NAV_KEYS.has(key)) {
        expect(keys).not.toContain(key);
        continue;
      }
      expect(keys).toContain(key);
    }
    for (const key of catalogBlockCategories) {
      if (HIDDEN_BLOCK_NAV_KEYS.has(key)) {
        expect(keys).not.toContain(key);
        continue;
      }
      expect(keys).toContain(key);
    }
    expect(keys).not.toContain("shared");
    for (const { key } of PLACEHOLDER_BLOCK_CATEGORIES) {
      expect(keys).not.toContain(key);
    }
  });
});
