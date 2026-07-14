import { Field } from "@kamod-ch/ui/field";
import { Slider } from "@kamod-ch/ui/slider";
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

export const sliderComponent = defineComponent({
  name: "Slider",
  description:
    "Numeric slider bound by name. Args: name, optional min/max/step/defaultValue. Prefer single-thumb ranges.",
  props: z.object({
    name: z.string().min(1).max(MAX_NAME_LENGTH),
    label: z.string().min(1).max(MAX_LABEL_LENGTH).optional(),
    description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
    min: z.number().default(0),
    max: z.number().default(100),
    step: z.number().positive().default(1),
    defaultValue: reactive(z.number().optional()),
    disabled: z.boolean().default(false),
  }),
  component: ({ props }) => {
    const formName = useFormName();
    const field = useStateField(props.name, props.defaultValue);
    const validation = useFormValidation();
    const fallback =
      typeof props.defaultValue === "number"
        ? props.defaultValue
        : Math.min(props.max, Math.max(props.min, props.min));
    useSetDefaultValue({
      formName,
      componentType: "Slider",
      name: props.name,
      existingValue: field.value,
      defaultValue: fallback,
    });
    const error = validation?.getFieldError(props.name);
    const numericValue = typeof field.value === "number" ? field.value : fallback;
    const control = (
      <Slider
        name={props.name}
        min={props.min}
        max={props.max}
        step={props.step}
        disabled={props.disabled}
        value={numericValue}
        defaultValue={typeof props.defaultValue === "number" ? props.defaultValue : undefined}
        aria-invalid={error ? true : undefined}
        onValueChange={(values) => {
          const next = values[0] ?? fallback;
          field.setValue(next);
        }}
      />
    );
    if (!props.label) return control;
    return (
      <Field
        label={props.label}
        description={props.description}
        error={error}
        disabled={props.disabled}
        invalid={Boolean(error)}
      >
        {control}
      </Field>
    );
  },
});
