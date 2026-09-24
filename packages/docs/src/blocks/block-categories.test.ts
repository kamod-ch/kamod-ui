import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { blockCategories, legacyBlockDestination } from "./block-categories";
import { visibleBlockNavItems } from "./block-nav-config";

describe("block category documentation", () => {
  it("covers exactly the visible categories without enabling hidden routes", () => {
    expect(Object.keys(blockCategories).sort()).toEqual(
      visibleBlockNavItems.map((item) => item.key).sort(),
    );
  });

  for (const [category, { blocks }] of Object.entries(blockCategories)) {
    it(`keeps ${category} metadata aligned with detail and preview routes`, () => {
      expect(new Set(blocks.map((block) => block.id)).size).toBe(blocks.length);
      for (const block of blocks) {
        const directory = resolve(import.meta.dirname, "../../blocks", category, block.id);
        expect(existsSync(resolve(directory, "preview.md"))).toBe(true);
        const detail = readFileSync(resolve(directory, "index.md"), "utf8");
        expect(detail).toContain(`blockId: "${block.id}"`);
        expect(block).not.toHaveProperty("component");
      }
    });
  }

  it("preserves registered bookmarks without accepting unknown, cross-category or malformed IDs", () => {
    expect(legacyBlockDestination("login", "#login-01")).toBe("/blocks/login/login-01#login-01");
    expect(legacyBlockDestination("signup", "#signup%2D05")).toBe(
      "/blocks/signup/signup-05#signup-05",
    );
    for (const fragment of ["", "#login-99", "#signup-01", "#%ZZ", "#../../login-01"]) {
      expect(legacyBlockDestination("login", fragment)).toBeUndefined();
    }
  });
});
