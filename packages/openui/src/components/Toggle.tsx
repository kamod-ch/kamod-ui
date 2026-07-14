import { Toggle } from "@kamod-ch/ui/toggle";
import {
  defineComponent,
  reactive,
  useFormName,
  useSetDefaultValue,
  useStateField,
} from "@openuidev/react-lang";
import { z } from "zod";
import { MAX_LABEL_LENGTH, MAX_NAME_LENGTH } from "../constants";

export const toggleComponent = defineComponent({
  name: "Toggle",
  description:
    "Pressable toggle. Args: label, optional name (form-bound boolean), defaultPressed, disabled.",
  props: z.object({
    name: z.string().min(1).max(MAX_NAME_LENGTH).optional(),
    label: z.string().min(1).max(MAX_LABEL_LENGTH),
    defaultPressed: reactive(z.boolean().optional()),
    disabled: z.boolean().default(false),
  }),
  component: ({ props }) => {
    const bound = Boolean(props.name);
    const formName = useFormName();
    const fieldName = props.name ?? "__openui_toggle__";
    const field = useStateField(fieldName, props.defaultPressed);
    useSetDefaultValue({
      formName: bound ? formName : undefined,
      componentType: "Toggle",
      name: fieldName,
      existingValue: field.value,
      defaultValue: Boolean(props.defaultPressed),
    });

    if (bound) {
      return (
        <Toggle
          disabled={props.disabled}
          pressed={Boolean(field.value)}
          onPressedChange={(next) => field.setValue(next)}
        >
          {props.label}
        </Toggle>
      );
    }

    return (
      <Toggle disabled={props.disabled} defaultPressed={Boolean(props.defaultPressed)}>
        {props.label}
      </Toggle>
    );
  },
});
