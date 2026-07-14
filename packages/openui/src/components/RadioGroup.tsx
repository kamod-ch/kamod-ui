import { Field } from "@kamod-ch/ui/field";
import { RadioGroup, RadioGroupItem } from "@kamod-ch/ui/radio-group";
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

const radioOptionSchema = z.object({
  value: z.string().min(1).max(MAX_NAME_LENGTH),
  label: z.string().min(1).max(MAX_LABEL_LENGTH),
});

export const radioGroupComponent = defineComponent({
  name: "RadioGroup",
  description:
    "Single-choice radio list bound by name. First args: name, options. Prefer 2–12 options.",
  props: z.object({
    name: z.string().min(1).max(MAX_NAME_LENGTH),
    options: z.array(radioOptionSchema).min(2).max(12),
    label: z.string().min(1).max(MAX_LABEL_LENGTH).optional(),
    description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
    required: z.boolean().default(false),
    disabled: z.boolean().default(false),
    defaultValue: reactive(z.string().max(MAX_NAME_LENGTH).optional()),
  }),
  component: ({ props }) => {
    const formName = useFormName();
    const field = useStateField(props.name, props.defaultValue);
    const validation = useFormValidation();
    useSetDefaultValue({
      formName,
      componentType: "RadioGroup",
      name: props.name,
      existingValue: field.value,
      defaultValue: typeof props.defaultValue === "string" ? props.defaultValue : "",
    });
    const error = validation?.getFieldError(props.name);
    const value = typeof field.value === "string" ? field.value : "";
    const control = (
      <RadioGroup
        name={props.name}
        value={value || undefined}
        defaultValue={typeof props.defaultValue === "string" ? props.defaultValue : undefined}
        onValueChange={(next) => {
          field.setValue(next);
          if (props.required) {
            validation?.validateField(props.name, next, [{ type: "required" }]);
          }
        }}
        class="flex flex-col gap-2"
      >
        {props.options.map((option) => (
          <RadioGroupItem key={option.value} value={option.value} disabled={props.disabled}>
            {option.label}
          </RadioGroupItem>
        ))}
      </RadioGroup>
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
