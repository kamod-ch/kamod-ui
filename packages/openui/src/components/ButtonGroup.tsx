import { Button } from "@kamod-ch/ui/button";
import { ButtonGroup } from "@kamod-ch/ui/button-group";
import { defineComponent, useTriggerAction } from "@openuidev/react-lang";
import { z } from "zod";
import { MAX_LABEL_LENGTH } from "../constants";
import { fireOpenUIAction, optionalActionSchema } from "../security/action";
import {
  buttonSizeSchemaValues,
  buttonSizeToKamod,
  buttonVariantSchemaValues,
} from "../tokens/variants";

const buttonGroupItemSchema = z.object({
  label: z.string().min(1).max(MAX_LABEL_LENGTH),
  variant: z.enum(buttonVariantSchemaValues).default("outline"),
  size: z.enum(buttonSizeSchemaValues).default("md"),
  action: optionalActionSchema,
});

export const buttonGroupComponent = defineComponent({
  name: "ButtonGroup",
  description:
    "Grouped action buttons. Args: buttons [{label, variant?, size?, action?}], optional orientation.",
  props: z.object({
    buttons: z.array(buttonGroupItemSchema).min(1).max(8),
    orientation: z.enum(["horizontal", "vertical"]).default("horizontal"),
  }),
  component: ({ props }) => {
    const triggerAction = useTriggerAction();
    return (
      <ButtonGroup orientation={props.orientation}>
        {props.buttons.map((item) => (
          <Button
            key={item.label}
            type="button"
            variant={item.variant}
            size={buttonSizeToKamod[item.size]}
            onClick={() => fireOpenUIAction(triggerAction, item.label, item.action)}
          >
            {item.label}
          </Button>
        ))}
      </ButtonGroup>
    );
  },
});
