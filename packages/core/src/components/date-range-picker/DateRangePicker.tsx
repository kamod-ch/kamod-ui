import type { ComponentChildren, JSX } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import { cn } from "../../lib/utils";
import { Button } from "../button/Button";
import type { CalendarDisabledProp } from "../calendar/Calendar";
import { Calendar } from "../calendar/Calendar";
import { Popover } from "../popover/Popover";
import { PopoverContent } from "../popover/PopoverContent";
import { PopoverTrigger } from "../popover/PopoverTrigger";
import type { DateRangePreset } from "./date-range-presets";
import type { DateRange } from "./date-range-utils";
import {
  buildDisabledChecker,
  cloneRange,
  formatDateRangeDisplay,
  isSameRange,
  startOfCalendarMonth,
  validateRangeDraft,
} from "./date-range-utils";

export type { DateRange, DateRangePreset };
export { formatDateRangeDisplay };

export type DateRangeValidationMessages = {
  incomplete?: string;
  invalid?: string;
  disabledInRange?: string;
};

export type DateRangePickerLabels = {
  apply: string;
  cancel: string;
};

const CalendarGlyph = ({ class: className }: { class?: string }) => (
  <svg
    class={cn("size-4 shrink-0 opacity-60", className)}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const ChevronDownGlyph = ({ class: className }: { class?: string }) => (
  <svg
    class={cn("size-4 shrink-0 opacity-60", className)}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export type DateRangePickerProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> & {
  /**
   * Controlled range. Do not pass `defaultValue` at the same time — behaviour is undefined
   * (React-style: controlled wins; internal state from `defaultValue` is ignored while `value` is set).
   */
  value?: DateRange;
  /** Uncontrolled initial range. Ignored when `value` is provided. */
  defaultValue?: DateRange;
  onValueChange?: (next: DateRange | undefined) => void;
  /** Shown when no range is confirmed. No default — supply for i18n. */
  placeholder?: string;
  align?: "start" | "center" | "end";
  triggerIcon?: "chevron" | "calendar" | "none";
  format?: (range: DateRange | undefined) => string;
  locale?: string;
  dir?: "ltr" | "rtl";
  /** Disables the trigger button. Calendar day rules use `disabled`, `minDate`, and `maxDate`. */
  disabled?: boolean;
  /** Calendar disabled-day rules (function or explicit dates). Combined with min/max. */
  disabledDates?: CalendarDisabledProp;
  minDate?: Date;
  maxDate?: Date;
  /** Preset definitions; labels live on each preset. Requires `referenceDate` to apply. */
  presets?: DateRangePreset[];
  /** Accessible name for the preset button group (i18n). */
  presetsGroupLabel?: string;
  /** Anchor for preset ranges — pass explicitly (e.g. client `useEffect`) to keep SSR deterministic. */
  referenceDate?: Date;
  labels: DateRangePickerLabels;
  validationMessages?: DateRangeValidationMessages;
  /** Fixed month count. Ignored when `responsiveMonths` is true. @default 1 */
  numberOfMonths?: 1 | 2;
  /** One month on narrow viewports, two from `md` up. SSR renders one month. @default true */
  responsiveMonths?: boolean;
  size?: "default" | "sm";
  children?: ComponentChildren;
};

export const DateRangePicker = ({
  class: className,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  align = "start",
  triggerIcon = "chevron",
  format,
  locale,
  dir,
  disabled = false,
  disabledDates,
  minDate,
  maxDate,
  presets,
  presetsGroupLabel,
  referenceDate,
  labels,
  validationMessages,
  numberOfMonths = 1,
  responsiveMonths = true,
  size = "default",
  children,
  ...rest
}: DateRangePickerProps) => {
  const [localValue, setLocalValue] = useState<DateRange | undefined>(defaultValue);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | undefined>(() => cloneRange(defaultValue));
  const [calendarMonth, setCalendarMonth] = useState<Date>(() =>
    startOfCalendarMonth(defaultValue?.from ?? new Date()),
  );
  const [visibleMonths, setVisibleMonths] = useState<1 | 2>(1);

  const isControlled = value !== undefined;
  const confirmed = isControlled ? value : localValue;

  const isDayDisabled = useMemo(
    () => buildDisabledChecker(disabledDates, minDate, maxDate),
    [disabledDates, minDate, maxDate],
  );

  const validation = useMemo(
    () => validateRangeDraft(draft, isDayDisabled),
    [draft, isDayDisabled],
  );

  const validationMessage =
    validation.ok === false
      ? validation.reason === "incomplete"
        ? validationMessages?.incomplete
        : validation.reason === "invalid"
          ? validationMessages?.invalid
          : validationMessages?.disabledInRange
      : undefined;

  useEffect(() => {
    if (!responsiveMonths) {
      setVisibleMonths(numberOfMonths);
      return;
    }
    if (typeof window.matchMedia !== "function") {
      setVisibleMonths(1);
      return;
    }
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setVisibleMonths(mq.matches ? 2 : 1);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [responsiveMonths, numberOfMonths]);

  useEffect(() => {
    if (open && isControlled) {
      setDraft(cloneRange(value));
    }
  }, [value, open, isControlled]);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      const nextDraft = cloneRange(confirmed);
      setDraft(nextDraft);
      setCalendarMonth(startOfCalendarMonth(nextDraft?.from ?? confirmed?.from ?? new Date()));
    }
    setOpen(next);
  };

  const handleApply = () => {
    if (!validation.ok) return;
    const next = validation.range;
    if (!isControlled) {
      setLocalValue({ from: next.from, to: next.to });
    }
    onValueChange?.({ from: next.from, to: next.to });
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handlePreset = (preset: DateRangePreset) => {
    if (!referenceDate) return;
    const next = cloneRange(preset.getRange(referenceDate));
    setDraft(next);
    if (next?.from) {
      setCalendarMonth(startOfCalendarMonth(next.from));
    }
  };

  const activePresetId = useMemo(() => {
    if (!draft?.from || !draft?.to || !referenceDate || !presets?.length) return undefined;
    return presets.find((preset) => isSameRange(draft, preset.getRange(referenceDate)))?.id;
  }, [draft, presets, referenceDate]);

  const iconEl =
    triggerIcon === "calendar" ? (
      <CalendarGlyph />
    ) : triggerIcon === "chevron" ? (
      <ChevronDownGlyph />
    ) : null;

  const displayFormat = useMemo(
    () => format ?? ((range: DateRange | undefined) => formatDateRangeDisplay(range, locale)),
    [format, locale],
  );

  const displayText = confirmed?.from ? displayFormat(confirmed) : placeholder ? placeholder : "";

  return (
    <div data-slot="date-range-picker" class={cn("inline-flex", className)} {...rest}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          {children ?? (
            <Button
              variant="outline"
              disabled={disabled}
              data-empty={confirmed?.from ? undefined : "true"}
              class={cn(
                "data-[empty=true]:text-muted-foreground w-[min(100%,320px)] text-start font-normal",
                triggerIcon === "chevron" && "justify-between",
                (triggerIcon === "calendar" || triggerIcon === "none") && "justify-start gap-2",
              )}
            >
              {triggerIcon === "calendar" ? iconEl : null}
              <span class="min-w-0 flex-1 truncate">{displayText}</span>
              {triggerIcon === "chevron" ? iconEl : null}
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent
          class={cn(
            "max-w-[calc(100vw-1.5rem)] gap-0 overflow-hidden p-0",
            visibleMonths === 2
              ? "w-[min(100vw-1.5rem,36rem)]"
              : "w-max min-w-[min(100vw-1.5rem,19rem)]",
          )}
          align={align}
          sideOffset={4}
          dir={dir}
        >
          {presets?.length && referenceDate ? (
            <div
              data-slot="date-range-picker-presets"
              class="flex flex-wrap gap-1.5 border-b p-3"
              role={presetsGroupLabel ? "group" : undefined}
              aria-label={presetsGroupLabel}
            >
              {presets.map((preset) => (
                <Button
                  key={preset.id}
                  type="button"
                  size="sm"
                  variant={activePresetId === preset.id ? "default" : "outline"}
                  aria-pressed={activePresetId === preset.id ? true : undefined}
                  data-selected={activePresetId === preset.id ? "true" : undefined}
                  onClick={() => handlePreset(preset)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          ) : null}
          <Calendar
            mode="range"
            size={size}
            locale={locale}
            dir={dir}
            numberOfMonths={visibleMonths}
            selected={draft}
            month={calendarMonth}
            onMonthChange={setCalendarMonth}
            disabled={isDayDisabled}
            onSelect={(next) => {
              if (!next || next instanceof Date) return;
              setDraft(cloneRange(next));
            }}
          />
          <div
            data-slot="date-range-picker-footer"
            class="flex flex-col gap-2 border-t p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <p
              class="text-muted-foreground min-h-[1.25rem] text-xs"
              aria-live="polite"
              data-validation={validation.ok ? undefined : validation.reason}
            >
              {validationMessage ?? ""}
            </p>
            <div class="flex justify-end gap-2">
              <Button type="button" size="sm" variant="outline" onClick={handleCancel}>
                {labels.cancel}
              </Button>
              <Button type="button" size="sm" disabled={!validation.ok} onClick={handleApply}>
                {labels.apply}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
