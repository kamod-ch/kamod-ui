import { Field } from "@kamod-ch/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@kamod-ch/ui/select";
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

const richSelectOptionSchema = z.object({
  value: z.string().min(1).max(MAX_NAME_LENGTH),
  label: z.string().min(1).max(MAX_LABEL_LENGTH),
  disabled: z.boolean().optional(),
});

export const richSelectComponent = defineComponent({
  name: "RichSelect",
  description:
    "Styled single-select dropdown bound by name (not NativeSelect). Args: name, options. Prefer 2–50 options.",
  props: z.object({
    name: z.string().min(1).max(MAX_NAME_LENGTH),
    options: z.array(richSelectOptionSchema).min(1).max(50),
    label: z.string().min(1).max(MAX_LABEL_LENGTH).optional(),
    description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
    required: z.boolean().default(false),
    disabled: z.boolean().default(false),
    placeholder: z.string().max(120).optional(),
    defaultValue: reactive(z.string().max(MAX_NAME_LENGTH).optional()),
  }),
  component: ({ props }) => {
    const formName = useFormName();
    const field = useStateField(props.name, props.defaultValue);
    const validation = useFormValidation();
    useSetDefaultValue({
      formName,
      componentType: "RichSelect",
      name: props.name,
      existingValue: field.value,
      defaultValue: typeof props.defaultValue === "string" ? props.defaultValue : "",
    });
    const error = validation?.getFieldError(props.name);
    const value = typeof field.value === "string" ? field.value : "";
    const selectedLabel = props.options.find((option) => option.value === value)?.label;
    const control = (
      <Select
        value={value || undefined}
        defaultValue={typeof props.defaultValue === "string" ? props.defaultValue : undefined}
        onValueChange={(next) => {
          field.setValue(next);
          if (props.required) {
            validation?.validateField(props.name, next, [{ type: "required" }]);
          }
        }}
      >
        <SelectTrigger disabled={props.disabled} aria-invalid={error ? true : undefined}>
          <SelectValue placeholder={props.placeholder}>{selectedLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {props.options.map((option) => (
            <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
