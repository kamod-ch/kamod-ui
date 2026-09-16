import { describe, expect, it } from "vitest";
import {
  normalizeResizableSizes,
  resizeAdjacentPanels,
  setAdjacentPanelsExtreme,
  validateResizableConstraints,
} from "./resizable-utils";

const panels = [
  { id: "a", minSize: 15, maxSize: 60 },
  { id: "b", minSize: 20, maxSize: 70 },
  { id: "c", minSize: 10, maxSize: 50 },
];

describe("resizable utils", () => {
  it("normalizes sizes to sum to 100", () => {
    const normalized = normalizeResizableSizes([20, 20, 20], 3);
    expect(normalized.every((size) => Math.abs(size - 100 / 3) < 0.001)).toBe(true);
    expect(normalized.reduce((a, b) => a + b, 0)).toBeCloseTo(100, 5);
  });

  it("detects impossible minSize sums", () => {
    expect(
      validateResizableConstraints([
        { id: "a", minSize: 60, maxSize: 80 },
        { id: "b", minSize: 50, maxSize: 80 },
      ]),
    ).toMatch(/minSize values sum/);
  });

  it("clamps adjacent resize to panel constraints", () => {
    const next = resizeAdjacentPanels([40, 35, 25], 0, 30, panels);
    expect(next[0]).toBeLessThanOrEqual(60);
    expect(next[1]).toBeGreaterThanOrEqual(20);
    expect(next[0]! + next[1]! + next[2]!).toBeCloseTo(100, 1);
  });

  it("applies signed transfer to the adjacent pair only", () => {
    const grow = resizeAdjacentPanels([40, 35, 25], 0, 5, panels);
    const shrink = resizeAdjacentPanels([40, 35, 25], 0, -5, panels);
    expect(grow[0]).toBeGreaterThan(shrink[0]!);
    expect(grow[0]! + grow[1]!).toBeCloseTo(shrink[0]! + shrink[1]!, 1);
  });

  it("sets keyboard extremes for a pair", () => {
    const start = [40, 35, 25];
    const minLeft = setAdjacentPanelsExtreme(start, 0, "start", panels);
    expect(minLeft[0]).toBe(15);
    const maxLeft = setAdjacentPanelsExtreme(start, 0, "end", panels);
    expect(maxLeft[0]).toBeGreaterThan(start[0]!);
  });
});
