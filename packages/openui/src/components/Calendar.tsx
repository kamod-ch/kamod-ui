import { Calendar } from "@kamod-ch/ui/calendar";
import {
  defineComponent,
  reactive,
  useFormName,
  useSetDefaultValue,
  useStateField,
} from "@openuidev/react-lang";
import { z } from "zod";
import { MAX_NAME_LENGTH } from "../constants";

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function parseIsoDate(value: unknown): Date | undefined {
  if (typeof value !== "string" || !ISO_DATE_RE.test(value)) return undefined;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function toIsoDate(date: Date | undefined): string {
  if (!date || Number.isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export const calendarComponent = defineComponent({
  name: "Calendar",
  description:
    "Single-date calendar. Args: optional name (form-bound ISO YYYY-MM-DD), defaultSelected ISO string, size default|sm. Range mode is not supported in OpenUI.",
  props: z.object({
    name: z.string().min(1).max(MAX_NAME_LENGTH).optional(),
    mode: z.literal("single").default("single"),
    defaultSelected: reactive(z.string().regex(ISO_DATE_RE).optional()),
    size: z.enum(["default", "sm"]).default("default"),
  }),
  component: ({ props }) => {
    const bound = Boolean(props.name);
    const formName = useFormName();
    const fieldName = props.name ?? "__openui_calendar__";
    const field = useStateField(fieldName, props.defaultSelected);
    useSetDefaultValue({
      formName: bound ? formName : undefined,
      componentType: "Calendar",
      name: fieldName,
      existingValue: field.value,
      defaultValue: typeof props.defaultSelected === "string" ? props.defaultSelected : "",
    });

    const isoValue =
      typeof field.value === "string"
        ? field.value
        : typeof props.defaultSelected === "string"
          ? props.defaultSelected
          : "";
    const selected = parseIsoDate(isoValue);

    return (
      <Calendar
        mode="single"
        size={props.size}
        selected={selected}
        onSelect={(next) => {
          const date = next instanceof Date ? next : undefined;
          field.setValue(toIsoDate(date));
        }}
      />
    );
  },
});
