import type { DateRange } from "@kamod-ch/ui";
import {
  Button,
  Calendar,
  DatePicker,
  Field,
  FieldGroup,
  FieldLabel,
  formatDatePickerDisplay,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@kamod-ch/ui";
import { parseDate } from "chrono-node";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-preact";
import { useState } from "preact/hooks";
import { createGenericDocPage } from "./create-generic-doc-page";

const formatMdY = (date: Date | undefined) => {
  if (!date) return "";
  return date.toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" });
};

const isValidDate = (date: Date | undefined) => Boolean(date && !Number.isNaN(date.getTime()));

type Lang = "en" | "ar" | "he";

const rtlCopy: Record<Lang, { dir: "ltr" | "rtl"; placeholder: string; label: string }> = {
  en: { dir: "ltr", placeholder: "Pick a date", label: "EN" },
  ar: { dir: "rtl", placeholder: "اختر تاريخًا", label: "AR" },
  he: { dir: "rtl", placeholder: "בחר תאריך", label: "HE" },
};

const DatePickerRtlPreview = () => {
  const [lang, setLang] = useState<Lang>("ar");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const t = rtlCopy[lang];
  const locale = lang === "en" ? undefined : lang === "ar" ? "ar-SA" : "he-IL";

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
            {rtlCopy[key].label}
          </Button>
        ))}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            dir={t.dir}
            data-empty={date ? undefined : "true"}
            class="data-[empty=true]:text-muted-foreground w-[min(100%,212px)] justify-between text-start font-normal"
          >
            {date ? formatDatePickerDisplay(date, locale) : <span>{t.placeholder}</span>}
            <ChevronDown class="size-4 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto overflow-hidden p-0" align="start" dir={t.dir}>
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            dir={t.dir}
            onSelect={(d) => setDate(d as Date)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

const DatePickerDemoComposedPreview = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={date ? undefined : "true"}
          class="data-[empty=true]:text-muted-foreground w-[min(100%,212px)] justify-between text-start font-normal"
        >
          {date ? formatDatePickerDisplay(date) : <span>Pick a date</span>}
          <ChevronDown class="size-4 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          defaultMonth={date}
          onSelect={(d) => setDate(d as Date)}
        />
      </PopoverContent>
    </Popover>
  );
};

const DatePickerWithCalendarIconPreview = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={date ? undefined : "true"}
          class="data-[empty=true]:text-muted-foreground w-[min(100%,280px)] justify-start gap-2 text-start font-normal"
        >
          <CalendarIcon class="size-4 opacity-60" />
          {date ? formatDatePickerDisplay(date) : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto overflow-hidden p-0">
        <Calendar
          mode="single"
          selected={date}
          defaultMonth={date}
          onSelect={(d) => setDate(d as Date)}
        />
      </PopoverContent>
    </Popover>
  );
};

const BasicFieldPreview = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <Field class="mx-auto w-44">
      <FieldLabel htmlFor="date-picker-simple">Date</FieldLabel>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date-picker-simple"
            variant="outline"
            class="w-full justify-start font-normal"
            data-empty={date ? undefined : "true"}
          >
            {date ? formatDatePickerDisplay(date) : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            onSelect={(d) => setDate(d as Date)}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
};

const RangePickerPreview = () => {
  const [range, setRange] = useState<DateRange | undefined>(() => {
    const from = new Date(new Date().getFullYear(), 0, 20);
    const to = new Date(from);
    to.setDate(to.getDate() + 20);
    return { from, to };
  });
  const label =
    range?.from && range?.to
      ? `${range.from.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} — ${range.to.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
      : range?.from
        ? range.from.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Pick a date";

  return (
    <Field class="mx-auto w-72">
      <FieldLabel htmlFor="date-picker-range">Date range</FieldLabel>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date-picker-range"
            variant="outline"
            class="w-full justify-start gap-2 px-2.5 font-normal"
          >
            <CalendarIcon class="size-4 opacity-60" />
            <span class="truncate">{label}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={range}
            defaultMonth={range?.from}
            onSelect={(v) => setRange(v as DateRange)}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
};

const DateOfBirthPreview = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <Field class="mx-auto w-44">
      <FieldLabel htmlFor="date-dob">Date of birth</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date-dob"
            variant="outline"
            class="w-full justify-start font-normal"
            data-empty={date ? undefined : "true"}
          >
            {date ? date.toLocaleDateString() : "Select date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            selected={date}
            defaultMonth={date}
            onSelect={(d) => {
              setDate(d as Date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
};

const InputPickerPreview = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date("2025-06-01"));
  const [month, setMonth] = useState<Date | undefined>(date);
  const [value, setValue] = useState(formatMdY(date));

  return (
    <Field class="mx-auto w-52">
      <FieldLabel htmlFor="date-required">Subscription date</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="date-required"
          data-slot="input-group-control"
          value={value}
          placeholder="June 01, 2025"
          onInput={(e) => {
            const raw = (e.target as HTMLInputElement).value;
            setValue(raw);
            const parsed = new Date(raw);
            if (isValidDate(parsed)) {
              setDate(parsed);
              setMonth(parsed);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <InputGroupButton
                id="date-picker-ig"
                variant="ghost"
                size="icon-xs"
                aria-label="Select date"
              >
                <CalendarIcon class="size-4" />
                <span class="sr-only">Select date</span>
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent class="w-auto overflow-hidden p-0" align="end" sideOffset={10}>
              <Calendar
                mode="single"
                selected={date}
                month={month}
                defaultMonth={date}
                onMonthChange={setMonth}
                onSelect={(d) => {
                  const next = d as Date;
                  setDate(next);
                  setMonth(next);
                  setValue(formatMdY(next));
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
};

const TimePickerPreview = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <FieldGroup class="mx-auto flex max-w-xs flex-col gap-4 sm:flex-row sm:items-end">
      <Field>
        <FieldLabel htmlFor="date-picker-optional">Date</FieldLabel>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker-optional"
              variant="outline"
              class="w-full min-w-[8rem] justify-between font-normal sm:w-32"
              data-empty={date ? undefined : "true"}
            >
              {date ? formatDatePickerDisplay(date) : "Select date"}
              <ChevronDown class="size-4 opacity-60" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              captionLayout="dropdown"
              selected={date}
              defaultMonth={date}
              onSelect={(d) => {
                setDate(d as Date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </Field>
      <Field class="w-full sm:w-32">
        <FieldLabel htmlFor="time-picker-optional">Time</FieldLabel>
        <Input
          type="time"
          id="time-picker-optional"
          step={1}
          defaultValue="10:30:00"
          class="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </Field>
    </FieldGroup>
  );
};

const NaturalLanguagePreview = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("In 2 days");
  const ref = new Date();
  const parsed = parseDate(value, ref, { forwardDate: true });
  const [date, setDate] = useState<Date | undefined>(parsed ?? undefined);

  return (
    <Field class="mx-auto max-w-xs">
      <FieldLabel htmlFor="date-optional">Schedule date</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="date-optional"
          data-slot="input-group-control"
          value={value}
          placeholder="Tomorrow or next week"
          onInput={(e) => {
            const raw = (e.target as HTMLInputElement).value;
            setValue(raw);
            const next = parseDate(raw, ref, { forwardDate: true });
            if (next) setDate(next);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <InputGroupButton variant="ghost" size="icon-xs" aria-label="Select date">
                <CalendarIcon class="size-4" />
                <span class="sr-only">Select date</span>
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent class="w-auto overflow-hidden p-0" align="end" sideOffset={8}>
              <Calendar
                mode="single"
                captionLayout="dropdown"
                selected={date}
                defaultMonth={date}
                onSelect={(d) => {
                  const next = d as Date;
                  setDate(next);
                  setValue(formatMdY(next));
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
      <p class="text-muted-foreground px-1 text-sm">
        Your post will be published on{" "}
        <span class="font-medium text-foreground">{formatMdY(date) || "—"}</span>.
      </p>
    </Field>
  );
};

export const datePickerDocPage = createGenericDocPage({
  slug: "date-picker",
  title: "Date Picker",
  previewCode: `import { DatePicker } from "@/components/kamod-ui/date-picker";

export const Example = () => <DatePicker placeholder="Pick a date" />;`,
  usageLabel:
    "Date picker combines Popover + trigger + Calendar. Use the `DatePicker` shortcut or compose `Popover`, `Button`, and `Calendar` like shadcn/ui.",
  installationText:
    "Requires `@kamod-ch/ui` (includes Popover and Calendar). Optional: `lucide-preact` for icons in demos, `chrono-node` for natural-language parsing in the demo below.",
  usageText:
    '`DatePicker` wraps a styled outline `Button`, `Popover`, and single-mode `Calendar` with `closeOnSelect`. For range, dropdown month/year captions, input-adjacent pickers, or RTL, compose primitives — see Examples. `Popover` supports `open` / `onOpenChange` for closing after select. `Calendar` supports `mode="single" | "range"`, `numberOfMonths={2}`, and `captionLayout="dropdown"`.',
  exampleSections: [
    {
      id: "demo-composed",
      title: "Demo",
      text: "**Own the Composition When the Workflow Needs Flexibility.** Compose [Popover](/docs/popover/installation), `Button` and `Calendar` when you need direct control over the date picker's trigger and panel. The button displays the chosen date while the calendar provides the selection interface.\n\nStore the selected date in one place, format its display deliberately, and preserve dismissal and focus behavior when adapting the panel.",
      code: `// See date-picker-doc.tsx — Popover + Button + Calendar + ChevronDown`,
      renderPreview: () => <DatePickerDemoComposedPreview />,
    },
    {
      id: "date-picker-convenience",
      title: "DatePicker Component",
      text: "**Use the Shortcut for a Standard Single-Date Field.** Use the `DatePicker` convenience component for a standard date-selection field. Options such as `triggerIcon`, `align` and `format` customize common presentation needs without rebuilding the trigger, popover and calendar composition.\n\nCheck the [API Reference](#api-reference) before reaching for a custom composition, particularly when formatting, alignment or the trigger symbol is the only difference you need.",
      code: `import { DatePicker } from "@/components/kamod-ui/date-picker";

export const Example = () => (
  <>
    <DatePicker placeholder="Pick a date" />
    <DatePicker triggerIcon="calendar" class="mt-4" />
  </>
);`,
      renderPreview: () => (
        <div class="flex flex-col items-start gap-4">
          <DatePicker placeholder="Pick a date" />
          <DatePicker triggerIcon="calendar" placeholder="Pick a date" />
        </div>
      ),
    },
    {
      id: "calendar-icon-composed",
      title: "Calendar Icon Trigger",
      text: "**Make the Date Affordance Recognizable at Rest.** Place a calendar icon before a left-aligned date label to make the trigger recognizable as a date field. The composed version keeps that trigger design separate from the calendar shown inside the popover.\n\nKeep the field's actual label outside the value display and avoid making the icon a second, competing popup trigger.",
      code: `// PopoverTrigger asChild + Button with CalendarIcon — see date-picker-doc.tsx`,
      renderPreview: () => <DatePickerWithCalendarIconPreview />,
    },
    {
      id: "basic-field",
      title: "Basic",
      text: "**Give the Picker the Same Structure as Other Fields.** Place a labeled date trigger inside `Field` and let it fill the available width. The field supplies the question and supporting context, while the popover offers the calendar interaction for choosing its value.\n\nKeep validation associated with the trigger, and distinguish an empty value from a selected date that the application no longer accepts.",
      code: `// Field + FieldLabel + Popover + Button + Calendar — see date-picker-doc.tsx`,
      renderPreview: () => <BasicFieldPreview />,
    },
    {
      id: "range-picker",
      title: "Range Picker",
      text: '**Show a Clear Start and End Value.** Use `mode="range"` with `numberOfMonths={2}` to show a period across adjacent months. The selected value represents a start and end, so the trigger should communicate both boundaries rather than a single date.\n\nExplain inclusive or exclusive end-date rules where relevant, and verify the layout at narrow widths before adopting the wider panel.',
      code: `import { Calendar } from "@/components/kamod-ui/calendar";
import type { DateRange } from "@/components/kamod-ui/calendar";
// Popover + range Calendar — see date-picker-doc.tsx`,
      renderPreview: () => <RangePickerPreview />,
    },
    {
      id: "date-of-birth",
      title: "Date of Birth",
      text: "**Make Distant Years Easy to Reach.** Use month and year dropdowns when users commonly choose dates far from today, such as a birth date. Control `open` so selecting a day can close the popover after the value has been accepted.\n\nChoose appropriate year bounds, avoid silently substituting today's date for an empty answer, and confirm that closing after selection does not prevent users from correcting a mistaken choice.",
      code: `// captionLayout="dropdown" + controlled Popover — see date-picker-doc.tsx`,
      renderPreview: () => <DateOfBirthPreview />,
    },
    {
      id: "input-picker",
      title: "With Input",
      text: "**Support Typing and Calendar Selection Together.** Combine a typed date field with an `InputGroup` calendar button when people should be able to type or browse. The example also opens the calendar with Arrow Down, keeping both entry paths connected to the same value.\n\nHandle incomplete or invalid input without silently replacing it, and preserve the keyboard shortcut for opening the calendar alongside ordinary input editing.",
      code: `// InputGroup + controlled Calendar month — see date-picker-doc.tsx`,
      renderPreview: () => <InputPickerPreview />,
    },
    {
      id: "time-picker",
      title: "Date and Time",
      text: '**Keep Date, Time and Zone Decisions Explicit.** Place a date field next to a native `Input type="time"` when the task requires both parts. The browser supplies time entry, while your application determines the combined value and any timezone interpretation.\n\nDefine how incomplete values and time-zone conversion are handled, and test daylight-saving boundaries when the result represents an appointment rather than a date-only record.',
      code: `// FieldGroup + Calendar dropdown caption + Input time — see date-picker-doc.tsx`,
      renderPreview: () => <TimePickerPreview />,
    },
    {
      id: "natural-language",
      title: "Natural Language",
      text: "**Show What the Phrase Resolved to.** The demo uses `chrono-node` to interpret phrases such as “In 2 days” before displaying the resulting date. Treat that parser as an additional integration and let users review the resolved date before committing it.\n\nConfirm the interpreted result before submission, handle unrecognized phrases, and remember that `chrono-node` is an additional demo dependency rather than built-in calendar behavior.",
      code: `import { parseDate } from "chrono-node";
// InputGroup + parseDate — see date-picker-doc.tsx`,
      renderPreview: () => <NaturalLanguagePreview />,
    },
    {
      id: "rtl",
      title: "RTL",
      text: "**Check the Whole Pattern in Its Reading Direction.** Keep `dir` consistent across the date trigger, popup and calendar, and format the displayed value with the appropriate locale. The translated placeholder and selected date should follow the same conventions as the calendar itself.\n\nKeep values and keyboard behavior meaningful in the translated interface, and follow [Direction](/docs/direction/installation) when the page and its portaled controls need a shared direction.",
      code: `// EN / AR / HE toggles — see date-picker-doc.tsx DatePickerRtlPreview`,
      renderPreview: () => <DatePickerRtlPreview />,
    },
  ],
  apiRows: [
    { prop: "value", type: "Date | undefined", defaultValue: "undefined" },
    { prop: "defaultValue", type: "Date | undefined", defaultValue: "undefined" },
    { prop: "onValueChange", type: "(date: Date | undefined) => void", defaultValue: "undefined" },
    { prop: "placeholder", type: "string", defaultValue: '"Pick a date"' },
    { prop: "closeOnSelect", type: "boolean", defaultValue: "true" },
    { prop: "align", type: '"start" | "center" | "end"', defaultValue: '"start"' },
    { prop: "triggerIcon", type: '"chevron" | "calendar" | "none"', defaultValue: '"chevron"' },
    { prop: "format", type: "(date: Date) => string", defaultValue: "formatDatePickerDisplay" },
    { prop: "children", type: "ComponentChildren", defaultValue: "default Button trigger" },
  ],
  accessibilityText:
    "Keep placeholder and button text meaningful; associate labels with `FieldLabel` + trigger `id`. Calendar grid uses buttons for days; popover closes on Escape. For input hybrids, expose Arrow Down to open the calendar.",
});
