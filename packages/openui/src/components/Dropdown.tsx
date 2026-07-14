import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "@kamod-ch/ui/dropdown";
import { defineComponent, useTriggerAction } from "@openuidev/react-lang";
import { z } from "zod";
import { MAX_LABEL_LENGTH } from "../constants";
import { fireOpenUIAction, optionalActionSchema } from "../security/action";

const dropdownItemSchema = z.object({
  label: z.string().min(1).max(MAX_LABEL_LENGTH),
  variant: z.enum(["default", "destructive"]).default("default"),
  action: optionalActionSchema,
});

export const dropdownComponent = defineComponent({
  name: "Dropdown",
  description:
    "Menu triggered by a button. Args: triggerLabel, items [{label, variant?, action?}], optional defaultOpen.",
  props: z.object({
    triggerLabel: z.string().min(1).max(MAX_LABEL_LENGTH),
    items: z.array(dropdownItemSchema).min(1).max(20),
    defaultOpen: z.boolean().default(false),
  }),
  component: ({ props }) => {
    const triggerAction = useTriggerAction();
    return (
      <Dropdown defaultOpen={props.defaultOpen}>
        <DropdownTrigger type="button">{props.triggerLabel}</DropdownTrigger>
        <DropdownContent>
          {props.items.map((item) => (
            <DropdownItem
              key={item.label}
              variant={item.variant}
              onClick={() => fireOpenUIAction(triggerAction, item.label, item.action)}
            >
              {item.label}
            </DropdownItem>
          ))}
        </DropdownContent>
      </Dropdown>
    );
  },
});
