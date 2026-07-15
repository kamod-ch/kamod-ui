import { describe, expect, it } from "vitest";
import { sidebarBlocks } from "./registry";

describe("sidebar block registry", () => {
  it("registers exactly sidebar-01 through sidebar-16", () => {
    expect(sidebarBlocks).toHaveLength(16);
    const ids = sidebarBlocks.map((block) => block.id);
    expect(new Set(ids).size).toBe(16);
    expect(ids).toEqual(
      Array.from({ length: 16 }, (_, index) => `sidebar-${String(index + 1).padStart(2, "0")}`),
    );
    expect(sidebarBlocks.every((block) => typeof block.component === "function")).toBe(true);
  });
});
