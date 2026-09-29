import { describe, expect, it } from "vitest";
import { resolveMultiSelectLabel } from "./multi-select-utils";

describe("resolveMultiSelectLabel", () => {
  const options = [
    { value: "design", label: "Design" },
    { value: "eng", label: "Engineering" },
  ];

  it("prefers selectedLabels for missing options", () => {
    expect(resolveMultiSelectLabel("legacy", options, { legacy: "Legacy team" })).toBe(
      "Legacy team",
    );
  });

  it("falls back to option label then raw id", () => {
    expect(resolveMultiSelectLabel("design", options)).toBe("Design");
    expect(resolveMultiSelectLabel("unknown", options)).toBe("unknown");
  });
});
