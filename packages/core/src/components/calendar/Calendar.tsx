import { useMemo, useState } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { Button } from "../button/Button";

export type DateRange = { from?: Date; to?: Date };

export type CalendarMode = "single" | "range";

/** `sm`: denser padding, smaller day cells, lighter caption controls (dropdown + nav). */
export type CalendarSize = "default" | "sm";

export type CalendarDisabledProp = ((date: Date) => boolean) | Date[];

const atNoon = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const isBetweenInclusive = (d: Date, a: Date, b: Date) => {
  const t = atNoon(d).getTime();
  return t >= atNoon(a).getTime() && t <= atNoon(b).getTime();
};

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

const addMonths = (d: Date, delta: number) => new Date(d.getFullYear(), d.getMonth() + delta, 1);

/** ISO week number (Mon–Sun weeks, week 1 contains Jan 4). */
const isoWeekNumber = (d: Date) => {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);
  const day = (copy.getDay() + 6) % 7;
  copy.setDate(copy.getDate() - day + 3);
  const week1 = new Date(copy.getFullYear(), 0, 4);
  const w1d = (week1.getDay() + 6) % 7;
  week1.setDate(week1.getDate() - w1d + 3);
  return 1 + Math.round((copy.getTime() - week1.getTime()) / 604800000);
};

const formatWeekIndex = (n: number) => String(n).padStart(2, "0");

type CalendarCell = { date: Date; outside: boolean } | null;

const buildCalendarRows = (
  year: number,
  month: number,
  showOutsideDays: boolean,
  fixedWeeks: boolean
): CalendarCell[][] => {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startPad = first.getDay();

  const flat: CalendarCell[] = [];

  for (let i = 0; i < startPad; i += 1) {
    if (showOutsideDays) {
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const prevDays = new Date(prevYear, prevMonth + 1, 0).getDate();
      const day = prevDays - startPad + i + 1;
      flat.push({ date: new Date(prevYear, prevMonth, day), outside: true });
    } else {
      flat.push(null);
    }
  }

  for (let d = 1; d <= daysInMonth; d += 1) {
    flat.push({ date: new Date(year, month, d), outside: false });
  }

  const rem = flat.length % 7;
  if (rem !== 0) {
    const need = 7 - rem;
    for (let i = 0; i < need; i += 1) {
      if (showOutsideDays) {
        flat.push({ date: new Date(year, month + 1, i + 1), outside: true });
      } else {
        flat.push(null);
      }
    }
  }

  if (fixedWeeks) {
    while (flat.length < 42) {
      if (showOutsideDays) {
        const lastCell = flat[flat.length - 1];
        if (lastCell) {
          const next = new Date(lastCell.date);
          next.setDate(next.getDate() + 1);
          flat.push({ date: next, outside: true });
        } else {
          flat.push(null);
        }
      } else {
        flat.push(null);
      }
    }
  }

  const rows: CalendarCell[][] = [];
  for (let i = 0; i < flat.length; i += 7) {
    rows.push(flat.slice(i, i + 7));
  }
  return rows;
};

const ChevronLeft = ({ class: className }: { class?: string }) => (
  <svg
    class={cn("size-4 shrink-0", className)}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    aria-hidden="true"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRight = ({ class: className }: { class?: string }) => (
  <svg
    class={cn("size-4 shrink-0", className)}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    aria-hidden="true"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export type CalendarProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> & {
  mode?: CalendarMode;
  selected?: Date | DateRange;
  onSelect?: (value: Date | DateRange | undefined) => void;
  /** @deprecated Use `selected` in single mode. */
  value?: Date;
  /** @deprecated Use `onSelect` in single mode. */
  onValueChange?: (next: Date) => void;
  defaultMonth?: Date;
  month?: Date;
  onMonthChange?: (next: Date) => void;
  numberOfMonths?: 1 | 2;
  captionLayout?: "buttons" | "dropdown";
  dir?: "ltr" | "rtl";
  /** Show days from adjacent months. @default true */
  showOutsideDays?: boolean;
  /** Pad to six week rows. @default false */
  fixedWeeks?: boolean;
  disabled?: CalendarDisabledProp;
  /** Extra week-index column (ISO week of row start). @default false */
  showWeekNumber?: boolean;
  /** Named date sets for styling via `modifiersClassNames`. */
  modifiers?: Record<string, Date[]>;
  /** Tailwind / arbitrary classes keyed like `modifiers` (e.g. booked). */
  modifiersClassNames?: Record<string, string>;
  /** BCP 47 locale for captions and weekday labels. */
  locale?: string;
  /** Passed to `Intl` where supported; selection still uses local `Date` (use noon-normalized dates to avoid TZ drift). */
  timeZone?: string;
  /** Extra label under the day number (e.g. prices). Omit or return `undefined` for outside days if desired. */
  dayAddon?: (date: Date, outside: boolean) => ComponentChildren | undefined;
  /** Extra classes for the visible month/year caption text (single-month buttons layout and dual-month titles). */
  captionTitleClass?: string;
  /** If set (length 7, Sunday-first), overrides locale-derived weekday headers. */
  weekdayLabels?: string[];
  /** Decorative left border on the first weekday column (e.g. Su). @default false */
  showWeekdayLeadBorder?: boolean;
  /** Visual density; `sm` fits popovers and tight layouts. @default "default" */
  size?: CalendarSize;
};

type MonthCaptionProps = {
  displayMonth: Date;
  captionLayout: "buttons" | "dropdown";
  dir: "ltr" | "rtl";
  locale?: string;
  timeZone?: string;
  captionTitleClass?: string;
  size: CalendarSize;
  onPrev: () => void;
  onNext: () => void;
  onPickMonthYear: (year: number, monthIndex: number) => void;
};

const intlOpts = (locale?: string, timeZone?: string) =>
  timeZone ? ({ locale, timeZone } as const) : locale ? ({ locale } as const) : undefined;

const MonthCaption = ({
  displayMonth,
  captionLayout,
  dir,
  locale,
  timeZone,
  captionTitleClass,
  size,
  onPrev,
  onNext,
  onPickMonthYear
}: MonthCaptionProps) => {
  const sm = size === "sm";
  const y = displayMonth.getFullYear();
  const m = displayMonth.getMonth();
  const yearStart = y - 100;
  const yearEnd = y + 20;
  const years = useMemo(() => {
    const list: number[] = [];
    for (let yy = yearStart; yy <= yearEnd; yy += 1) list.push(yy);
    return list;
  }, [yearStart, yearEnd]);

  const fmt = intlOpts(locale, timeZone);

  if (captionLayout === "dropdown") {
    /** Month/year selects centered, prev/next ghost icons — matches shadcn “Month and Year Selector” chrome. */
    /** Avoid `min-w-0` on selects: in a flex row it lets them shrink and clip month labels (e.g. de-DE “Mär”). */
    const selectBaseClass = sm
      ? "border-input bg-background text-foreground focus-visible:ring-ring/50 box-border h-7 min-h-7 shrink-0 rounded-md border px-2 pe-7 text-xs leading-4 shadow-xs outline-none focus-visible:ring-2"
      : "border-input bg-background text-foreground focus-visible:ring-ring/50 box-border h-8 min-h-8 shrink-0 rounded-md border px-2.5 pe-8 text-xs leading-4 shadow-xs outline-none focus-visible:ring-2";
    const monthSelectClass = cn(selectBaseClass, sm ? "min-w-[5rem] max-w-full" : "min-w-[5.25rem] max-w-full");
    const yearSelectClass = cn(selectBaseClass, sm ? "min-w-[3.75rem] max-w-full" : "min-w-[4.25rem] max-w-full");
    return (
      <div class={cn("flex w-full items-center justify-between", sm ? "mb-1 gap-0.5" : "mb-1.5 gap-1")} dir={dir}>
        <Button
          type="button"
          variant="ghost"
          size={sm ? "icon-xs" : "icon-sm"}
          aria-label="Previous month"
          onClick={onPrev}
        >
          <ChevronLeft class={dir === "rtl" ? "rotate-180" : undefined} />
        </Button>
        <div
          class={cn(
            "text-foreground flex min-w-0 flex-1 items-center justify-center font-medium",
            sm ? "gap-1 text-xs" : "gap-1.5 text-xs",
            captionTitleClass
          )}
        >
          <select
            class={monthSelectClass}
            value={String(m)}
            aria-label="Month"
            onChange={(e) => {
              const nextM = Number((e.target as HTMLSelectElement).value);
              onPickMonthYear(y, nextM);
            }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={String(i)}>
                {new Date(y, i, 1).toLocaleString(fmt?.locale ?? undefined, {
                  month: "short",
                  ...(fmt && "timeZone" in fmt && fmt.timeZone ? { timeZone: fmt.timeZone } : {})
                })}
              </option>
            ))}
          </select>
          <select
            class={yearSelectClass}
            value={String(y)}
            aria-label="Year"
            onChange={(e) => {
              const nextY = Number((e.target as HTMLSelectElement).value);
              onPickMonthYear(nextY, m);
            }}
          >
            {years.map((yy) => (
              <option key={yy} value={String(yy)}>
                {yy}
              </option>
            ))}
          </select>
        </div>
        <Button
          type="button"
          variant="ghost"
          size={sm ? "icon-xs" : "icon-sm"}
          aria-label="Next month"
          onClick={onNext}
        >
          <ChevronRight class={dir === "rtl" ? "rotate-180" : undefined} />
        </Button>
      </div>
    );
  }

  return (
    <div class={cn("flex items-center justify-between", sm ? "mb-1 gap-1" : "mb-1.5 gap-1.5")} dir={dir}>
      <Button type="button" variant="ghost" size={sm ? "icon-xs" : "icon-sm"} aria-label="Previous month" onClick={onPrev}>
        <ChevronLeft class={dir === "rtl" ? "rotate-180" : undefined} />
      </Button>
      <div class={cn(sm ? "text-xs font-medium" : "text-sm font-medium", captionTitleClass)}>
        {displayMonth.toLocaleString(fmt?.locale ?? undefined, {
          month: "long",
          year: "numeric",
          ...(fmt && "timeZone" in fmt && fmt.timeZone ? { timeZone: fmt.timeZone } : {})
        })}
      </div>
      <Button type="button" variant="ghost" size={sm ? "icon-xs" : "icon-sm"} aria-label="Next month" onClick={onNext}>
        <ChevronRight class={dir === "rtl" ? "rotate-180" : undefined} />
      </Button>
    </div>
  );
};

type DualMonthCaptionProps = {
  firstMonth: Date;
  secondMonth: Date;
  dir: "ltr" | "rtl";
  locale?: string;
  timeZone?: string;
  captionTitleClass?: string;
  size: CalendarSize;
  onPrev: () => void;
  onNext: () => void;
};

const DualMonthCaption = ({
  firstMonth,
  secondMonth,
  dir,
  locale,
  timeZone,
  captionTitleClass,
  size,
  onPrev,
  onNext
}: DualMonthCaptionProps) => {
  const fmt = intlOpts(locale, timeZone);
  const sm = size === "sm";
  return (
    <div class={cn("flex items-center justify-between", sm ? "mb-1 gap-1" : "mb-1.5 gap-1.5")} dir={dir}>
      <Button
        type="button"
        variant="ghost"
        size={sm ? "icon-xs" : "icon-sm"}
        class="shrink-0"
        aria-label="Previous month"
        onClick={onPrev}
      >
        <ChevronLeft class={dir === "rtl" ? "rotate-180" : undefined} />
      </Button>
      <div
        class={cn(
          "flex min-w-0 flex-1 justify-center text-center font-medium",
          sm ? "gap-2 text-xs sm:gap-4" : "gap-4 text-sm sm:gap-6"
        )}
      >
        <span class={cn("truncate", captionTitleClass)}>
          {firstMonth.toLocaleString(fmt?.locale ?? undefined, {
            month: "long",
            year: "numeric",
            ...(fmt && "timeZone" in fmt && fmt.timeZone ? { timeZone: fmt.timeZone } : {})
          })}
        </span>
        <span class={cn("truncate", captionTitleClass)}>
          {secondMonth.toLocaleString(fmt?.locale ?? undefined, {
            month: "long",
            year: "numeric",
            ...(fmt && "timeZone" in fmt && fmt.timeZone ? { timeZone: fmt.timeZone } : {})
          })}
        </span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size={sm ? "icon-xs" : "icon-sm"}
        class="shrink-0"
        aria-label="Next month"
        onClick={onNext}
      >
        <ChevronRight class={dir === "rtl" ? "rotate-180" : undefined} />
      </Button>
    </div>
  );
};

type MonthGridProps = {
  year: number;
  month: number;
  mode: CalendarMode;
  singleSelected?: Date;
  range?: DateRange;
  locale?: string;
  weekdayLabels?: string[];
  showWeekdayLeadBorder?: boolean;
  showOutsideDays: boolean;
  fixedWeeks: boolean;
  showWeekNumber: boolean;
  isDisabled: (d: Date) => boolean;
  modifierClassesFor: (d: Date) => string;
  dayAddon?: (date: Date, outside: boolean) => ComponentChildren | undefined;
  hasDayAddon: boolean;
  size: CalendarSize;
  onDayClick: (d: Date, outside: boolean) => void;
};

const MonthGrid = ({
  year,
  month,
  mode,
  singleSelected,
  range,
  locale,
  weekdayLabels: weekdayLabelsProp,
  showWeekdayLeadBorder,
  showOutsideDays,
  fixedWeeks,
  showWeekNumber,
  isDisabled,
  modifierClassesFor,
  dayAddon,
  hasDayAddon,
  size,
  onDayClick
}: MonthGridProps) => {
  const sm = size === "sm";
  const gridGap = sm ? "gap-0.5" : "gap-1";
  const rows = useMemo(
    () => buildCalendarRows(year, month, showOutsideDays, fixedWeeks),
    [year, month, showOutsideDays, fixedWeeks]
  );

  const today = useMemo(() => atNoon(new Date()), []);

  /** Jan 7 2024 = Sunday; columns Su–Sa. */
  const weekdayLabels = useMemo(() => {
    if (weekdayLabelsProp?.length === 7) return weekdayLabelsProp;
    return Array.from({ length: 7 }, (_, i) =>
      new Date(2024, 0, 7 + i).toLocaleDateString(locale, { weekday: "short" })
    );
  }, [locale, weekdayLabelsProp]);

  const dayClass = (d: Date, outside: boolean) => {
    let cls = cn(
      "inline-flex size-[length:var(--cell-size,2rem)] min-h-[length:var(--cell-size,2rem)] min-w-[length:var(--cell-size,2rem)] items-center justify-center rounded-md leading-none font-normal transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 dark:hover:text-accent-foreground",
      sm ? "text-xs" : "text-sm",
      hasDayAddon && "flex-col gap-0.5"
    );

    if (outside) {
      cls += " text-muted-foreground";
    }

    const isToday = isSameDay(d, today);
    const singleSel = mode === "single" && singleSelected && isSameDay(d, singleSelected);
    const from = range?.from;
    const to = range?.to;
    const rangeFromOnly = mode === "range" && from && !to && isSameDay(d, from);
    const inFullRange =
      mode === "range" && from && to && isBetweenInclusive(d, from, to);

    if (singleSel || rangeFromOnly) {
      cls += " bg-primary text-primary-foreground hover:bg-primary/90";
    } else if (inFullRange && from && to) {
      if (isSameDay(from, to)) {
        cls += " bg-primary text-primary-foreground hover:bg-primary/90 rounded-md";
      } else if (isSameDay(d, from)) {
        cls += " bg-primary text-primary-foreground hover:bg-primary/90 rounded-s-md rounded-e-none";
      } else if (isSameDay(d, to)) {
        cls += " bg-primary text-primary-foreground hover:bg-primary/90 rounded-e-md rounded-s-none";
      } else {
        cls += " bg-accent text-accent-foreground hover:bg-accent/80 rounded-none";
      }
    } else if (isToday) {
      cls += " bg-accent text-accent-foreground";
    } else {
      cls += " hover:bg-accent hover:text-accent-foreground";
    }

    return cls;
  };

  return (
    <div class="min-w-0 flex-1">
      <div
        class={cn(
          "grid text-center text-muted-foreground",
          gridGap,
          sm ? "text-[0.65rem] leading-none" : "text-xs",
          showWeekNumber ? "grid-cols-8" : "grid-cols-7"
        )}
      >
        {showWeekNumber ? <div class="flex size-[length:var(--cell-size,2rem)] items-center justify-center font-normal" /> : null}
        {weekdayLabels.map((day, wi) => (
          <div
            key={`w-${wi}`}
            class={cn(
              "flex size-[length:var(--cell-size,2rem)] items-center justify-center font-normal",
              showWeekdayLeadBorder && wi === 0 && "relative ms-0.5 border-s border-border ps-2"
            )}
          >
            {day}
          </div>
        ))}
      </div>
      <div class={cn("flex flex-col", gridGap, sm ? "mt-1" : "mt-1.5")}>
        {rows.map((row, ri) => (
          <div
            key={ri}
            class={cn("grid", gridGap, showWeekNumber ? "grid-cols-8" : "grid-cols-7")}
          >
            {showWeekNumber ? (
              <div
                class="text-muted-foreground flex size-[length:var(--cell-size,2rem)] items-center justify-center text-[0.8rem] select-none"
                aria-hidden="true"
              >
                {(() => {
                  const first = row.find((c): c is { date: Date; outside: boolean } => c !== null);
                  return first ? formatWeekIndex(isoWeekNumber(first.date)) : "";
                })()}
              </div>
            ) : null}
            {row.map((cell, ci) =>
              cell ? (
                <button
                  key={`${cell.date.getTime()}-${ci}`}
                  type="button"
                  data-slot="calendar-day"
                  data-outside={cell.outside ? "true" : undefined}
                  data-today={isSameDay(cell.date, today) ? "true" : undefined}
                  disabled={isDisabled(cell.date)}
                  class={cn(dayClass(cell.date, cell.outside), modifierClassesFor(cell.date))}
                  onClick={() => onDayClick(cell.date, cell.outside)}
                >
                  <span>{cell.date.getDate()}</span>
                  {(() => {
                    if (!dayAddon) return null;
                    const extra = dayAddon(cell.date, cell.outside);
                    if (extra == null || extra === false) return null;
                    return (
                      <span class="text-muted-foreground text-xs leading-none opacity-70">{extra}</span>
                    );
                  })()}
                </button>
              ) : (
                <div key={`empty-${ri}-${ci}`} class="size-[length:var(--cell-size,2rem)]" aria-hidden="true" />
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const Calendar = ({
  class: className,
  mode = "single",
  selected,
  onSelect,
  value,
  onValueChange,
  defaultMonth,
  month: monthProp,
  onMonthChange,
  numberOfMonths = 1,
  captionLayout = "buttons",
  dir = "ltr",
  showOutsideDays = true,
  fixedWeeks = false,
  disabled,
  showWeekNumber = false,
  modifiers,
  modifiersClassNames,
  locale,
  timeZone,
  dayAddon,
  captionTitleClass,
  weekdayLabels,
  showWeekdayLeadBorder,
  size = "default",
  ...rest
}: CalendarProps) => {
  const calSize: CalendarSize = size;
  const singleSelected =
    mode === "single" ? ((selected as Date | undefined) ?? value) : undefined;
  const rangeSelected = mode === "range" ? (selected as DateRange | undefined) : undefined;

  const initialMonth = useMemo(() => {
    const fromSel = singleSelected ?? rangeSelected?.from;
    return startOfMonth(defaultMonth ?? fromSel ?? new Date());
  }, []);

  const [innerMonth, setInnerMonth] = useState<Date>(initialMonth);

  const displayMonth = monthProp !== undefined ? startOfMonth(monthProp) : innerMonth;

  const setMonth = (next: Date) => {
    const s = startOfMonth(next);
    onMonthChange?.(s);
    if (monthProp === undefined) {
      setInnerMonth(s);
    }
  };

  const shiftMonth = (delta: number) => {
    setMonth(addMonths(displayMonth, delta));
  };

  const isDisabled = (d: Date) => {
    if (!disabled) return false;
    if (Array.isArray(disabled)) {
      return disabled.some((x) => isSameDay(atNoon(x), atNoon(d)));
    }
    return disabled(d);
  };

  const modifierClassesFor = (d: Date) => {
    if (!modifiers || !modifiersClassNames) return "";
    const parts: string[] = [];
    for (const [name, dates] of Object.entries(modifiers)) {
      if (!dates?.length) continue;
      if (dates.some((x) => isSameDay(atNoon(x), atNoon(d)))) {
        const cnVal = modifiersClassNames[name];
        if (cnVal) parts.push(cnVal);
      }
    }
    return parts.join(" ");
  };

  const handleDayClick = (d: Date, outside: boolean) => {
    if (outside) {
      setMonth(startOfMonth(d));
    }
    if (mode === "single") {
      onSelect?.(d);
      onValueChange?.(d);
      return;
    }
    const cur = rangeSelected;
    if (!cur?.from || (cur.from && cur.to)) {
      onSelect?.({ from: d, to: undefined });
    } else {
      let from = cur.from;
      let to = d;
      if (atNoon(to) < atNoon(from)) {
        const tmp = from;
        from = to;
        to = tmp;
      }
      onSelect?.({ from, to });
    }
  };

  const monthsToRender = numberOfMonths === 2 ? ([0, 1] as const) : ([0] as const);
  const effectiveCaption: "buttons" | "dropdown" = numberOfMonths === 2 ? "buttons" : captionLayout;

  const secondVisible = addMonths(displayMonth, 1);

  return (
    <div
      data-slot="calendar"
      data-calendar-size={calSize}
      dir={dir}
      class={cn(
        "bg-background group/calendar relative w-fit rounded-md border [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        calSize === "sm"
          ? "min-w-[15rem] p-2 [--cell-size:1.5625rem]"
          : "min-w-[16.75rem] p-2.5 [--cell-size:1.75rem]",
        numberOfMonths === 2 && "max-w-full",
        className
      )}
      {...rest}
    >
      {numberOfMonths === 2 ? (
        <DualMonthCaption
          firstMonth={displayMonth}
          secondMonth={secondVisible}
          dir={dir}
          locale={locale}
          timeZone={timeZone}
          captionTitleClass={captionTitleClass}
          size={calSize}
          onPrev={() => shiftMonth(-1)}
          onNext={() => shiftMonth(1)}
        />
      ) : (
        <MonthCaption
          displayMonth={displayMonth}
          captionLayout={effectiveCaption}
          dir={dir}
          locale={locale}
          timeZone={timeZone}
          captionTitleClass={captionTitleClass}
          size={calSize}
          onPrev={() => shiftMonth(-1)}
          onNext={() => shiftMonth(1)}
          onPickMonthYear={(yy, monthIndex) => {
            setMonth(new Date(yy, monthIndex, 1));
          }}
        />
      )}
      <div
        class={cn(
          "relative flex flex-col",
          calSize === "sm" ? "gap-2.5" : "gap-3",
          numberOfMonths === 2 && "md:flex-row md:items-start md:justify-between",
          numberOfMonths === 2 && (calSize === "sm" ? "md:gap-4" : "md:gap-6")
        )}
      >
        {monthsToRender.map((offset) => {
          const ym = addMonths(displayMonth, offset);
          const y = ym.getFullYear();
          const m = ym.getMonth();
          return (
            <MonthGrid
              key={`${y}-${m}`}
              year={y}
              month={m}
              mode={mode}
              singleSelected={singleSelected}
              range={rangeSelected}
              locale={locale}
              weekdayLabels={weekdayLabels}
              showWeekdayLeadBorder={showWeekdayLeadBorder}
              showOutsideDays={showOutsideDays}
              fixedWeeks={fixedWeeks}
              showWeekNumber={showWeekNumber}
              isDisabled={isDisabled}
              modifierClassesFor={modifierClassesFor}
              dayAddon={dayAddon}
              hasDayAddon={Boolean(dayAddon)}
              size={calSize}
              onDayClick={handleDayClick}
            />
          );
        })}
      </div>
    </div>
  );
};
