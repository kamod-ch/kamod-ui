import { maxDateKey, minDateKey } from "./date";
import type { CalendarDateRange, DateKey } from "./types";

const normalizeRange = (start: DateKey, end: DateKey): CalendarDateRange => ({
  start: minDateKey(start, end),
  end: maxDateKey(start, end),
});

export const applyDateSelection = (
  target: DateKey,
  shift: boolean,
  anchor: DateKey | null,
): { range: CalendarDateRange; anchor: DateKey } => {
  if (!shift || !anchor) {
    return { range: { start: target, end: target }, anchor: target };
  }
  return { range: normalizeRange(anchor, target), anchor };
};
