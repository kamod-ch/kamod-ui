import { describe, expect, it } from "vitest";
import { createDateRangePresets } from "./date-range-presets";
import {
  addCalendarDays,
  atNoon,
  buildDisabledChecker,
  compareCalendarDays,
  normalizeRange,
  rangeContainsDisabledDay,
  validateRangeDraft,
} from "./date-range-utils";

const ref = atNoon(new Date(2024, 2, 15)); // Mar 15 2024 (DST boundary month in US)

describe("date-range-utils", () => {
  it("adds calendar days across month boundaries without fixed 24h loops", () => {
    const start = atNoon(new Date(2024, 0, 31));
    const next = addCalendarDays(start, 1);
    expect(next.getFullYear()).toBe(2024);
    expect(next.getMonth()).toBe(1);
    expect(next.getDate()).toBe(1);
  });

  it("adds calendar days across leap-day boundaries", () => {
    const feb28 = atNoon(new Date(2024, 1, 28));
    const mar1 = addCalendarDays(feb28, 2);
    expect(mar1.getMonth()).toBe(2);
    expect(mar1.getDate()).toBe(1);
  });

  it("normalizes inverted ranges", () => {
    const from = atNoon(new Date(2024, 5, 10));
    const to = atNoon(new Date(2024, 5, 3));
    const normalized = normalizeRange({ from, to });
    expect(normalized.from.getDate()).toBe(3);
    expect(normalized.to.getDate()).toBe(10);
  });

  it("allows same-day ranges", () => {
    const day = atNoon(new Date(2024, 3, 4));
    const result = validateRangeDraft({ from: day, to: day }, () => false);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.range.from.getTime()).toBe(day.getTime());
    }
  });

  it("rejects incomplete drafts", () => {
    const from = atNoon(new Date(2024, 3, 4));
    const result = validateRangeDraft({ from }, () => false);
    expect(result).toEqual({ ok: false, reason: "incomplete" });
  });

  it("rejects ranges containing disabled days", () => {
    const from = atNoon(new Date(2024, 3, 1));
    const to = atNoon(new Date(2024, 3, 5));
    const blocked = atNoon(new Date(2024, 3, 3));
    const isDisabled = buildDisabledChecker([blocked]);
    expect(rangeContainsDisabledDay(from, to, isDisabled)).toBe(true);
    expect(validateRangeDraft({ from, to }, isDisabled)).toEqual({
      ok: false,
      reason: "disabled-in-range",
    });
  });

  it("respects min and max calendar-day bounds", () => {
    const minDate = atNoon(new Date(2024, 3, 2));
    const maxDate = atNoon(new Date(2024, 3, 8));
    const isDisabled = buildDisabledChecker(undefined, minDate, maxDate);
    expect(isDisabled(atNoon(new Date(2024, 3, 1)))).toBe(true);
    expect(isDisabled(atNoon(new Date(2024, 3, 9)))).toBe(true);
    expect(isDisabled(atNoon(new Date(2024, 3, 5)))).toBe(false);
  });

  it("compares calendar days independent of clock time", () => {
    const morning = new Date(2024, 6, 1, 8, 0, 0);
    const evening = new Date(2024, 6, 1, 20, 0, 0);
    expect(compareCalendarDays(morning, evening)).toBe(0);
  });
});

describe("createDateRangePresets", () => {
  const labels = {
    today: "Today",
    last7Days: "Last 7 days",
    last30Days: "Last 30 days",
    monthToDate: "Month to date",
    previousMonth: "Previous month",
  };

  it("builds deterministic ranges from an explicit reference date", () => {
    const presets = createDateRangePresets(labels);
    const today = presets[0].getRange(ref);
    expect(today.from?.getDate()).toBe(15);
    expect(today.to?.getDate()).toBe(15);

    const last7 = presets[1].getRange(ref);
    expect(last7.from).toEqual(addCalendarDays(ref, -6));
    expect(last7.to?.getDate()).toBe(15);

    const last30 = presets[2].getRange(ref);
    expect(last30.from).toEqual(addCalendarDays(ref, -29));

    const mtd = presets[3].getRange(ref);
    expect(mtd.from?.getDate()).toBe(1);
    expect(mtd.from?.getMonth()).toBe(2);
    expect(mtd.to?.getDate()).toBe(15);

    const prev = presets[4].getRange(ref);
    expect(prev.from).toEqual(atNoon(new Date(2024, 1, 1)));
    expect(prev.to).toEqual(atNoon(new Date(2024, 1, 29)));
  });

  it("handles year boundaries for previous month preset", () => {
    const presets = createDateRangePresets(labels);
    const janRef = atNoon(new Date(2024, 0, 10));
    const prev = presets[4].getRange(janRef);
    expect(prev.from).toEqual(atNoon(new Date(2023, 11, 1)));
    expect(prev.to).toEqual(atNoon(new Date(2023, 11, 31)));
  });
});
