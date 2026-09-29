import type { CalendarDisabledProp, DateRange } from "../calendar/Calendar";

export type { DateRange };

export type RangeValidationReason = "incomplete" | "invalid" | "disabled-in-range";

export type RangeValidation =
  | { ok: true; range: { from: Date; to: Date } }
  | { ok: false; reason: RangeValidationReason };

/** Civil calendar day at local noon — avoids DST midnight drift. */
export const atNoon = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);

export const isSameCalendarDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const compareCalendarDays = (a: Date, b: Date) => atNoon(a).getTime() - atNoon(b).getTime();

/** Calendar-day arithmetic via `Date#setDate`, not fixed 24h milliseconds. */
export const addCalendarDays = (d: Date, delta: number): Date => {
  const next = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);
  next.setDate(next.getDate() + delta);
  return next;
};

export const startOfCalendarMonth = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), 1, 12, 0, 0);

export const endOfCalendarMonth = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth() + 1, 0, 12, 0, 0);

export const cloneRange = (range: DateRange | undefined): DateRange | undefined => {
  if (!range) return undefined;
  return {
    from: range.from ? atNoon(range.from) : undefined,
    to: range.to ? atNoon(range.to) : undefined,
  };
};

export const isSameRange = (a: DateRange | undefined, b: DateRange | undefined): boolean => {
  if (!a?.from || !a?.to || !b?.from || !b?.to) return false;
  return isSameCalendarDay(a.from, b.from) && isSameCalendarDay(a.to, b.to);
};

export const isCompleteRange = (range: DateRange | undefined): range is { from: Date; to: Date } =>
  Boolean(range?.from && range?.to);

export const normalizeRange = (range: { from: Date; to: Date }): { from: Date; to: Date } => {
  const from = atNoon(range.from);
  const to = atNoon(range.to);
  if (compareCalendarDays(from, to) <= 0) {
    return { from, to };
  }
  return { from: to, to: from };
};

export const eachCalendarDayInclusive = function* (from: Date, to: Date) {
  let start = atNoon(from);
  const end = atNoon(to);
  if (compareCalendarDays(start, end) > 0) {
    return;
  }
  while (compareCalendarDays(start, end) <= 0) {
    yield start;
    start = addCalendarDays(start, 1);
  }
};

export const rangeContainsDisabledDay = (
  from: Date,
  to: Date,
  isDisabled: (d: Date) => boolean,
): boolean => {
  for (const day of eachCalendarDayInclusive(from, to)) {
    if (isDisabled(day)) return true;
  }
  return false;
};

export const buildDisabledChecker = (
  disabled?: CalendarDisabledProp,
  minDate?: Date,
  maxDate?: Date,
): ((d: Date) => boolean) => {
  return (d: Date) => {
    const day = atNoon(d);
    if (minDate && compareCalendarDays(day, atNoon(minDate)) < 0) return true;
    if (maxDate && compareCalendarDays(day, atNoon(maxDate)) > 0) return true;
    if (!disabled) return false;
    if (Array.isArray(disabled)) {
      return disabled.some((candidate) => isSameCalendarDay(atNoon(candidate), day));
    }
    return disabled(d);
  };
};

export const validateRangeDraft = (
  draft: DateRange | undefined,
  isDisabled: (d: Date) => boolean,
): RangeValidation => {
  if (!draft?.from || !draft?.to) {
    return { ok: false, reason: "incomplete" };
  }
  const normalized = normalizeRange({ from: draft.from, to: draft.to });
  if (rangeContainsDisabledDay(normalized.from, normalized.to, isDisabled)) {
    return { ok: false, reason: "disabled-in-range" };
  }
  return { ok: true, range: normalized };
};

export const formatDateRangeDisplay = (
  range: DateRange | undefined,
  locale?: string,
  options?: Intl.DateTimeFormatOptions,
) => {
  if (!range?.from) return "";
  const fmt = (date: Date) =>
    date.toLocaleDateString(locale, options ?? { month: "short", day: "numeric", year: "numeric" });
  if (!range.to) return fmt(range.from);
  if (isSameCalendarDay(range.from, range.to)) return fmt(range.from);
  return `${fmt(range.from)} – ${fmt(range.to)}`;
};
