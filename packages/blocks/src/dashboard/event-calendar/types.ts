/**
 * Date strategy
 * -------------
 * - `DateKey` (`YYYY-MM-DD`) is a **civil calendar date** in `timeZone`, not a UTC instant.
 * - `CalendarEvent.startsAt` / `endsAt` are **instants** (ISO string or `Date`).
 * - Map instants → keys with `toDateKey(instant, timeZone)`. Never `new Date("YYYY-MM-DD")`
 *   (that is UTC midnight and shifts the civil day in western zones).
 * - Grid arithmetic uses Y-M-D parts plus UTC-noon only as a stable day counter.
 */

export type DateKey = string;

export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type CalendarEvent = {
  id: string;
  title: string;
  startsAt: string | Date;
  endsAt?: string | Date;
  type?: string;
  location?: string;
  allDay?: boolean;
};

export type EventTypeConfig = {
  id: string;
  label: string;
  /** Semantic token or CSS color. Defaults to `--chart-1`. */
  color?: string;
};

export type CalendarDateRange = {
  start: DateKey;
  end: DateKey;
};

export type CalendarEventAction = "edit" | "duplicate" | "delete";

export type CalendarStatus = "ready" | "loading" | "error";

export type MonthCell = {
  key: DateKey;
  inMonth: boolean;
  weekday: number;
};
