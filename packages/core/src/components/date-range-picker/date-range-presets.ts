import type { DateRange } from "./date-range-utils";
import {
  addCalendarDays,
  atNoon,
  endOfCalendarMonth,
  startOfCalendarMonth,
} from "./date-range-utils";

export type DateRangePreset = {
  id: string;
  label: string;
  getRange: (referenceDate: Date) => DateRange;
};

export type DateRangePresetLabels = {
  today: string;
  last7Days: string;
  last30Days: string;
  monthToDate: string;
  previousMonth: string;
};

/** Demo-oriented preset factory — labels are supplied by the consumer (i18n). */
export const createDateRangePresets = (labels: DateRangePresetLabels): DateRangePreset[] => [
  {
    id: "today",
    label: labels.today,
    getRange: (referenceDate) => {
      const day = atNoon(referenceDate);
      return { from: day, to: day };
    },
  },
  {
    id: "last-7-days",
    label: labels.last7Days,
    getRange: (referenceDate) => {
      const end = atNoon(referenceDate);
      return { from: addCalendarDays(end, -6), to: end };
    },
  },
  {
    id: "last-30-days",
    label: labels.last30Days,
    getRange: (referenceDate) => {
      const end = atNoon(referenceDate);
      return { from: addCalendarDays(end, -29), to: end };
    },
  },
  {
    id: "month-to-date",
    label: labels.monthToDate,
    getRange: (referenceDate) => ({
      from: startOfCalendarMonth(referenceDate),
      to: atNoon(referenceDate),
    }),
  },
  {
    id: "previous-month",
    label: labels.previousMonth,
    getRange: (referenceDate) => {
      const ref = atNoon(referenceDate);
      const lastDayPrevMonth = new Date(ref.getFullYear(), ref.getMonth(), 0, 12, 0, 0);
      return {
        from: startOfCalendarMonth(lastDayPrevMonth),
        to: endOfCalendarMonth(lastDayPrevMonth),
      };
    },
  },
];
