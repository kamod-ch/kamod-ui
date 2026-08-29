import { describe, expect, it } from "vitest";
import { appSidebarBlocks, appSidebarBlocksById } from "./registry";

describe("app-sidebar registry", () => {
  it("registers seven uipkge sidebar variants without colliding with the existing catalog", () => {
    expect(appSidebarBlocks).toHaveLength(7);
    const ids = appSidebarBlocks.map((block) => block.id);
    expect(ids).toEqual([
      "sidebar-01",
      "sidebar-02",
      "sidebar-03",
      "sidebar-04",
      "sidebar-05",
      "sidebar-06",
      "sidebar-07",
    ]);
    for (const block of appSidebarBlocks) {
      expect(block.category).toBe("app-sidebar");
      expect(block.source).toBe("uipkge");
      expect(block.installCommand).toBe(`@kamod-ch/blocks/app-sidebar/${block.id}`);
      expect(appSidebarBlocksById[block.id]).toBe(block);
    }
  });
});
