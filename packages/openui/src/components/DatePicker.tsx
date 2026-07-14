import { DatePicker } from "@kamod-ch/ui/date-picker";
import { Field } from "@kamod-ch/ui/field";
import {
  defineComponent,
  reactive,
  useFormName,
  useFormValidation,
  useSetDefaultValue,
  useStateField,
} from "@openuidev/react-lang";
import { z } from "zod";
import { MAX_DESCRIPTION_LENGTH, MAX_LABEL_LENGTH, MAX_NAME_LENGTH } from "../constants";

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

export const datePickerComponent = defineComponent({
  name: "DatePicker",
  description:
    "Date field bound by name. Store and pass ISO date strings (YYYY-MM-DD). Use inside Form or Field.",
  props: z.object({
    name: z.string().min(1).max(MAX_NAME_LENGTH),
    label: z.string().min(1).max(MAX_LABEL_LENGTH).optional(),
    description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
    required: z.boolean().default(false),
    disabled: z.boolean().default(false),
    placeholder: z.string().max(120).optional(),
    defaultValue: reactive(z.string().regex(ISO_DATE_RE).optional()),
  }),
  component: ({ props }) => {
    const formName = useFormName();
    const field = useStateField(props.name, props.defaultValue);
    const validation = useFormValidation();
    useSetDefaultValue({
      formName,
      componentType: "DatePicker",
      name: props.name,
      existingValue: field.value,
      defaultValue: typeof props.defaultValue === "string" ? props.defaultValue : "",
    });
    const error = validation?.getFieldError(props.name);
    const isoValue = typeof field.value === "string" ? field.value : "";
    const control = (
      <div
        class={props.disabled ? "pointer-events-none opacity-50" : undefined}
        aria-disabled={props.disabled || undefined}
      >
        <DatePicker
          value={parseIsoDate(isoValue)}
          defaultValue={parseIsoDate(props.defaultValue)}
          placeholder={props.placeholder}
          onValueChange={(next) => {
            if (props.disabled) return;
            const nextIso = toIsoDate(next);
            field.setValue(nextIso);
            if (props.required) {
              validation?.validateField(props.name, nextIso, [{ type: "required" }]);
            }
          }}
        />
      </div>
    );
    if (!props.label) return control;
    return (
      <Field
        label={props.label}
        description={props.description}
        error={error}
        required={props.required}
        disabled={props.disabled}
        invalid={Boolean(error)}
      >
        {control}
      </Field>
    );
  },
});
