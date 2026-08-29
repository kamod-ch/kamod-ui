const MS_PER_DAY = 86_400_000;

export type DayGroupKind = "today" | "yesterday" | "previous-7-days" | "earlier" | "date";

export type DayGroup = {
  kind: DayGroupKind;
  dateKey: string;
};

export type DateFormatOptions = {
  locale?: string;
  timeZone?: string;
};

const partValue = (parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string =>
  parts.find((part) => part.type === type)?.value ?? "";

/** Civil YYYY-MM-DD in the given time zone (local calendar date, not a UTC instant). */
export const toDateKey = (date: Date, timeZone?: string): string => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  return `${partValue(parts, "year")}-${partValue(parts, "month")}-${partValue(parts, "day")}`;
};

const dateKeyToUtcNoon = (dateKey: string): number => {
  const [year, month, day] = dateKey.split("-").map(Number);
  return Date.UTC(year ?? 0, (month ?? 1) - 1, day ?? 1, 12, 0, 0);
};

const calendarDayDiff = (fromKey: string, toKey: string): number =>
  Math.round((dateKeyToUtcNoon(toKey) - dateKeyToUtcNoon(fromKey)) / MS_PER_DAY);

export const classifyDayGroup = (
  date: Date,
  now: Date = new Date(),
  timeZone?: string,
): DayGroup => {
  const dateKey = toDateKey(date, timeZone);
  const todayKey = toDateKey(now, timeZone);
  const diff = calendarDayDiff(dateKey, todayKey);

  if (diff === 0) return { kind: "today", dateKey };
  if (diff === 1) return { kind: "yesterday", dateKey };
  if (diff >= 2 && diff <= 7) return { kind: "previous-7-days", dateKey };
  if (diff > 7) return { kind: "earlier", dateKey };
  return { kind: "date", dateKey };
};

export const formatDayLabel = (
  date: Date,
  now: Date = new Date(),
  options: DateFormatOptions = {},
): string => {
  const group = classifyDayGroup(date, now, options.timeZone);
  const locale = options.locale ?? "en";

  if (group.kind === "today") {
    return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(0, "day");
  }
  if (group.kind === "yesterday") {
    return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(-1, "day");
  }

  return new Intl.DateTimeFormat(locale, {
    timeZone: options.timeZone,
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export const formatTime = (date: Date, options: DateFormatOptions = {}): string =>
  new Intl.DateTimeFormat(options.locale ?? "en", {
    timeZone: options.timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
