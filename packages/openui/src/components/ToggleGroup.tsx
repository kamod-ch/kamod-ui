import { ToggleGroup, ToggleGroupItem } from "@kamod-ch/ui/toggle-group";
import {
  defineComponent,
  reactive,
  useFormName,
  useSetDefaultValue,
  useStateField,
} from "@openuidev/react-lang";
import { z } from "zod";
import { MAX_LABEL_LENGTH, MAX_NAME_LENGTH } from "../constants";

const toggleOptionSchema = z.object({
  value: z.string().min(1).max(MAX_NAME_LENGTH),
  label: z.string().min(1).max(MAX_LABEL_LENGTH),
});

export const toggleGroupComponent = defineComponent({
  name: "ToggleGroup",
  description:
    "Single-select toggle group. Args: options [{value, label}], optional name (form-bound string), defaultValue. OpenUI uses type single only.",
  props: z.object({
    name: z.string().min(1).max(MAX_NAME_LENGTH).optional(),
    type: z.enum(["single", "multiple"]).default("single"),
    options: z.array(toggleOptionSchema).min(2).max(12),
    defaultValue: reactive(z.string().max(MAX_NAME_LENGTH).optional()),
  }),
  component: ({ props }) => {
    // OpenUI flattens to single selection for form binding simplicity.
    const type = "single" as const;
    void props.type;

    const bound = Boolean(props.name);
    const formName = useFormName();
    const fieldName = props.name ?? "__openui_toggle_group__";
    const field = useStateField(fieldName, props.defaultValue);
    useSetDefaultValue({
      formName: bound ? formName : undefined,
      componentType: "ToggleGroup",
      name: fieldName,
      existingValue: field.value,
      defaultValue: typeof props.defaultValue === "string" ? props.defaultValue : "",
    });

    const sharedItems = props.options.map((option) => (
      <ToggleGroupItem key={option.value} value={option.value}>
        {option.label}
      </ToggleGroupItem>
    ));

    if (bound) {
      const value = typeof field.value === "string" ? field.value : "";
      return (
        <ToggleGroup
          type={type}
          value={value || undefined}
          defaultValue={typeof props.defaultValue === "string" ? props.defaultValue : undefined}
          onValueChange={(next) => field.setValue(typeof next === "string" ? next : "")}
        >
          {sharedItems}
        </ToggleGroup>
      );
    }

    return (
      <ToggleGroup
        type={type}
        defaultValue={typeof props.defaultValue === "string" ? props.defaultValue : undefined}
      >
        {sharedItems}
      </ToggleGroup>
    );
  },
});
