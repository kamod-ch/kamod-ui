import { toDateKey } from "../../shared";
import type { CalendarEvent, DateKey, MonthCell, WeekStartsOn } from "./types";

const MS_PER_DAY = 86_400_000;
const DATE_KEY = /^(\d{4})-(\d{2})-(\d{2})$/;

export type DateParts = { year: number; month: number; day: number };

export const parseDateKey = (key: DateKey): DateParts => {
  const match = DATE_KEY.exec(key);
  if (!match) {
    throw new Error(`Invalid DateKey: ${key}`);
  }
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
};

export const formatDateKey = ({ year, month, day }: DateParts): DateKey =>
  `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const utcNoon = (key: DateKey): number => {
  const { year, month, day } = parseDateKey(key);
  return Date.UTC(year, month - 1, day, 12, 0, 0);
};

export const compareDateKeys = (a: DateKey, b: DateKey): number => utcNoon(a) - utcNoon(b);

export const addDaysToDateKey = (key: DateKey, days: number): DateKey => {
  const next = new Date(utcNoon(key) + days * MS_PER_DAY);
  return formatDateKey({
    year: next.getUTCFullYear(),
    month: next.getUTCMonth() + 1,
    day: next.getUTCDate(),
  });
};

export const daysInMonth = (year: number, month: number): number =>
  new Date(Date.UTC(year, month, 0, 12, 0, 0)).getUTCDate();

export const addMonthsToDateKey = (key: DateKey, months: number): DateKey => {
  const { year, month, day } = parseDateKey(key);
  const total = year * 12 + (month - 1) + months;
  const nextYear = Math.floor(total / 12);
  const nextMonth = (total % 12) + 1;
  return formatDateKey({
    year: nextYear,
    month: nextMonth,
    day: Math.min(day, daysInMonth(nextYear, nextMonth)),
  });
};

export const startOfMonthKey = (key: DateKey): DateKey => {
  const { year, month } = parseDateKey(key);
  return formatDateKey({ year, month, day: 1 });
};

export const endOfMonthKey = (key: DateKey): DateKey => {
  const { year, month } = parseDateKey(key);
  return formatDateKey({ year, month, day: daysInMonth(year, month) });
};

export const weekdayOfDateKey = (key: DateKey): number => new Date(utcNoon(key)).getUTCDay();

export const startOfWeekKey = (key: DateKey, weekStartsOn: WeekStartsOn): DateKey => {
  const weekday = weekdayOfDateKey(key);
  const offset = (weekday - weekStartsOn + 7) % 7;
  return addDaysToDateKey(key, -offset);
};

export const endOfWeekKey = (key: DateKey, weekStartsOn: WeekStartsOn): DateKey =>
  addDaysToDateKey(startOfWeekKey(key, weekStartsOn), 6);

export const minDateKey = (a: DateKey, b: DateKey): DateKey => (compareDateKeys(a, b) <= 0 ? a : b);

export const maxDateKey = (a: DateKey, b: DateKey): DateKey => (compareDateKeys(a, b) >= 0 ? a : b);

export const isDateKeyInRange = (key: DateKey, start: DateKey, end: DateKey): boolean => {
  const from = minDateKey(start, end);
  const to = maxDateKey(start, end);
  return compareDateKeys(key, from) >= 0 && compareDateKeys(key, to) <= 0;
};

export const eachDateKey = (start: DateKey, end: DateKey): DateKey[] => {
  const from = minDateKey(start, end);
  const to = maxDateKey(start, end);
  const keys: DateKey[] = [];
  let cursor = from;
  while (compareDateKeys(cursor, to) <= 0) {
    keys.push(cursor);
    cursor = addDaysToDateKey(cursor, 1);
  }
  return keys;
};

export const buildMonthGrid = (monthKey: DateKey, weekStartsOn: WeekStartsOn): MonthCell[][] => {
  const monthStart = startOfMonthKey(monthKey);
  const gridStart = startOfWeekKey(monthStart, weekStartsOn);
  const month = parseDateKey(monthStart).month;
  const rows: MonthCell[][] = [];
  let cursor = gridStart;
  for (let week = 0; week < 6; week += 1) {
    const row: MonthCell[] = [];
    for (let day = 0; day < 7; day += 1) {
      row.push({
        key: cursor,
        inMonth: parseDateKey(cursor).month === month,
        weekday: (weekStartsOn + day) % 7,
      });
      cursor = addDaysToDateKey(cursor, 1);
    }
    rows.push(row);
  }
  return rows;
};

export const weekdayLabels = (locale: string, weekStartsOn: WeekStartsOn): string[] => {
  const sunday = Date.UTC(2026, 7, 2, 12, 0, 0);
  const format = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
  return Array.from({ length: 7 }, (_, index) => {
    const weekday = (weekStartsOn + index) % 7;
    return format.format(new Date(sunday + weekday * MS_PER_DAY));
  });
};

export const formatMonthTitle = (monthKey: DateKey, locale: string): string => {
  const { year, month } = parseDateKey(monthKey);
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1, 12, 0, 0)));
};

export const formatDateKeyLabel = (key: DateKey, locale: string): string => {
  const { year, month, day } = parseDateKey(key);
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day, 12, 0, 0)));
};

export const toInstant = (value: string | Date): Date =>
  value instanceof Date ? value : new Date(value);

export const eventDateKeys = (event: CalendarEvent, timeZone?: string): DateKey[] => {
  const start = toDateKey(toInstant(event.startsAt), timeZone);
  const end = event.endsAt ? toDateKey(toInstant(event.endsAt), timeZone) : start;
  return eachDateKey(start, end);
};

export const eventsOnDate = (
  events: CalendarEvent[],
  key: DateKey,
  timeZone?: string,
): CalendarEvent[] => events.filter((event) => eventDateKeys(event, timeZone).includes(key));

export const upcomingEvents = (
  events: CalendarEvent[],
  fromKey: DateKey,
  timeZone?: string,
  limit = 8,
): CalendarEvent[] =>
  events
    .map((event) => ({ event, start: toDateKey(toInstant(event.startsAt), timeZone) }))
    .filter(({ start }) => compareDateKeys(start, fromKey) >= 0)
    .sort((a, b) => compareDateKeys(a.start, b.start) || a.event.title.localeCompare(b.event.title))
    .slice(0, limit)
    .map(({ event }) => event);

export const typeColor = (typeId: string | undefined, types: { id: string; color?: string }[]) =>
  types.find((type) => type.id === typeId)?.color ?? "var(--chart-1)";
