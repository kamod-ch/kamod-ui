import { describe, expect, it } from "vitest";
import { classifyDayGroup, formatDayLabel, toDateKey } from "./datetime";

describe("datetime utilities", () => {
  it("formats a civil date key in a named time zone without UTC shift", () => {
    const lateUtc = new Date("2026-08-14T02:30:00.000Z");
    expect(toDateKey(lateUtc, "UTC")).toBe("2026-08-14");
    expect(toDateKey(lateUtc, "America/Los_Angeles")).toBe("2026-08-13");
  });

  it("classifies today, yesterday, previous 7 days, and earlier", () => {
    const now = new Date("2026-08-14T15:00:00.000Z");
    expect(classifyDayGroup(new Date("2026-08-14T08:00:00.000Z"), now, "UTC").kind).toBe("today");
    expect(classifyDayGroup(new Date("2026-08-13T08:00:00.000Z"), now, "UTC").kind).toBe(
      "yesterday",
    );
    expect(classifyDayGroup(new Date("2026-08-10T08:00:00.000Z"), now, "UTC").kind).toBe(
      "previous-7-days",
    );
    expect(classifyDayGroup(new Date("2026-07-01T08:00:00.000Z"), now, "UTC").kind).toBe("earlier");
  });

  it("uses relative labels for today and yesterday", () => {
    const now = new Date("2026-08-14T15:00:00.000Z");
    expect(formatDayLabel(now, now, { locale: "en", timeZone: "UTC" }).toLowerCase()).toContain(
      "today",
    );
    expect(
      formatDayLabel(new Date("2026-08-13T15:00:00.000Z"), now, {
        locale: "en",
        timeZone: "UTC",
      }).toLowerCase(),
    ).toContain("yesterday");
  });
});
