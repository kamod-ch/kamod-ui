import { Field } from "@kamod-ch/ui/field";
import { RadioGroup } from "@kamod-ch/ui/radio-group";
import { SelectableCard } from "@kamod-ch/ui/selectable-card";
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

const selectableOptionSchema = z.object({
  value: z.string().min(1).max(MAX_NAME_LENGTH),
  label: z.string().min(1).max(MAX_LABEL_LENGTH),
  description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
});

export const selectableCardComponent = defineComponent({
  name: "SelectableCard",
  description:
    "Card-style radio choices bound by name. Args: name, options [{value, label, description?}], optional label/defaultValue.",
  props: z.object({
    name: z.string().min(1).max(MAX_NAME_LENGTH),
    options: z.array(selectableOptionSchema).min(2).max(12),
    label: z.string().min(1).max(MAX_LABEL_LENGTH).optional(),
    defaultValue: reactive(z.string().max(MAX_NAME_LENGTH).optional()),
  }),
  component: ({ props }) => {
    const formName = useFormName();
    const field = useStateField(props.name, props.defaultValue);
    const validation = useFormValidation();
    useSetDefaultValue({
      formName,
      componentType: "SelectableCard",
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
        onValueChange={(next) => field.setValue(next)}
        class="grid gap-2"
      >
        {props.options.map((option) => (
          <SelectableCard key={option.value} value={option.value}>
            <div class="text-sm font-medium">{option.label}</div>
            {option.description ? (
              <p class="text-muted-foreground mt-1 text-xs">{option.description}</p>
            ) : null}
          </SelectableCard>
        ))}
      </RadioGroup>
    );
    if (!props.label) return control;
    return (
      <Field label={props.label} error={error} invalid={Boolean(error)}>
        {control}
      </Field>
    );
  },
});
