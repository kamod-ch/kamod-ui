import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@kamod-ch/ui/context-menu";
import { defineComponent, useTriggerAction } from "@openuidev/react-lang";
import { z } from "zod";
import { MAX_LABEL_LENGTH } from "../constants";
import { fireOpenUIAction, optionalActionSchema } from "../security/action";

const contextItemSchema = z.object({
  label: z.string().min(1).max(MAX_LABEL_LENGTH),
  action: optionalActionSchema,
  variant: z.enum(["default", "destructive"]).default("default"),
});

export const contextMenuComponent = defineComponent({
  name: "ContextMenu",
  description:
    "Right-click (or long-press) menu. Args: triggerLabel, items [{label, action?, variant?}]. Items fire host actions.",
  props: z.object({
    triggerLabel: z.string().min(1).max(MAX_LABEL_LENGTH),
    items: z.array(contextItemSchema).min(1).max(20),
  }),
  component: ({ props }) => {
    const triggerAction = useTriggerAction();
    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <span class="inline-flex cursor-context-menu rounded-md border border-dashed px-3 py-2 text-sm">
            {props.triggerLabel}
          </span>
        </ContextMenuTrigger>
        <ContextMenuContent>
          {props.items.map((item) => (
            <ContextMenuItem
              key={item.label}
              variant={item.variant}
              onClick={() => fireOpenUIAction(triggerAction, item.label, item.action)}
            >
              {item.label}
            </ContextMenuItem>
          ))}
        </ContextMenuContent>
      </ContextMenu>
    );
  },
});
