import { describe, expect, it } from "vitest";
import { dashboardBlocks, dashboardBlocksById } from "./registry";

describe("dashboard blocks registry", () => {
  it("registers all 15 dashboard blocks with unique ids", () => {
    expect(dashboardBlocks).toHaveLength(15);
    const ids = dashboardBlocks.map((block) => block.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([
      "analytics-overview",
      "command-palette",
      "conversion-funnel",
      "cost-breakdown",
      "dashboard-layout",
      "event-calendar",
      "event-list",
      "kanban-board",
      "metrics-grid",
      "notifications-popover",
      "profile-menu",
      "progress-breakdown",
      "quick-actions",
      "theme-customize",
      "toggle-setting-list",
    ]);

    for (const block of dashboardBlocks) {
      expect(block.component).toBeTypeOf("function");
      expect(block.category).toBe("dashboard");
      expect(block.source).toBe("uipkge");
      expect(block.installCommand).toBe(`@kamod-ch/blocks/dashboard/${block.id}`);
      expect(block.files.length).toBeGreaterThan(0);
      expect(dashboardBlocksById[block.id]).toBe(block);
    }
  });
});
