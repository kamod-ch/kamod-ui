import { Button } from "@kamod-ch/ui/button";
import { Checkbox } from "@kamod-ch/ui/checkbox";
import { Field } from "@kamod-ch/ui/field";
import { Input } from "@kamod-ch/ui/input";
import { NativeSelect, NativeSelectOption } from "@kamod-ch/ui/native-select";
import { Switch } from "@kamod-ch/ui/switch";
import { Textarea } from "@kamod-ch/ui/textarea";
import {
  defineComponent,
  FormNameContext,
  FormValidationContext,
  reactive,
  useCreateFormValidation,
  useFormName,
  useFormValidation,
  useSetDefaultValue,
  useStateField,
  useTriggerAction,
} from "@openuidev/react-lang";
import type { ComponentChildren } from "preact";
import { z } from "zod";
import {
  DEFAULT_MAX_CHILDREN_PER_NODE,
  MAX_DESCRIPTION_LENGTH,
  MAX_LABEL_LENGTH,
  MAX_NAME_LENGTH,
} from "../constants";
import { alertComponent } from "./Alert";
import { comboboxComponent } from "./Combobox";
import { datePickerComponent } from "./DatePicker";
import { inputGroupComponent } from "./InputGroup";
import { inputOtpComponent } from "./InputOtp";
import { radioGroupComponent } from "./RadioGroup";
import { richSelectComponent } from "./RichSelect";
import { selectableCardComponent } from "./SelectableCard";
import { sliderComponent } from "./Slider";
import { textComponent } from "./Text";
import { toggleComponent } from "./Toggle";
import { toggleGroupComponent } from "./ToggleGroup";

const inputTypeSchema = z.enum(["text", "email", "password", "number"]).default("text");

export const inputComponent = defineComponent({
  name: "Input",
  description:
    "Single-line text field bound by name. Use inside Form or Field. Do not pass regex validators.",
  props: z.object({
    name: z.string().min(1).max(MAX_NAME_LENGTH),
    label: z.string().min(1).max(MAX_LABEL_LENGTH).optional(),
    type: inputTypeSchema,
    placeholder: z.string().max(200).optional(),
    description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
    required: z.boolean().default(false),
    disabled: z.boolean().default(false),
    defaultValue: reactive(z.string().max(2000).optional()),
  }),
  component: ({ props }) => {
    const formName = useFormName();
    const field = useStateField(props.name, props.defaultValue);
    const validation = useFormValidation();
    useSetDefaultValue({
      formName,
      componentType: "Input",
      name: props.name,
      existingValue: field.value,
      defaultValue: typeof props.defaultValue === "string" ? props.defaultValue : "",
    });
    const error = validation?.getFieldError(props.name);
    const control = (
      <Input
        name={props.name}
        type={props.type}
        placeholder={props.placeholder}
        disabled={props.disabled}
        required={props.required}
        value={typeof field.value === "string" ? field.value : ""}
        aria-invalid={error ? true : undefined}
        onInput={(event) => {
          const next = (event.currentTarget as HTMLInputElement).value;
          field.setValue(next);
          if (props.required) {
            validation?.validateField(props.name, next, [{ type: "required" }]);
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

export const textareaComponent = defineComponent({
  name: "Textarea",
  description: "Multi-line text field bound by name. Use for messages and longer answers.",
  props: z.object({
    name: z.string().min(1).max(MAX_NAME_LENGTH),
    label: z.string().min(1).max(MAX_LABEL_LENGTH).optional(),
    placeholder: z.string().max(200).optional(),
    description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
    required: z.boolean().default(false),
    disabled: z.boolean().default(false),
    rows: z.number().int().min(2).max(12).default(4),
    defaultValue: reactive(z.string().max(4000).optional()),
  }),
  component: ({ props }) => {
    const formName = useFormName();
    const field = useStateField(props.name, props.defaultValue);
    const validation = useFormValidation();
    useSetDefaultValue({
      formName,
      componentType: "Textarea",
      name: props.name,
      existingValue: field.value,
      defaultValue: typeof props.defaultValue === "string" ? props.defaultValue : "",
    });
    const error = validation?.getFieldError(props.name);
    const control = (
      <Textarea
        name={props.name}
        placeholder={props.placeholder}
        disabled={props.disabled}
        required={props.required}
        rows={props.rows}
        value={typeof field.value === "string" ? field.value : ""}
        aria-invalid={error ? true : undefined}
        onInput={(event) => {
          const next = (event.currentTarget as HTMLTextAreaElement).value;
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
        required={props.required}
        disabled={props.disabled}
        invalid={Boolean(error)}
      >
        {control}
      </Field>
    );
  },
});

const selectOptionSchema = z.object({
  value: z.string().min(1).max(MAX_NAME_LENGTH),
  label: z.string().min(1).max(MAX_LABEL_LENGTH),
});

export const selectComponent = defineComponent({
  name: "Select",
  description: "Single-select dropdown with a flat options list. Prefer 2–20 options.",
  props: z.object({
    name: z.string().min(1).max(MAX_NAME_LENGTH),
    label: z.string().min(1).max(MAX_LABEL_LENGTH).optional(),
    description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
    required: z.boolean().default(false),
    disabled: z.boolean().default(false),
    placeholder: z.string().max(120).optional(),
    options: z.array(selectOptionSchema).min(1).max(50),
    defaultValue: reactive(z.string().max(MAX_NAME_LENGTH).optional()),
  }),
  component: ({ props }) => {
    const formName = useFormName();
    const field = useStateField(props.name, props.defaultValue);
    const validation = useFormValidation();
    useSetDefaultValue({
      formName,
      componentType: "Select",
      name: props.name,
      existingValue: field.value,
      defaultValue: typeof props.defaultValue === "string" ? props.defaultValue : "",
    });
    const error = validation?.getFieldError(props.name);
    const control = (
      <NativeSelect
        name={props.name}
        disabled={props.disabled}
        required={props.required}
        value={typeof field.value === "string" ? field.value : ""}
        aria-invalid={error ? true : undefined}
        onChange={(event) => {
          field.setValue((event.currentTarget as HTMLSelectElement).value);
        }}
      >
        {props.placeholder ? (
          <NativeSelectOption value="" disabled>
            {props.placeholder}
          </NativeSelectOption>
        ) : null}
        {props.options.map((option) => (
          <NativeSelectOption key={option.value} value={option.value}>
            {option.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
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

export const checkboxComponent = defineComponent({
  name: "Checkbox",
  description:
    "Boolean checkbox bound by name. Use for consent and toggles that need confirmation.",
  props: z.object({
    name: z.string().min(1).max(MAX_NAME_LENGTH),
    label: z.string().min(1).max(MAX_LABEL_LENGTH),
    description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
    required: z.boolean().default(false),
    disabled: z.boolean().default(false),
    defaultChecked: reactive(z.boolean().optional()),
  }),
  component: ({ props }) => {
    const formName = useFormName();
    const field = useStateField(props.name, props.defaultChecked);
    useSetDefaultValue({
      formName,
      componentType: "Checkbox",
      name: props.name,
      existingValue: field.value,
      defaultValue: Boolean(props.defaultChecked),
    });
    return (
      <Field description={props.description} required={props.required} disabled={props.disabled}>
        <label class="flex items-center gap-2 text-sm">
          <Checkbox
            name={props.name}
            disabled={props.disabled}
            required={props.required}
            checked={Boolean(field.value)}
            onCheckedChange={(checked) => field.setValue(checked === true)}
          />
          <span>{props.label}</span>
        </label>
      </Field>
    );
  },
});

export const switchComponent = defineComponent({
  name: "Switch",
  description: "Boolean switch bound by name. Prefer for settings that take effect immediately.",
  props: z.object({
    name: z.string().min(1).max(MAX_NAME_LENGTH),
    label: z.string().min(1).max(MAX_LABEL_LENGTH),
    description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
    disabled: z.boolean().default(false),
    defaultChecked: reactive(z.boolean().optional()),
  }),
  component: ({ props }) => {
    const formName = useFormName();
    const field = useStateField(props.name, props.defaultChecked);
    useSetDefaultValue({
      formName,
      componentType: "Switch",
      name: props.name,
      existingValue: field.value,
      defaultValue: Boolean(props.defaultChecked),
    });
    return (
      <Field description={props.description} disabled={props.disabled}>
        <div class="flex items-center justify-between gap-3">
          <span class="text-sm font-medium">{props.label}</span>
          <Switch
            disabled={props.disabled}
            checked={Boolean(field.value)}
            onCheckedChange={(checked) => field.setValue(checked)}
          />
        </div>
      </Field>
    );
  },
});

export const fieldComponent = defineComponent({
  name: "Field",
  description:
    "Labeled field wrapper. Prefer putting a single Input, Textarea, Select, Checkbox, or Switch inside.",
  props: z.object({
    label: z.string().min(1).max(MAX_LABEL_LENGTH),
    description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
    required: z.boolean().default(false),
    children: z
      .array(
        z.union([
          inputComponent.ref,
          textareaComponent.ref,
          selectComponent.ref,
          checkboxComponent.ref,
          switchComponent.ref,
          radioGroupComponent.ref,
          inputOtpComponent.ref,
          inputGroupComponent.ref,
          selectableCardComponent.ref,
          toggleComponent.ref,
          toggleGroupComponent.ref,
          datePickerComponent.ref,
          comboboxComponent.ref,
          richSelectComponent.ref,
          sliderComponent.ref,
        ]),
      )
      .min(1)
      .max(2),
  }),
  component: ({ props, renderNode }) => (
    <Field label={props.label} description={props.description} required={props.required}>
      {renderNode(props.children)}
    </Field>
  ),
});

export const submitButtonComponent = defineComponent({
  name: "SubmitButton",
  description: "Submits the nearest Form. Label should describe the outcome.",
  props: z.object({
    label: z.string().min(1).max(MAX_LABEL_LENGTH).default("Submit"),
    variant: z.enum(["default", "secondary", "outline"]).default("default"),
    disabled: z.boolean().default(false),
  }),
  component: ({ props }) => {
    const formName = useFormName();
    const triggerAction = useTriggerAction();
    const validation = useFormValidation();
    return (
      <Button
        type="submit"
        variant={props.variant}
        disabled={props.disabled}
        onClick={(event) => {
          event.preventDefault();
          if (validation && !validation.validateForm()) return;
          triggerAction(props.label, formName, {
            type: "submit",
            params: { name: formName ?? "form" },
          });
        }}
      >
        {props.label}
      </Button>
    );
  },
});

function FormValidationBridge({
  value,
  children,
}: {
  value: ReturnType<typeof useCreateFormValidation>;
  children: ComponentChildren;
}) {
  return <FormValidationContext.Provider value={value}>{children}</FormValidationContext.Provider>;
}

export const formComponent = defineComponent({
  name: "Form",
  description:
    "Form container that groups fields and a SubmitButton. Use a unique name. Prefer simple field lists.",
  props: z.object({
    name: z.string().min(1).max(MAX_NAME_LENGTH),
    children: z
      .array(
        z.union([
          fieldComponent.ref,
          inputComponent.ref,
          textareaComponent.ref,
          selectComponent.ref,
          checkboxComponent.ref,
          switchComponent.ref,
          radioGroupComponent.ref,
          inputOtpComponent.ref,
          inputGroupComponent.ref,
          selectableCardComponent.ref,
          toggleComponent.ref,
          toggleGroupComponent.ref,
          datePickerComponent.ref,
          comboboxComponent.ref,
          richSelectComponent.ref,
          sliderComponent.ref,
          submitButtonComponent.ref,
          textComponent.ref,
          alertComponent.ref,
        ]),
      )
      .max(DEFAULT_MAX_CHILDREN_PER_NODE)
      .default([]),
  }),
  component: ({ props, renderNode }) => {
    const validation = useCreateFormValidation();
    return (
      <FormNameContext.Provider value={props.name}>
        <form
          data-slot="openui-form"
          name={props.name}
          class="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <FormValidationBridge value={validation}>
            {renderNode(props.children)}
          </FormValidationBridge>
        </form>
      </FormNameContext.Provider>
    );
  },
});
