import type { DateRange } from "@kamod-ch/ui";
import { createDateRangePresets, DateRangePicker, formatDateRangeDisplay } from "@kamod-ch/ui";
import { useEffect, useState } from "preact/hooks";
import { createGenericDocPage } from "./create-generic-doc-page";

const presetLabels = {
  today: "Today",
  last7Days: "Last 7 days",
  last30Days: "Last 30 days",
  monthToDate: "Month to date",
  previousMonth: "Previous month",
};

const pickerLabels = { apply: "Apply", cancel: "Cancel" };

const validationMessages = {
  incomplete: "Select a start and end date.",
  invalid: "End date must be on or after the start date.",
  disabledInRange: "The range includes unavailable days.",
};

const BasicPreview = () => {
  const [range, setRange] = useState<DateRange | undefined>();
  const [referenceDate, setReferenceDate] = useState<Date | undefined>();

  useEffect(() => {
    setReferenceDate(new Date(2024, 5, 15, 12, 0, 0));
  }, []);

  return (
    <DateRangePicker
      value={range}
      onValueChange={setRange}
      placeholder="Pick a date range"
      labels={pickerLabels}
      validationMessages={validationMessages}
      presets={createDateRangePresets(presetLabels)}
      presetsGroupLabel="Quick ranges"
      referenceDate={referenceDate}
      format={(value) => formatDateRangeDisplay(value, "en-US")}
    />
  );
};

const BASIC_CODE = `import {
  createDateRangePresets,
  DateRangePicker,
  formatDateRangeDisplay,
} from "@/components/kamod-ui/date-range-picker";
import { useEffect, useState } from "preact/hooks";

export const Example = () => {
  const [range, setRange] = useState(undefined);
  const [referenceDate, setReferenceDate] = useState(undefined);

  useEffect(() => {
    setReferenceDate(new Date(2024, 5, 15, 12, 0, 0));
  }, []);

  return (
    <DateRangePicker
      value={range}
      onValueChange={setRange}
      placeholder="Pick a date range"
      labels={{ apply: "Apply", cancel: "Cancel" }}
      validationMessages={{
        incomplete: "Select a start and end date.",
        disabledInRange: "The range includes unavailable days.",
      }}
      presets={createDateRangePresets({
        today: "Today",
        last7Days: "Last 7 days",
        last30Days: "Last 30 days",
        monthToDate: "Month to date",
        previousMonth: "Previous month",
      })}
      presetsGroupLabel="Quick ranges"
      referenceDate={referenceDate}
      format={(value) => formatDateRangeDisplay(value, "en-US")}
    />
  );
};`;

const RtlPreview = () => {
  const [range, setRange] = useState<DateRange | undefined>();
  return (
    <DateRangePicker
      dir="rtl"
      value={range}
      onValueChange={setRange}
      placeholder="اختر نطاقًا"
      labels={{ apply: "تطبيق", cancel: "إلغاء" }}
      locale="ar-SA"
      format={(value) => formatDateRangeDisplay(value, "ar-SA")}
      responsiveMonths={false}
      numberOfMonths={1}
    />
  );
};

const RTL_CODE = `import { DateRangePicker, formatDateRangeDisplay } from "@/components/kamod-ui/date-range-picker";

export const Example = () => (
  <DateRangePicker
    dir="rtl"
    placeholder="اختر نطاقًا"
    labels={{ apply: "تطبيق", cancel: "إلغاء" }}
    locale="ar-SA"
    format={(value) => formatDateRangeDisplay(value, "ar-SA")}
  />
);`;

export const dateRangePickerDocPage = createGenericDocPage({
  title: "Date Range Picker",
  slug: "date-range-picker",
  usageLabel: "Date Range Picker",
  previewCode: BASIC_CODE,
  installationText:
    "Import from `@kamod-ch/ui/date-range-picker`. The picker composes the shared Calendar and Popover primitives.",
  usageText:
    "Use a controlled `value` for confirmed ranges. Changes remain in a draft until Apply is selected; presets use calendar-day arithmetic and require a client-provided `referenceDate` for SSR-safe output.",
  installationExample: {
    code: BASIC_CODE,
    renderPreview: BasicPreview,
  },
  exampleSections: [
    {
      id: "basic",
      title: "Presets with apply/cancel",
      text: "Opening copies the confirmed value into a draft. Presets and day clicks change only the draft until Apply. Pass `referenceDate` from the client so preset math stays SSR-safe.",
      code: BASIC_CODE,
      renderPreview: BasicPreview,
    },
    {
      id: "rtl",
      title: "RTL layout",
      text: "Pass `dir` and a locale-aware `format` callback for right-to-left dashboards.",
      code: RTL_CODE,
      renderPreview: RtlPreview,
    },
  ],
  apiRows: [
    { prop: "value", type: "DateRange | undefined", defaultValue: "controlled range" },
    { prop: "defaultValue", type: "DateRange | undefined", defaultValue: "uncontrolled seed" },
    { prop: "onValueChange", type: "(range: DateRange | undefined) => void", defaultValue: "—" },
    { prop: "placeholder", type: "string", defaultValue: "none — supply for i18n" },
    { prop: "labels.apply / labels.cancel", type: "string", defaultValue: "required" },
    { prop: "validationMessages.*", type: "string", defaultValue: "optional footer hints" },
    { prop: "presets", type: "DateRangePreset[]", defaultValue: "—" },
    { prop: "referenceDate", type: "Date", defaultValue: "required for presets" },
    { prop: "minDate / maxDate", type: "Date", defaultValue: "—" },
    { prop: "disabledDates", type: "CalendarDisabledProp", defaultValue: "—" },
    { prop: "disabled", type: "boolean", defaultValue: "false (trigger)" },
    { prop: "responsiveMonths", type: "boolean", defaultValue: "true (1 month SSR, 2 from md)" },
    { prop: "numberOfMonths", type: "1 | 2", defaultValue: "1 when responsiveMonths=false" },
    { prop: "format", type: "(range) => string", defaultValue: "formatDateRangeDisplay + locale" },
    { prop: "locale / dir", type: "string / ltr|rtl", defaultValue: "—" },
  ],
  accessibilityText:
    'Keyboard navigation and focus management come from the shared Calendar and Popover primitives. Apply is disabled until the draft is a complete, valid range. Footer validation text uses aria-live="polite". Disabled calendar days follow Calendar conventions: individual days are not clickable, and Apply is blocked when any day inside the inclusive draft range is disabled (including min/max bounds). Do not pass both value and defaultValue — controlled value wins and defaultValue is ignored.',
});
