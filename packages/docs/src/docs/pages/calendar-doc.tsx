import type { DateRange } from "@kamod-ch/ui";
import {
  Button,
  Calendar,
  CalendarDateTimePanel,
  Card,
  CardContent,
  CardFooter,
  DirectionProvider,
} from "@kamod-ch/ui";
import { useEffect, useState } from "preact/hooks";
import { createGenericDocPage } from "./create-generic-doc-page";

const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

/** Top-of-page demo — matches https://ui.shadcn.com/docs/components/radix/calendar hero. */
const CalendarDemoPreview = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={(d) => setDate(d as Date)}
      class="rounded-lg border"
      captionLayout="dropdown"
    />
  );
};

/** Basic — uncontrolled current month, no local state. */
const BasicCalendarPreview = () => <Calendar mode="single" class="rounded-lg border" />;

const RangeCalendarPreview = () => {
  const y = new Date().getFullYear();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(y, 0, 12),
    to: addDays(new Date(y, 0, 12), 30),
  });
  return (
    <Card class="mx-auto w-fit p-0">
      <CardContent class="p-0">
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={(r) => setDateRange(r as DateRange)}
          numberOfMonths={2}
          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
          class="rounded-lg border-0"
        />
      </CardContent>
    </Card>
  );
};

const MonthYearSelectorPreview = () => (
  <Calendar mode="single" captionLayout="dropdown" class="rounded-lg border" />
);

const PresetsPreview = () => {
  const [date, setDate] = useState<Date | undefined>(new Date(new Date().getFullYear(), 1, 12));
  const [currentMonth, setCurrentMonth] = useState<Date>(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  return (
    <Card class="mx-auto w-fit max-w-[300px]" size="sm">
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => setDate(d as Date)}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          fixedWeeks
          class="border-0 p-0 shadow-none [--cell-size:2.375rem]"
        />
      </CardContent>
      <CardFooter class="flex flex-wrap gap-2 border-t">
        {[
          { label: "Today", value: 0 },
          { label: "Tomorrow", value: 1 },
          { label: "In 3 days", value: 3 },
          { label: "In a week", value: 7 },
          { label: "In 2 weeks", value: 14 },
        ].map((preset) => (
          <Button
            key={preset.value}
            variant="outline"
            size="sm"
            class="flex-1"
            onClick={() => {
              const newDate = addDays(new Date(), preset.value);
              setDate(newDate);
              setCurrentMonth(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
            }}
          >
            {preset.label}
          </Button>
        ))}
      </CardFooter>
    </Card>
  );
};

const DateTimePickerPreview = () => {
  const [date, setDate] = useState<Date | undefined>(() => new Date(2026, 3, 12));
  const [start, setStart] = useState("10:30:00");
  const [end, setEnd] = useState("12:30:00");
  return (
    <CalendarDateTimePanel
      class="mx-auto"
      selected={date}
      onSelect={setDate}
      defaultMonth={new Date(2026, 3, 1)}
      startTime={start}
      endTime={end}
      onStartTimeChange={setStart}
      onEndTimeChange={setEnd}
    />
  );
};

const BookedDatesPreview = () => {
  const y = new Date().getFullYear();
  const [date, setDate] = useState<Date | undefined>(new Date(y, 1, 3));
  const bookedDates = Array.from({ length: 15 }, (_, i) => new Date(y, 1, 12 + i));
  return (
    <Card class="mx-auto w-fit p-0">
      <CardContent class="p-0">
        <Calendar
          mode="single"
          defaultMonth={date}
          selected={date}
          onSelect={(d) => setDate(d as Date)}
          disabled={bookedDates}
          modifiers={{ booked: bookedDates }}
          modifiersClassNames={{ booked: "line-through opacity-100" }}
          class="rounded-lg border-0"
        />
      </CardContent>
    </Card>
  );
};

const CustomCellSizePreview = () => {
  const y = new Date().getFullYear();
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(y, 11, 8),
    to: addDays(new Date(y, 11, 8), 10),
  });
  return (
    <Card class="mx-auto w-fit p-0">
      <CardContent class="p-0">
        <Calendar
          mode="range"
          defaultMonth={range?.from}
          selected={range}
          onSelect={(r) => setRange(r as DateRange)}
          numberOfMonths={1}
          captionLayout="dropdown"
          class="[--cell-size:2.5rem] md:[--cell-size:3rem]"
          dayAddon={(d, outside) => {
            if (outside) return undefined;
            const w = d.getDay();
            return w === 0 || w === 6 ? "$120" : "$100";
          }}
        />
      </CardContent>
    </Card>
  );
};

const WeekNumbersPreview = () => {
  const y = new Date().getFullYear();
  const [date, setDate] = useState<Date | undefined>(new Date(y, 1, 3));
  return (
    <Card class="mx-auto w-fit p-0">
      <CardContent class="p-0">
        <Calendar
          mode="single"
          defaultMonth={date}
          selected={date}
          onSelect={(d) => setDate(d as Date)}
          showWeekNumber
          class="rounded-lg border-0"
        />
      </CardContent>
    </Card>
  );
};

const TimezonePreview = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeZone, setTimeZone] = useState<string | undefined>(undefined);
  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={(d) => setDate(d as Date)}
      timeZone={timeZone}
      class="rounded-lg border"
      captionLayout="dropdown"
    />
  );
};

type Lang = "en" | "ar" | "he";

const RtlPreview = () => {
  const [lang, setLang] = useState<Lang>("ar");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const dir = lang === "en" ? "ltr" : "rtl";
  const locale = lang === "en" ? undefined : lang === "ar" ? "ar-SA" : "he-IL";

  const labels: Record<Lang, string> = {
    en: "English",
    ar: "Arabic (العربية)",
    he: "Hebrew (עברית)",
  };

  return (
    <div class="flex flex-col gap-3">
      <div class="flex flex-wrap gap-2">
        {(["en", "ar", "he"] as const).map((key) => (
          <Button
            key={key}
            size="sm"
            variant={lang === key ? "default" : "outline"}
            onClick={() => setLang(key)}
          >
            {labels[key]}
          </Button>
        ))}
      </div>
      <DirectionProvider direction={dir}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => setDate(d as Date)}
          class="rounded-lg border [--cell-size:2.25rem]"
          captionLayout="dropdown"
          dir={dir}
          locale={locale}
        />
      </DirectionProvider>
    </div>
  );
};

const DEMO_CODE = `"use client"

import { Calendar } from "@/components/kamod-ui/calendar"
import { useState } from "preact/hooks"

export function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={(d) => setDate(d as Date)}
      class="rounded-lg border"
      captionLayout="dropdown"
    />
  )
}`;

const TIMEZONE_CODE = `import { Calendar } from "@/components/kamod-ui/calendar"
import { useEffect, useState } from "preact/hooks"

export function CalendarWithTimezone() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [timeZone, setTimeZone] = useState<string | undefined>(undefined)

  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={(d) => setDate(d as Date)}
      timeZone={timeZone}
      class="rounded-lg border"
      captionLayout="dropdown"
    />
  )
}`;

const BASIC_CODE = `"use client"

import { Calendar } from "@/components/kamod-ui/calendar"

export function CalendarBasic() {
  return <Calendar mode="single" class="rounded-lg border" />
}`;

const RANGE_CODE = `"use client"

import { Calendar } from "@/components/kamod-ui/calendar"
import { Card, CardContent } from "@/components/kamod-ui/card"
import type { DateRange } from "@/components/kamod-ui/calendar"
import { useState } from "preact/hooks"

const addDays = (d: Date, n: number) => {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

export function CalendarRange() {
  const y = new Date().getFullYear()
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(y, 0, 12),
    to: addDays(new Date(y, 0, 12), 30),
  })

  return (
    <Card class="mx-auto w-fit p-0">
      <CardContent class="p-0">
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={setDateRange}
          numberOfMonths={2}
          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
          class="rounded-lg border-0"
        />
      </CardContent>
    </Card>
  )
}`;

const CAPTION_CODE = `"use client"

import { Calendar } from "@/components/kamod-ui/calendar"

export function CalendarCaption() {
  return (
    <Calendar
      mode="single"
      captionLayout="dropdown"
      class="rounded-lg border"
    />
  )
}`;

const PRESETS_CODE = `"use client"

import { Button } from "@/components/kamod-ui/button"
import { Calendar } from "@/components/kamod-ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/kamod-ui/card"
import { useState } from "preact/hooks"

const addDays = (d: Date, n: number) => {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

export function CalendarWithPresets() {
  const [date, setDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), 1, 12)
  )
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  )

  return (
    <Card class="mx-auto w-fit max-w-[300px]" size="sm">
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          fixedWeeks
          class="border-0 p-0 shadow-none [--cell-size:2.375rem]"
        />
      </CardContent>
      <CardFooter class="flex flex-wrap gap-2 border-t">
        {[
          { label: "Today", value: 0 },
          { label: "Tomorrow", value: 1 },
          { label: "In 3 days", value: 3 },
          { label: "In a week", value: 7 },
          { label: "In 2 weeks", value: 14 },
        ].map((preset) => (
          <Button
            key={preset.value}
            variant="outline"
            size="sm"
            class="flex-1"
            onClick={() => {
              const newDate = addDays(new Date(), preset.value)
              setDate(newDate)
              setCurrentMonth(new Date(newDate.getFullYear(), newDate.getMonth(), 1))
            }}
          >
            {preset.label}
          </Button>
        ))}
      </CardFooter>
    </Card>
  )
}`;

const DATETIME_CODE = `"use client"

import { Calendar } from "@/components/kamod-ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/kamod-ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/kamod-ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/kamod-ui/input-group"
import { Clock } from "lucide-preact"
import { useState } from "preact/hooks"

export function CalendarWithTime() {
  const [date, setDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 12)
  )

  return (
    <Card size="sm" class="mx-auto w-fit rounded-lg border">
      <CardContent>
        <Calendar mode="single" selected={date} onSelect={setDate} class="p-0" />
      </CardContent>
      <CardFooter class="border-t bg-card">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="time-from">Start Time</FieldLabel>
            <InputGroup>
              <InputGroupInput id="time-from" type="time" step="1" defaultValue="10:30:00" />
              <InputGroupAddon>
                <Clock class="text-muted-foreground size-4" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="time-to">End Time</FieldLabel>
            <InputGroup>
              <InputGroupInput id="time-to" type="time" step="1" defaultValue="12:30:00" />
              <InputGroupAddon>
                <Clock class="text-muted-foreground size-4" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
      </CardFooter>
    </Card>
  )
}`;

const BOOKED_CODE = `"use client"

import { Calendar } from "@/components/kamod-ui/calendar"
import { Card, CardContent } from "@/components/kamod-ui/card"
import { useState } from "preact/hooks"

export function CalendarBookedDates() {
  const y = new Date().getFullYear()
  const [date, setDate] = useState<Date | undefined>(new Date(y, 1, 3))
  const bookedDates = Array.from({ length: 15 }, (_, i) => new Date(y, 1, 12 + i))

  return (
    <Card class="mx-auto w-fit p-0">
      <CardContent class="p-0">
        <Calendar
          mode="single"
          defaultMonth={date}
          selected={date}
          onSelect={setDate}
          disabled={bookedDates}
          modifiers={{ booked: bookedDates }}
          modifiersClassNames={{ booked: "line-through opacity-100" }}
          class="rounded-lg border-0"
        />
      </CardContent>
    </Card>
  )
}`;

const CUSTOM_CELL_CODE = `"use client"

import { Calendar } from "@/components/kamod-ui/calendar"
import { Card, CardContent } from "@/components/kamod-ui/card"
import type { DateRange } from "@/components/kamod-ui/calendar"
import { useState } from "preact/hooks"

const addDays = (d: Date, n: number) => {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

export function CalendarCustomDays() {
  const y = new Date().getFullYear()
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(y, 11, 8),
    to: addDays(new Date(y, 11, 8), 10),
  })

  return (
    <Card class="mx-auto w-fit p-0">
      <CardContent class="p-0">
        <Calendar
          mode="range"
          defaultMonth={range?.from}
          selected={range}
          onSelect={setRange}
          numberOfMonths={1}
          captionLayout="dropdown"
          class="[--cell-size:2.5rem] md:[--cell-size:3rem]"
          dayAddon={(d, outside) => {
            if (outside) return undefined
            const w = d.getDay()
            return w === 0 || w === 6 ? "$120" : "$100"
          }}
        />
      </CardContent>
    </Card>
  )
}

// Optional: theme spacing tokens (if your Tailwind defines --spacing)
// class="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"

// Or fixed rem:
// class="rounded-lg border [--cell-size:2.75rem] md:[--cell-size:3rem]"`;

const WEEK_NUM_CODE = `"use client"

import { Calendar } from "@/components/kamod-ui/calendar"
import { Card, CardContent } from "@/components/kamod-ui/card"
import { useState } from "preact/hooks"

export function CalendarWeekNumbers() {
  const y = new Date().getFullYear()
  const [date, setDate] = useState<Date | undefined>(new Date(y, 1, 3))

  return (
    <Card class="mx-auto w-fit p-0">
      <CardContent class="p-0">
        <Calendar
          mode="single"
          defaultMonth={date}
          selected={date}
          onSelect={setDate}
          showWeekNumber
          class="rounded-lg border-0"
        />
      </CardContent>
    </Card>
  )
}`;

const RTL_CODE = `"use client"

import { Button } from "@/components/kamod-ui/button"
import { Calendar } from "@/components/kamod-ui/calendar"
import { DirectionProvider } from "@/components/kamod-ui/direction"
import { useState } from "preact/hooks"

type Lang = "en" | "ar" | "he"

export function CalendarRtl() {
  const [lang, setLang] = useState<Lang>("ar")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const dir = lang === "en" ? "ltr" : "rtl"
  const locale = lang === "en" ? undefined : lang === "ar" ? "ar-SA" : "he-IL"

  const labels: Record<Lang, string> = {
    en: "English",
    ar: "Arabic (العربية)",
    he: "Hebrew (עברית)",
  }

  return (
    <div class="flex flex-col gap-3">
      <div class="flex flex-wrap gap-2">
        {(["en", "ar", "he"] as const).map((key) => (
          <Button key={key} size="sm" variant={lang === key ? "default" : "outline"} onClick={() => setLang(key)}>
            {labels[key]}
          </Button>
        ))}
      </div>
      <DirectionProvider direction={dir}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          class="rounded-lg border [--cell-size:2.25rem]"
          captionLayout="dropdown"
          dir={dir}
          locale={locale}
        />
      </DirectionProvider>
    </div>
  )
}`;

export const calendarDocPage = createGenericDocPage({
  slug: "calendar",
  title: "Calendar",
  previewCode: DEMO_CODE,
  usageLabel:
    "A calendar component that allows users to select a date or a range of dates — aligned with the structure and examples on ui.shadcn.com (Radix docs).",
  installationText:
    "Add `@kamod-ch/ui` to your app and import `Calendar`. This implementation mirrors the shadcn/ui Calendar **API Surface** (modes, captions, disabled, modifiers, week numbers, RTL) without bundling `react-day-picker`; see [React DayPicker](https://react-day-picker.js.org/) for the upstream reference behaviour.",
  usageText:
    'Import Calendar from `@/components/kamod-ui/calendar`, then control selected/onSelect in mode="single" or pass a DateRange in mode="range". The shadcn Calendar wraps React DayPicker; Kamod provides a lightweight grid with a parallel prop surface for demos and composition. Build a date picker with Popover and Button (see /docs/date-picker/installation in this app). If the highlighted day shifts vs your timezone, pass timeZone from Intl.DateTimeFormat().resolvedOptions().timeZone on the client (useEffect), as documented on ui.shadcn.com. For a tighter layout (e.g. narrow popovers), pass `size="sm"`.',
  exampleSections: [
    {
      id: "demo",
      title: "Demo",
      text: '**Make Date Selection Easy to Orient.** Use `captionLayout="dropdown"` to let people jump between months and years from the calendar header. The day grid remains the date-selection surface, while the caption provides a faster way to reach distant dates.\n\nKeep the surrounding field label clear, decide which dates the application accepts, and compare [Date Picker](/docs/date-picker/installation) when the calendar belongs inside an input workflow.',
      code: DEMO_CODE,
      renderPreview: () => <CalendarDemoPreview />,
    },
    {
      id: "timezone",
      title: "Selected Date (with TimeZone)",
      text: "**Choose Which Calendar Day the Value Represents.** Pass `timeZone` when the calendar's displayed dates need a specific zone. If it comes from the browser, detect it after mounting so the server and initial client render begin from a consistent value.\n\nEstablish the zone before formatting a selected date, keep server and client rendering consistent, and test dates near midnight rather than assuming a UTC conversion preserves the intended day.",
      code: TIMEZONE_CODE,
      renderPreview: () => <TimezonePreview />,
    },
    {
      id: "basic",
      title: "Basic",
      text: '**Start with a Focused Date-Selection Surface.** Start with one calendar and a simple `class="rounded-lg border"` frame. This isolates day selection from surrounding popovers or form fields, making it easier to understand before adding a larger date-entry workflow.\n\nAdd application-specific bounds and unavailable dates deliberately, and keep the selected date visible in text when it is part of a larger form.',
      code: BASIC_CODE,
      renderPreview: () => <BasicCalendarPreview />,
    },
    {
      id: "range-calendar",
      title: "Range Calendar",
      text: "**Make Both Ends of the Range Understandable.** Use `mode=\"range\"` with two visible months to compare the start and end of a period. An optional `disabled` predicate can exclude dates that should not be available for the user's selection.\n\nTest ranges that cross months and unavailable days; visual range styling does not replace your application's booking or validation rules.",
      code: RANGE_CODE,
      renderPreview: () => <RangeCalendarPreview />,
    },
    {
      id: "month-year-selector",
      title: "Month and Year Selector",
      text: '**Support dates far from today.** Set `captionLayout="dropdown"` for direct month and year selection alongside the previous/next controls. Pass `locale` for localized month labels so the calendar\'s navigation uses the same language as its surrounding field.\n\nPick sensible year bounds for the task and verify localized month labels; users should not need to step through dozens of months to reach a valid choice.',
      code: CAPTION_CODE,
      renderPreview: () => <MonthYearSelectorPreview />,
    },
    {
      id: "presets",
      title: "Presets",
      text: "**Offer Shortcuts without Removing Precise Selection.** Control `month` through `onMonthChange` when shortcut buttons should move the visible calendar. `fixedWeeks` keeps a six-row grid, reducing movement when navigating between months with different numbers of displayed weeks.\n\nKeep the displayed month and selected value coordinated, and label each shortcut according to what it actually changes rather than implying a range it does not select.",
      code: PRESETS_CODE,
      renderPreview: () => <PresetsPreview />,
    },
    {
      id: "date-time-picker",
      title: "Date and Time Picker",
      text: "**Treat Date and Time as One Application Value.** Combine the calendar with time fields in the card footer when a task needs both a day and a time. These remain separate inputs; your application decides how their values form the final date-time payload.\n\nExplain the relevant time zone, handle incomplete values, and verify that editing the time does not unexpectedly reset the selected date.",
      code: DATETIME_CODE,
      renderPreview: () => <DateTimePickerPreview />,
    },
    {
      id: "booked-dates",
      title: "Booked Dates",
      text: "**Distinguish Unavailable Days from Selected Ones.** Use `disabled` to prevent choosing booked dates and `modifiers` with `modifiersClassNames` to distinguish them visually. Styling explains the availability rule, while the disabled predicate enforces the calendar's selection behavior.\n\nInclude explanatory text for the booking rules, and test a mix of adjacent available and booked dates so the calendar does not rely on color alone.",
      code: BOOKED_CODE,
      renderPreview: () => <BookedDatesPreview />,
    },
    {
      id: "custom-cell-size",
      title: "Custom Cell Size",
      text: "**Leave Room for Useful Day Details.** Adjust `--cell-size` for the available width and use `dayAddon` for secondary information such as a daily price. The source also compares fixed sizes so you can choose a density appropriate to the surrounding layout.\n\nKeep the primary day number readable, scale the cell size for narrow screens, and avoid turning secondary information into a second competing selection target.",
      code: CUSTOM_CELL_CODE,
      renderPreview: () => <CustomCellSizePreview />,
    },
    {
      id: "week-numbers",
      title: "Week Numbers",
      text: "**Add Context for Week-Based Planning.** Enable `showWeekNumber` to add ISO week indices beside the day grid. This is useful when schedules are organized by week, giving readers a reference without replacing the individual date labels.\n\nConfirm that the convention matches your users' expectations and keep the numbers visually secondary to selectable days; explain the convention if the surrounding product uses another calendar system.",
      code: WEEK_NUM_CODE,
      renderPreview: () => <WeekNumbersPreview />,
    },
    {
      id: "rtl",
      title: "RTL",
      text: "**Check the Whole Pattern in Its Reading Direction.** Combine `dir`, a locale such as `ar-SA`, and `DirectionProvider` for a translated calendar. Review the month caption, weekday labels and directional controls as one date-selection experience.\n\nKeep values and keyboard behavior meaningful in the translated interface, and follow [Direction](/docs/direction/installation) when the page and its portaled controls need a shared direction.",
      code: RTL_CODE,
      renderPreview: () => <RtlPreview />,
    },
  ],
  apiRows: [
    { prop: "mode", type: '"single" | "range"', defaultValue: '"single"' },
    { prop: "selected", type: "Date | DateRange | undefined", defaultValue: "undefined" },
    {
      prop: "onSelect",
      type: "(value: Date | DateRange | undefined) => void",
      defaultValue: "undefined",
    },
    {
      prop: "value / onValueChange",
      type: "Date + callback",
      defaultValue: "deprecated; use selected/onSelect",
    },
    { prop: "defaultMonth", type: "Date", defaultValue: "from selected or today" },
    {
      prop: "month / onMonthChange",
      type: "Date + callback",
      defaultValue: "optional controlled month",
    },
    { prop: "numberOfMonths", type: "1 | 2", defaultValue: "1" },
    { prop: "captionLayout", type: '"buttons" | "dropdown"', defaultValue: '"buttons"' },
    { prop: "size", type: '"default" | "sm"', defaultValue: '"default"' },
    { prop: "dir", type: '"ltr" | "rtl"', defaultValue: '"ltr"' },
    { prop: "showOutsideDays", type: "boolean", defaultValue: "true" },
    { prop: "fixedWeeks", type: "boolean", defaultValue: "false" },
    { prop: "disabled", type: "((date: Date) => boolean) | Date[]", defaultValue: "undefined" },
    { prop: "showWeekNumber", type: "boolean", defaultValue: "false" },
    { prop: "modifiers", type: "Record<string, Date[]>", defaultValue: "undefined" },
    { prop: "modifiersClassNames", type: "Record<string, string>", defaultValue: "undefined" },
    { prop: "locale", type: "string (BCP 47)", defaultValue: "undefined" },
    { prop: "timeZone", type: "string", defaultValue: "undefined" },
    {
      prop: "dayAddon",
      type: "(date, outside) => children | undefined",
      defaultValue: "undefined",
    },
    { prop: "class", type: "string", defaultValue: "undefined" },
  ],
  accessibilityText:
    "Day cells are `<button>` elements; prev/next use the shared `Button` ghost icon pattern. Dropdown captions expose `aria-label` on selects. Pair with visible labels in forms.",
  installationExample: {
    code: `import { Calendar } from "@/components/kamod-ui/calendar"

export const Example = () => (
  <Calendar mode="single" captionLayout="dropdown" class="rounded-lg border" />
)`,
    renderPreview: () => <CalendarDemoPreview />,
  },
});
