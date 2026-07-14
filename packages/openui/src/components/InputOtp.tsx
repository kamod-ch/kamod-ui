import { Field } from "@kamod-ch/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@kamod-ch/ui/input-otp";
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

export const inputOtpComponent = defineComponent({
  name: "InputOtp",
  description:
    "One-time-code input bound by name. Args: name, length 4–8 (default 6), optional label/disabled/defaultValue.",
  props: z.object({
    name: z.string().min(1).max(MAX_NAME_LENGTH),
    length: z.number().int().min(4).max(8).default(6),
    label: z.string().min(1).max(MAX_LABEL_LENGTH).optional(),
    disabled: z.boolean().default(false),
    defaultValue: reactive(z.string().max(8).optional()),
  }),
  component: ({ props }) => {
    const formName = useFormName();
    const field = useStateField(props.name, props.defaultValue);
    const validation = useFormValidation();
    useSetDefaultValue({
      formName,
      componentType: "InputOtp",
      name: props.name,
      existingValue: field.value,
      defaultValue: typeof props.defaultValue === "string" ? props.defaultValue : "",
    });
    const error = validation?.getFieldError(props.name);
    const value = typeof field.value === "string" ? field.value : "";
    const slots = Array.from({ length: props.length }, (_, index) => (
      <InputOTPSlot key={index} index={index} />
    ));
    const control = (
      <InputOTP
        name={props.name}
        maxLength={props.length}
        disabled={props.disabled}
        value={value}
        aria-invalid={error ? true : undefined}
        onValueChange={(next) => field.setValue(next)}
      >
        <InputOTPGroup>{slots}</InputOTPGroup>
      </InputOTP>
    );
    if (!props.label) return control;
    return (
      <Field label={props.label} error={error} disabled={props.disabled} invalid={Boolean(error)}>
        {control}
      </Field>
    );
  },
});
