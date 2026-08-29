import { describe, expect, it } from "vitest";
import {
  clampNonNegative,
  funnelRetention,
  funnelShareOfFirst,
  niceCeil,
  normalizeFunnelStages,
  pieArcs,
} from "./chart-math";

describe("chart math", () => {
  it("treats negative and non-finite values as zero", () => {
    expect(clampNonNegative(-4)).toBe(0);
    expect(clampNonNegative(Number.NaN)).toBe(0);
    expect(clampNonNegative(12)).toBe(12);
  });

  it("rejects funnels outside 3–6 stages and divides by zero safely", () => {
    expect(normalizeFunnelStages([{ id: "a", label: "A", value: 10 }])).toEqual([]);
    expect(
      normalizeFunnelStages(
        Array.from({ length: 7 }, (_, index) => ({
          id: `s${index}`,
          label: `S${index}`,
          value: index + 1,
        })),
      ),
    ).toHaveLength(6);
    expect(funnelRetention(4, 0)).toBeNull();
    expect(funnelShareOfFirst(20, 0)).toBeNull();
    expect(funnelRetention(25, 50)).toBe(0.5);
  });

  it("drops empty pie slices and returns an empty list when nothing remains", () => {
    expect(pieArcs([{ id: "empty", label: "Empty", value: -3 }])).toEqual([]);
    const arcs = pieArcs([
      { id: "a", label: "A", value: 1 },
      { id: "b", label: "B", value: 1 },
    ]);
    expect(arcs).toHaveLength(2);
    expect(arcs[0]?.percent).toBe(0.5);
  });

  it("ceils axis maxima onto a readable scale", () => {
    expect(niceCeil(0)).toBe(1);
    expect(niceCeil(37)).toBe(50);
  });
});
