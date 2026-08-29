import { addDaysToDateKey, addMonthsToDateKey, endOfWeekKey, startOfWeekKey } from "./date";
import type { DateKey, WeekStartsOn } from "./types";

export const moveFocusedDateKey = (
  current: DateKey,
  key: string,
  weekStartsOn: WeekStartsOn,
): DateKey | null => {
  switch (key) {
    case "ArrowLeft":
      return addDaysToDateKey(current, -1);
    case "ArrowRight":
      return addDaysToDateKey(current, 1);
    case "ArrowUp":
      return addDaysToDateKey(current, -7);
    case "ArrowDown":
      return addDaysToDateKey(current, 7);
    case "Home":
      return startOfWeekKey(current, weekStartsOn);
    case "End":
      return endOfWeekKey(current, weekStartsOn);
    case "PageUp":
      return addMonthsToDateKey(current, -1);
    case "PageDown":
      return addMonthsToDateKey(current, 1);
    default:
      return null;
  }
};

export const isSelectKey = (key: string): boolean => key === "Enter" || key === " ";
