export type TimelineFormatOptions = {
  locale?: string;
  timeZone?: string;
  dateStyle?: "full" | "long" | "medium" | "short";
  timeStyle?: "full" | "long" | "medium" | "short";
};

/** Stable ISO-8601 value for `<time dateTime>` — safe for SSR and hydration. */
export const toTimelineDateTime = (value: Date | string): string => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString();
};

/**
 * Absolute timestamp formatting via Intl — no relative phrases like “2 hours ago”
 * that can diverge between server and client renders.
 */
export const formatTimelineDateTime = (
  value: Date | string,
  options: TimelineFormatOptions = {},
): string => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(options.locale ?? "en", {
    timeZone: options.timeZone,
    dateStyle: options.dateStyle ?? "medium",
    timeStyle: options.timeStyle ?? "short",
  }).format(date);
};

export const toTimelineDate = (
  value: Date | string,
  options: Omit<TimelineFormatOptions, "timeStyle"> = {},
): string => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(options.locale ?? "en", {
    timeZone: options.timeZone,
    dateStyle: options.dateStyle ?? "medium",
  }).format(date);
};
