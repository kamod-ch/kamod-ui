import { Button } from "@kamod-ch/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@kamod-ch/ui/dialog";
import { defineComponent, useTriggerAction } from "@openuidev/react-lang";
import { z } from "zod";
import {
  DEFAULT_MAX_CHILDREN_PER_NODE,
  MAX_DESCRIPTION_LENGTH,
  MAX_LABEL_LENGTH,
} from "../constants";
import { type KamodOpenUIAction, optionalActionSchema } from "../security/action";
import { buttonVariantSchemaValues } from "../tokens/variants";
import { contentChildUnion } from "./Layout";

const dialogActionSchema = z.object({
  label: z.string().min(1).max(MAX_LABEL_LENGTH),
  variant: z.enum(buttonVariantSchemaValues).default("default"),
  action: optionalActionSchema,
});

function fireAction(
  triggerAction: ReturnType<typeof useTriggerAction>,
  label: string,
  action: KamodOpenUIAction | undefined,
) {
  if (!action) {
    triggerAction(label);
    return;
  }
  if (action.type === "navigate") {
    triggerAction(label, undefined, {
      type: "open_url",
      params: { url: action.target },
    });
    return;
  }
  if (action.type === "submit") {
    triggerAction(label, action.name, {
      type: "submit",
      params: { name: action.name },
    });
    return;
  }
  triggerAction(label, undefined, {
    type: action.name,
    params:
      action.payload && typeof action.payload === "object"
        ? (action.payload as Record<string, unknown>)
        : {},
  });
}

export const dialogComponent = defineComponent({
  name: "Dialog",
  description:
    "Modal dialog. Args: triggerLabel, title, optional description, content children, optional footer actions. Prefer short confirm/cancel actions.",
  props: z.object({
    triggerLabel: z.string().min(1).max(MAX_LABEL_LENGTH),
    title: z.string().min(1).max(MAX_LABEL_LENGTH),
    description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
    content: z.array(contentChildUnion).max(DEFAULT_MAX_CHILDREN_PER_NODE).default([]),
    actions: z.array(dialogActionSchema).max(4).default([]),
    defaultOpen: z.boolean().default(false),
    showCloseButton: z.boolean().default(true),
  }),
  component: ({ props, renderNode }) => {
    const triggerAction = useTriggerAction();
    return (
      <Dialog defaultOpen={props.defaultOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline">
            {props.triggerLabel}
          </Button>
        </DialogTrigger>
        <DialogContent showCloseButton={props.showCloseButton}>
          <DialogHeader>
            <DialogTitle>{props.title}</DialogTitle>
            {props.description ? <DialogDescription>{props.description}</DialogDescription> : null}
          </DialogHeader>
          {props.content.length > 0 ? (
            <div class="flex flex-col gap-2">{renderNode(props.content)}</div>
          ) : null}
          {props.actions.length > 0 ? (
            <DialogFooter>
              {props.actions.map((item) => (
                <DialogClose key={item.label} asChild>
                  <Button
                    type="button"
                    variant={item.variant}
                    onClick={() => fireAction(triggerAction, item.label, item.action)}
                  >
                    {item.label}
                  </Button>
                </DialogClose>
              ))}
            </DialogFooter>
          ) : null}
        </DialogContent>
      </Dialog>
    );
  },
});
