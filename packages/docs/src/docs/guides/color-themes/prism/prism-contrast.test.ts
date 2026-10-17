import { describe, expect, it } from "vitest";
import { prismInkContrast } from "./prism-contrast";

describe("source ink / canvas evidence", () => {
  it("computes the reference sRGB black/white ratio and preserves equivalent source formats", () => {
    for (const value of ["#000", "#000000", "black", "rgb(0, 0, 0)", "hsl(0 0% 0%)"])
      expect(prismInkContrast(value, "white")).toBeCloseTo(21, 6);
    expect(prismInkContrast("#777", "#fff")).toBeCloseTo(4.478, 3);
    expect(prismInkContrast("rgb(46.6666667% 46.6666667% 46.6666667%)", "#fff")).toBeCloseTo(
      4.478,
      3,
    );
    expect(prismInkContrast("hsl(0deg, 0%, 46.6666667%)", "#fff")).toBeCloseTo(4.478, 3);
    expect(prismInkContrast("slategray", "white")).toBeCloseTo(
      prismInkContrast("#708090", "white")!,
      6,
    );
    expect(prismInkContrast("yellowgreen", "black")).toBeCloseTo(
      prismInkContrast("#9acd32", "black")!,
      6,
    );
  });

  it("composites translucent ink on the actual canvas and handles hue units", () => {
    expect(prismInkContrast("rgb(0 0 0 / 50%)", "#fff")).toBeCloseTo(3.977, 3);
    expect(prismInkContrast("#0008", "#fff")).toBeCloseTo(prismInkContrast("#777", "#fff")!, 6);
    expect(prismInkContrast("transparent", "white")).toBe(1);
    expect(prismInkContrast("hsl(.5turn 100% 50%)", "#000")).toBeCloseTo(
      prismInkContrast("#0ff", "#000")!,
      6,
    );
    expect(prismInkContrast("hsl(-180deg 100% 50%)", "#000")).toBeCloseTo(
      prismInkContrast("#0ff", "#000")!,
      6,
    );
  });

  it("declines unresolved or non-opaque canvases instead of inventing a contrast value", () => {
    for (const value of [
      "var(--ink)",
      "currentColor",
      "color(display-p3 1 0 0)",
      "#nope",
      "rgb(999 0 0)",
    ])
      expect(prismInkContrast(value, "white")).toBeUndefined();
    expect(prismInkContrast("black", "transparent")).toBeUndefined();
    expect(prismInkContrast("black", "rgb(255 255 255 / .8)")).toBeUndefined();
    expect(prismInkContrast("white", "linear-gradient(#2a2139, #34294f)")).toBeUndefined();
  });
});
