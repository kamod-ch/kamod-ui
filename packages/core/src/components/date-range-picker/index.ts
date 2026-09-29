import { DateRangePicker, formatDateRangeDisplay } from "./DateRangePicker";

export type {
  DateRangePickerLabels,
  DateRangePickerProps,
  DateRangeValidationMessages,
} from "./DateRangePicker";
export type { DateRangePreset, DateRangePresetLabels } from "./date-range-presets";
export { createDateRangePresets } from "./date-range-presets";
export type { DateRange, RangeValidation, RangeValidationReason } from "./date-range-utils";
export {
  addCalendarDays,
  atNoon,
  buildDisabledChecker,
  cloneRange,
  compareCalendarDays,
  eachCalendarDayInclusive,
  endOfCalendarMonth,
  isCompleteRange,
  isSameCalendarDay,
  normalizeRange,
  rangeContainsDisabledDay,
  startOfCalendarMonth,
  validateRangeDraft,
} from "./date-range-utils";
export { DateRangePicker, formatDateRangeDisplay };

export default DateRangePicker;
