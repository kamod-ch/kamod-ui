import type { JSX } from "preact";
import { useId, useState } from "preact/hooks";
import { cn } from "../../lib/utils";
import { Field, FieldGroup, FieldLabel } from "../field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../input-group";
import { Calendar } from "./Calendar";
import type { CalendarProps } from "./Calendar";

const WEEKDAY_TWO_LETTER = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

const ClockGlyph = ({ class: className }: { class?: string }) => (
  <svg
    class={cn("size-3.5 shrink-0 opacity-70", className)}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

export type CalendarDateTimePanelProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> &
  Pick<
    CalendarProps,
    | "defaultMonth"
    | "month"
    | "onMonthChange"
    | "locale"
    | "disabled"
    | "dir"
    | "showOutsideDays"
    | "captionLayout"
    | "size"
  > & {
    /** Selected calendar day (controlled). */
    selected?: Date;
    /** Initial day when uncontrolled. */
    defaultSelected?: Date;
    onSelect?: (date: Date) => void;
    /** `HH:mm` or `HH:mm:ss` for native `input[type=time]`. */
    startTime?: string;
    defaultStartTime?: string;
    onStartTimeChange?: (value: string) => void;
    endTime?: string;
    defaultEndTime?: string;
    onEndTimeChange?: (value: string) => void;
    startTimeLabel?: string;
    endTimeLabel?: string;
    /** Use two-letter weekday headers (Su–Sa). @default true */
    compactWeekdays?: boolean;
    /** Decorative line left of the first weekday; off by default. */
    showWeekdayLeadBorder?: boolean;
  };

/**
 * Single-month calendar with start/end time fields, styled for a compact “schedule” card (date + time range).
 * Defaults to `size="sm"` on the inner {@link Calendar} for a dense layout; pass `size="default"` for roomier cells.
 */
export const CalendarDateTimePanel = ({
  class: className,
  selected,
  defaultSelected,
  onSelect,
  defaultMonth,
  month,
  onMonthChange,
  locale = "en-US",
  disabled,
  dir,
  showOutsideDays = true,
  captionLayout = "buttons",
  size = "sm",
  startTime: startTimeProp,
  defaultStartTime = "10:30:00",
  onStartTimeChange,
  endTime: endTimeProp,
  defaultEndTime = "12:30:00",
  onEndTimeChange,
  startTimeLabel = "Start Time",
  endTimeLabel = "End Time",
  compactWeekdays = true,
  showWeekdayLeadBorder = false,
  ...rest
}: CalendarDateTimePanelProps) => {
  const uid = useId();
  const startId = `kamod-cdtp-s-${uid}`;
  const endId = `kamod-cdtp-e-${uid}`;

  const [innerDate, setInnerDate] = useState<Date | undefined>(defaultSelected);
  const selectedDate = selected !== undefined ? selected : innerDate;

  const [innerStart, setInnerStart] = useState(defaultStartTime);
  const [innerEnd, setInnerEnd] = useState(defaultEndTime);
  const startVal = startTimeProp !== undefined ? startTimeProp : innerStart;
  const endVal = endTimeProp !== undefined ? endTimeProp : innerEnd;

  const setDate = (d: Date) => {
    if (selected === undefined) setInnerDate(d);
    onSelect?.(d);
  };

  const setStart = (v: string) => {
    if (startTimeProp === undefined) setInnerStart(v);
    onStartTimeChange?.(v);
  };

  const setEnd = (v: string) => {
    if (endTimeProp === undefined) setInnerEnd(v);
    onEndTimeChange?.(v);
  };

  const photoCalendarClass =
    "w-full min-w-0 max-w-full border-0 bg-transparent p-0 shadow-none " +
    "[&_[data-slot=calendar-day][data-outside=true]]:!text-neutral-400 dark:[&_[data-slot=calendar-day][data-outside=true]]:!text-neutral-500 " +
    "[&_[data-slot=calendar-day]]:!rounded-full [&_[data-slot=calendar-day]:not(:disabled):hover]:!bg-neutral-200/90 dark:[&_[data-slot=calendar-day]:not(:disabled):hover]:!bg-white/10 " +
    "[&_[data-slot=calendar-day].bg-primary]:!rounded-xl [&_[data-slot=calendar-day].bg-primary]:!bg-[#1a1a1a] [&_[data-slot=calendar-day].bg-primary]:hover:!bg-[#1a1a1a] [&_[data-slot=calendar-day].bg-primary]:!text-white " +
    "dark:[&_[data-slot=calendar-day].bg-primary]:!bg-primary dark:[&_[data-slot=calendar-day].bg-primary]:!text-primary-foreground dark:[&_[data-slot=calendar-day].bg-primary]:hover:!bg-primary/90 " +
    "[&_[data-slot=calendar-day].bg-accent]:!rounded-full";

  return (
    <div
      data-slot="calendar-datetime-panel"
      class={cn(
        "bg-background text-foreground w-full max-w-[min(100%,300px)] rounded-xl border border-[#e0e0e0] p-3.5 shadow-sm dark:border-border",
        className
      )}
      {...rest}
    >
      <Calendar
        mode="single"
        dir={dir}
        locale={locale}
        disabled={disabled}
        showOutsideDays={showOutsideDays}
        captionLayout={captionLayout}
        size={size}
        selected={selectedDate}
        defaultMonth={defaultMonth ?? selectedDate ?? new Date()}
        month={month}
        onMonthChange={onMonthChange}
        onSelect={(v) => {
          if (v instanceof Date) setDate(v);
        }}
        captionTitleClass="text-sm font-semibold tracking-tight"
        weekdayLabels={compactWeekdays ? [...WEEKDAY_TWO_LETTER] : undefined}
        showWeekdayLeadBorder={showWeekdayLeadBorder}
        class={photoCalendarClass}
      />
      <div class="mt-0.5 border-t border-[#e0e0e0] pt-3 dark:border-border">
        <FieldGroup class="gap-2.5">
          <Field>
            <FieldLabel class="text-foreground mb-1 text-xs font-semibold" htmlFor={startId}>
              {startTimeLabel}
            </FieldLabel>
            <InputGroup class="border-[#e0e0e0] dark:border-input h-9 min-h-9 rounded-full px-0.5 shadow-none">
              <InputGroupAddon class="ps-2.5">
                <ClockGlyph />
              </InputGroupAddon>
              <InputGroupInput
                id={startId}
                type="time"
                step={1}
                value={startVal}
                onInput={(e) => setStart((e.target as HTMLInputElement).value)}
                class="font-mono text-xs tabular-nums"
              />
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel class="text-foreground mb-1 text-xs font-semibold" htmlFor={endId}>
              {endTimeLabel}
            </FieldLabel>
            <InputGroup class="border-[#e0e0e0] dark:border-input h-9 min-h-9 rounded-full px-0.5 shadow-none">
              <InputGroupAddon class="ps-2.5">
                <ClockGlyph />
              </InputGroupAddon>
              <InputGroupInput
                id={endId}
                type="time"
                step={1}
                value={endVal}
                onInput={(e) => setEnd((e.target as HTMLInputElement).value)}
                class="font-mono text-xs tabular-nums"
              />
            </InputGroup>
          </Field>
        </FieldGroup>
      </div>
    </div>
  );
};
