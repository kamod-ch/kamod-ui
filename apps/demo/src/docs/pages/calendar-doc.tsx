import {
  Button,
  Calendar,
  Card,
  CardContent,
  CardFooter,
  DirectionProvider,
  Field,
  FieldGroup,
  FieldLabel,
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "@kamod-ui/core";
import type { DateRange } from "@kamod-ui/core";
import { Clock } from "lucide-preact";
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
    to: addDays(new Date(y, 0, 12), 30)
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
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
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
          class="p-0 [--cell-size:2.375rem]"
        />
      </CardContent>
      <CardFooter class="flex flex-wrap gap-2 border-t">
        {[
          { label: "Today", value: 0 },
          { label: "Tomorrow", value: 1 },
          { label: "In 3 days", value: 3 },
          { label: "In a week", value: 7 },
          { label: "In 2 weeks", value: 14 }
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
  const [date, setDate] = useState<Date | undefined>(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 12)
  );
  return (
    <Card size="sm" class="mx-auto w-fit rounded-lg border">
      <CardContent>
        <Calendar mode="single" selected={date} onSelect={(d) => setDate(d as Date)} class="p-0" />
      </CardContent>
      <CardFooter class="border-t bg-card">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="cal-time-from">Start Time</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="cal-time-from"
                type="time"
                step="1"
                defaultValue="10:30:00"
                class="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <Clock class="text-muted-foreground size-4" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="cal-time-to">End Time</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="cal-time-to"
                type="time"
                step="1"
                defaultValue="12:30:00"
                class="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <Clock class="text-muted-foreground size-4" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
      </CardFooter>
    </Card>
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
    to: addDays(new Date(y, 11, 8), 10)
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

const PersianNotePreview = () => (
  <div class="border-border bg-card text-card-foreground max-w-xl rounded-lg border p-4 text-sm leading-relaxed">
    <p class="mb-2 font-medium">Persian / Hijri / Jalali</p>
    <p class="text-muted-foreground mb-2">
      On{" "}
      <a
        class="text-primary font-medium underline-offset-4 hover:underline"
        href="https://ui.shadcn.com/docs/components/radix/calendar"
        rel="noreferrer"
        target="_blank"
      >
        ui.shadcn.com
      </a>
      , you switch the DayPicker import to <code class="bg-muted rounded px-1 py-0.5 text-xs">react-day-picker/persian</code>.
      Kamod Calendar is a self-contained grid (no react-day-picker); use a Jalali date library or replace the day matrix
      if you need Persian dates in production.
    </p>
    <pre class="bg-muted overflow-x-auto rounded-md p-3 text-xs">
      {`- import { DayPicker } from "react-day-picker"
+ import { DayPicker } from "react-day-picker/persian"`}
    </pre>
  </div>
);

type Lang = "en" | "ar" | "he";

const RtlPreview = () => {
  const [lang, setLang] = useState<Lang>("ar");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const dir = lang === "en" ? "ltr" : "rtl";
  const locale = lang === "en" ? undefined : lang === "ar" ? "ar-SA" : "he-IL";

  const labels: Record<Lang, string> = {
    en: "English",
    ar: "Arabic (العربية)",
    he: "Hebrew (עברית)"
  };

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

import { Calendar } from "@kamod-ui/core"
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

const TIMEZONE_CODE = `import { Calendar } from "@kamod-ui/core"
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

import { Calendar } from "@kamod-ui/core"

export function CalendarBasic() {
  return <Calendar mode="single" class="rounded-lg border" />
}`;

const RANGE_CODE = `"use client"

import { Calendar, Card, CardContent } from "@kamod-ui/core"
import type { DateRange } from "@kamod-ui/core"
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

import { Calendar } from "@kamod-ui/core"

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

import { Button, Calendar, Card, CardContent, CardFooter } from "@kamod-ui/core"
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
          class="p-0 [--cell-size:2.375rem]"
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

import { Calendar, Card, CardContent, CardFooter, Field, FieldGroup, FieldLabel } from "@kamod-ui/core"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@kamod-ui/core"
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

import { Calendar, Card, CardContent } from "@kamod-ui/core"
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

import { Calendar, Card, CardContent } from "@kamod-ui/core"
import type { DateRange } from "@kamod-ui/core"
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

import { Calendar, Card, CardContent } from "@kamod-ui/core"
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

import { Button, Calendar, DirectionProvider } from "@kamod-ui/core"
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
    "Add `@kamod-ui/core` to your app and import `Calendar`. This implementation mirrors the shadcn/ui Calendar **API surface** (modes, captions, disabled, modifiers, week numbers, RTL) without bundling `react-day-picker`; see [React DayPicker](https://react-day-picker.js.org/) for the upstream reference behaviour.",
  usageText:
    "Import Calendar from @kamod-ui/core, then control selected/onSelect in mode=\"single\" or pass a DateRange in mode=\"range\". The shadcn Calendar wraps React DayPicker; Kamod provides a lightweight grid with a parallel prop surface for demos and composition. Build a date picker with Popover and Button (see /docs/date-picker/installation in this app). If the highlighted day shifts vs your timezone, pass timeZone from Intl.DateTimeFormat().resolvedOptions().timeZone on the client (useEffect), as documented on ui.shadcn.com.",
  exampleSections: [
    {
      id: "demo",
      title: "Demo",
      text: "Top-of-page example with `captionLayout=\"dropdown\"` — same role as the live preview on ui.shadcn.com.",
      code: DEMO_CODE,
      renderPreview: () => <CalendarDemoPreview />
    },
    {
      id: "timezone",
      title: "Selected Date (With TimeZone)",
      text: "Pass `timeZone` so captions align with the user’s zone; detect it client-side to avoid SSR hydration mismatches (see shadcn note on the same page).",
      code: TIMEZONE_CODE,
      renderPreview: () => <TimezonePreview />
    },
    {
      id: "basic",
      title: "Basic",
      text: "A basic calendar. We use `class=\"rounded-lg border\"` like the shadcn examples.",
      code: BASIC_CODE,
      renderPreview: () => <BasicCalendarPreview />
    },
    {
      id: "range-calendar",
      title: "Range Calendar",
      text: "Use `mode=\"range\"` with two months and an optional `disabled` predicate — matches the Range Calendar + disabled snippet on ui.shadcn.com.",
      code: RANGE_CODE,
      renderPreview: () => <RangeCalendarPreview />
    },
    {
      id: "month-year-selector",
      title: "Month and Year Selector",
      text: "Use `captionLayout=\"dropdown\"` for month and year `<select>` controls, with ghost prev/next icons on the sides (same chrome as ui.shadcn.com). Month labels follow `locale` (e.g. März → Mär in de-DE).",
      code: CAPTION_CODE,
      renderPreview: () => <MonthYearSelectorPreview />
    },
    {
      id: "presets",
      title: "Presets",
      text: "Controlled `month` / `onMonthChange` with preset buttons and `fixedWeeks` for a stable six-row grid.",
      code: PRESETS_CODE,
      renderPreview: () => <PresetsPreview />
    },
    {
      id: "date-time-picker",
      title: "Date and Time Picker",
      text: "Calendar plus time fields in the card footer (composition pattern from ui.shadcn.com).",
      code: DATETIME_CODE,
      renderPreview: () => <DateTimePickerPreview />
    },
    {
      id: "booked-dates",
      title: "Booked dates",
      text: "`disabled` with `modifiers` and `modifiersClassNames` for strike-through booked days.",
      code: BOOKED_CODE,
      renderPreview: () => <BookedDatesPreview />
    },
    {
      id: "custom-cell-size",
      title: "Custom Cell Size",
      text: "Responsive `[--cell-size:…]` and `dayAddon` for secondary labels (e.g. prices). The code tab also shows fixed `rem` / spacing-token variants from the shadcn page.",
      code: CUSTOM_CELL_CODE,
      renderPreview: () => <CustomCellSizePreview />
    },
    {
      id: "week-numbers",
      title: "Week Numbers",
      text: "Use `showWeekNumber` to show ISO week indices (zero-padded), in line with the shadcn example.",
      code: WEEK_NUM_CODE,
      renderPreview: () => <WeekNumbersPreview />
    },
    {
      id: "persian-hijri",
      title: "Persian / Hijri / Jalali Calendar",
      text: "shadcn swaps to `react-day-picker/persian`. Kamod’s grid is Gregorian; see the note and diff below for a product-level approach.",
      code: `// ui.shadcn.com — replace the DayPicker import:

- import { DayPicker } from "react-day-picker"
+ import { DayPicker } from "react-day-picker/persian"`,
      renderPreview: () => <PersianNotePreview />
    },
    {
      id: "rtl",
      title: "RTL",
      text: "Use `dir` + `locale` (e.g. `ar-SA`) with `DirectionProvider`, following the RTL guidance on ui.shadcn.com.",
      code: RTL_CODE,
      renderPreview: () => <RtlPreview />
    }
  ],
  apiRows: [
    { prop: "mode", type: '"single" | "range"', defaultValue: '"single"' },
    { prop: "selected", type: "Date | DateRange | undefined", defaultValue: "undefined" },
    { prop: "onSelect", type: "(value: Date | DateRange | undefined) => void", defaultValue: "undefined" },
    { prop: "value / onValueChange", type: "Date + callback", defaultValue: "deprecated; use selected/onSelect" },
    { prop: "defaultMonth", type: "Date", defaultValue: "from selected or today" },
    { prop: "month / onMonthChange", type: "Date + callback", defaultValue: "optional controlled month" },
    { prop: "numberOfMonths", type: "1 | 2", defaultValue: "1" },
    { prop: "captionLayout", type: '"buttons" | "dropdown"', defaultValue: '"buttons"' },
    { prop: "dir", type: '"ltr" | "rtl"', defaultValue: '"ltr"' },
    { prop: "showOutsideDays", type: "boolean", defaultValue: "true" },
    { prop: "fixedWeeks", type: "boolean", defaultValue: "false" },
    { prop: "disabled", type: "((date: Date) => boolean) | Date[]", defaultValue: "undefined" },
    { prop: "showWeekNumber", type: "boolean", defaultValue: "false" },
    { prop: "modifiers", type: "Record<string, Date[]>", defaultValue: "undefined" },
    { prop: "modifiersClassNames", type: "Record<string, string>", defaultValue: "undefined" },
    { prop: "locale", type: "string (BCP 47)", defaultValue: "undefined" },
    { prop: "timeZone", type: "string", defaultValue: "undefined" },
    { prop: "dayAddon", type: "(date, outside) => children | undefined", defaultValue: "undefined" },
    { prop: "class", type: "string", defaultValue: "undefined" }
  ],
  accessibilityText:
    "Day cells are `<button>` elements; prev/next use the shared `Button` ghost icon pattern. Dropdown captions expose `aria-label` on selects. Pair with visible labels in forms.",
  installationExample: {
    code: `import { Calendar } from "@kamod-ui/core"

export const Example = () => (
  <Calendar mode="single" captionLayout="dropdown" class="rounded-lg border" />
)`,
    renderPreview: () => <CalendarDemoPreview />
  }
});
