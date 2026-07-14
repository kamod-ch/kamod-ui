import { ComboboxSelect } from "@kamod-ch/ui/combobox";
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

const comboboxOptionSchema = z.object({
  label: z.string().min(1).max(MAX_LABEL_LENGTH),
  value: z.string().min(1).max(MAX_NAME_LENGTH),
});

export const comboboxComponent = defineComponent({
  name: "Combobox",
  description:
    "Searchable single-select bound by name. First args: name, options. Prefer 2–50 options.",
  props: z.object({
    name: z.string().min(1).max(MAX_NAME_LENGTH),
    options: z.array(comboboxOptionSchema).min(1).max(50),
    label: z.string().min(1).max(MAX_LABEL_LENGTH).optional(),
    description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
    required: z.boolean().default(false),
    disabled: z.boolean().default(false),
    placeholder: z.string().max(120).optional(),
    searchPlaceholder: z.string().max(120).optional(),
    emptyText: z.string().max(MAX_LABEL_LENGTH).optional(),
    defaultValue: reactive(z.string().max(MAX_NAME_LENGTH).optional()),
  }),
  component: ({ props }) => {
    const formName = useFormName();
    const field = useStateField(props.name, props.defaultValue);
    const validation = useFormValidation();
    useSetDefaultValue({
      formName,
      componentType: "Combobox",
      name: props.name,
      existingValue: field.value,
      defaultValue: typeof props.defaultValue === "string" ? props.defaultValue : "",
    });
    const error = validation?.getFieldError(props.name);
    const value = typeof field.value === "string" ? field.value : "";
    const control = (
      <ComboboxSelect
        options={props.options}
        value={value || undefined}
        defaultValue={typeof props.defaultValue === "string" ? props.defaultValue : undefined}
        disabled={props.disabled}
        placeholder={props.placeholder}
        searchPlaceholder={props.searchPlaceholder}
        emptyText={props.emptyText}
        triggerClass="w-full min-w-0"
        onValueChange={(next) => {
          const nextValue = Array.isArray(next) ? (next[0] ?? "") : next;
          field.setValue(nextValue);
          if (props.required) {
            validation?.validateField(props.name, nextValue, [{ type: "required" }]);
          }
        }}
      />
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
