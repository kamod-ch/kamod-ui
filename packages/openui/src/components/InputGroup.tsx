import { Field } from "@kamod-ch/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@kamod-ch/ui/input-group";
import {
  defineComponent,
  reactive,
  useFormName,
  useFormValidation,
  useSetDefaultValue,
  useStateField,
} from "@openuidev/react-lang";
import { z } from "zod";
import { MAX_LABEL_LENGTH, MAX_NAME_LENGTH } from "../constants";

export const inputGroupComponent = defineComponent({
  name: "InputGroup",
  description:
    "Text input with prefix/suffix addons, bound by name. Args: name, optional label/prefix/suffix/placeholder/disabled/defaultValue.",
  props: z.object({
    name: z.string().min(1).max(MAX_NAME_LENGTH),
    label: z.string().min(1).max(MAX_LABEL_LENGTH).optional(),
    prefix: z.string().max(MAX_LABEL_LENGTH).optional(),
    suffix: z.string().max(MAX_LABEL_LENGTH).optional(),
    placeholder: z.string().max(200).optional(),
    disabled: z.boolean().default(false),
    defaultValue: reactive(z.string().max(2000).optional()),
  }),
  component: ({ props }) => {
    const formName = useFormName();
    const field = useStateField(props.name, props.defaultValue);
    const validation = useFormValidation();
    useSetDefaultValue({
      formName,
      componentType: "InputGroup",
      name: props.name,
      existingValue: field.value,
      defaultValue: typeof props.defaultValue === "string" ? props.defaultValue : "",
    });
    const error = validation?.getFieldError(props.name);
    const control = (
      <InputGroup>
        {props.prefix ? (
          <InputGroupAddon align="inline-start">
            <InputGroupText>{props.prefix}</InputGroupText>
          </InputGroupAddon>
        ) : null}
        <InputGroupInput
          name={props.name}
          placeholder={props.placeholder}
          disabled={props.disabled}
          value={typeof field.value === "string" ? field.value : ""}
          aria-invalid={error ? true : undefined}
          onInput={(event) => {
            field.setValue((event.currentTarget as HTMLInputElement).value);
          }}
        />
        {props.suffix ? (
          <InputGroupAddon align="inline-end">
            <InputGroupText>{props.suffix}</InputGroupText>
          </InputGroupAddon>
        ) : null}
      </InputGroup>
    );
    if (!props.label) return control;
    return (
      <Field label={props.label} error={error} disabled={props.disabled} invalid={Boolean(error)}>
        {control}
      </Field>
    );
  },
});
