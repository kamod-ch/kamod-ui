import { describe, expect, it } from "vitest";
import { generateTypesetPreset, normalizeTypesetPresetName } from "../src/generator";

it("generates deterministic preset CSS", () => {
  expect(
    generateTypesetPreset({
      name: "product-docs",
      size: "15px",
      leading: 1.75,
      flow: "1.5em",
      measure: "72ch",
    }),
  ).toBe(
    `.typeset-product-docs {\n  --typeset-size: 15px;\n  --typeset-leading: 1.75;\n  --typeset-flow: 1.5em;\n  --typeset-measure: 72ch;\n}\n`,
  );
});

describe("validation", () => {
  it("normalizes safe names", () => {
    expect(normalizeTypesetPresetName("Product Docs_2")).toBe("product-docs-2");
  });

  it("rejects invalid class names", () => {
    expect(() => normalizeTypesetPresetName("123")).toThrow(/Invalid/);
    expect(() => normalizeTypesetPresetName("typeset")).toThrow(/Reserved/);
  });

  it("rejects unsafe CSS values", () => {
    expect(() =>
      generateTypesetPreset({ name: "bad", size: "1rem; color:red", flow: "1em" }),
    ).toThrow(/Unsafe/);
    expect(() => generateTypesetPreset({ name: "bad", leading: 99 })).toThrow(/between 1 and 3/);
  });
});
