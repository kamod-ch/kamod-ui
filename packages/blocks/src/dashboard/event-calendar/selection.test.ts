import { describe, expect, it } from "vitest";
import { applyDateSelection } from "./selection";

describe("event-calendar selection", () => {
  it("selects a single day without Shift", () => {
    expect(applyDateSelection("2026-08-16", false, "2026-08-14")).toEqual({
      range: { start: "2026-08-16", end: "2026-08-16" },
      anchor: "2026-08-16",
    });
  });

  it("extends a range from the anchor with Shift", () => {
    expect(applyDateSelection("2026-08-16", true, "2026-08-14")).toEqual({
      range: { start: "2026-08-14", end: "2026-08-16" },
      anchor: "2026-08-14",
    });
    expect(applyDateSelection("2026-08-10", true, "2026-08-14")).toEqual({
      range: { start: "2026-08-10", end: "2026-08-14" },
      anchor: "2026-08-14",
    });
  });
});
