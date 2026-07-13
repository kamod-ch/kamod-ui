import { Button } from "@kamod-ch/ui/button";
import { defineComponent, useTriggerAction } from "@openuidev/react-lang";
import { z } from "zod";
import { MAX_LABEL_LENGTH } from "../constants";
import { optionalActionSchema } from "../security/action";
import {
  buttonSizeSchemaValues,
  buttonSizeToKamod,
  buttonVariantSchemaValues,
} from "../tokens/variants";

export const buttonComponent = defineComponent({
  name: "Button",
  description:
    "Triggers a predefined application action. Args: label, variant, size, disabled, action. Do not invent JavaScript handlers.",
  props: z.object({
    label: z.string().min(1).max(MAX_LABEL_LENGTH),
    variant: z.enum(buttonVariantSchemaValues).default("default"),
    size: z.enum(buttonSizeSchemaValues).default("md"),
    disabled: z.boolean().default(false),
    action: optionalActionSchema,
  }),
  component: ({ props }) => {
    const triggerAction = useTriggerAction();
    return (
      <Button
        variant={props.variant}
        size={buttonSizeToKamod[props.size]}
        disabled={props.disabled}
        type="button"
        onClick={() => {
          if (!props.action) {
            triggerAction(props.label);
            return;
          }
          if (props.action.type === "navigate") {
            triggerAction(props.label, undefined, {
              type: "open_url",
              params: { url: props.action.target },
            });
            return;
          }
          if (props.action.type === "submit") {
            triggerAction(props.label, props.action.name, {
              type: "submit",
              params: { name: props.action.name },
            });
            return;
          }
          triggerAction(props.label, undefined, {
            type: props.action.name,
            params:
              props.action.payload && typeof props.action.payload === "object"
                ? (props.action.payload as Record<string, unknown>)
                : {},
          });
        }}
      >
        {props.label}
      </Button>
    );
  },
});
