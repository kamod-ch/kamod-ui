import { describe, expect, it } from "vitest";
import { toDateKey } from "../../shared";
import {
  addDaysToDateKey,
  addMonthsToDateKey,
  buildMonthGrid,
  eventDateKeys,
  formatDateKey,
  parseDateKey,
  startOfWeekKey,
  weekdayLabels,
  weekdayOfDateKey,
} from "./date";
import type { CalendarEvent } from "./types";

describe("event-calendar date keys", () => {
  it("treats YYYY-MM-DD as a civil date, not a UTC instant", () => {
    const lateUtc = new Date("2026-08-14T02:30:00.000Z");
    expect(toDateKey(lateUtc, "UTC")).toBe("2026-08-14");
    expect(toDateKey(lateUtc, "America/Los_Angeles")).toBe("2026-08-13");
    expect(parseDateKey("2026-08-14")).toEqual({ year: 2026, month: 8, day: 14 });
    expect(formatDateKey({ year: 2026, month: 8, day: 14 })).toBe("2026-08-14");
  });

  it("adds days and clamps month overflow", () => {
    expect(addDaysToDateKey("2026-08-14", 1)).toBe("2026-08-15");
    expect(addDaysToDateKey("2026-08-31", 1)).toBe("2026-09-01");
    expect(addMonthsToDateKey("2026-01-31", 1)).toBe("2026-02-28");
    expect(addMonthsToDateKey("2026-03-31", 1)).toBe("2026-04-30");
  });

  it("builds a Monday-start grid without UTC pad errors", () => {
    const grid = buildMonthGrid("2026-08-01", 1);
    expect(grid).toHaveLength(6);
    expect(grid[0]).toHaveLength(7);
    expect(startOfWeekKey("2026-08-14", 1)).toBe("2026-08-10");
    expect(weekdayOfDateKey("2026-08-10")).toBe(1);
    expect(grid[0]?.[0]?.key).toBe("2026-07-27");
    expect(weekdayLabels("en", 1)[0]?.toLowerCase().startsWith("mon")).toBe(true);
  });

  it("maps multi-day instants onto civil keys in a named zone", () => {
    const event: CalendarEvent = {
      id: "ship",
      title: "Ship",
      startsAt: "2026-08-14T02:30:00.000Z",
      endsAt: "2026-08-15T02:30:00.000Z",
    };
    expect(eventDateKeys(event, "America/Los_Angeles")).toEqual(["2026-08-13", "2026-08-14"]);
    expect(eventDateKeys(event, "UTC")).toEqual(["2026-08-14", "2026-08-15"]);
  });
});
