import { Button } from "@kamod-ch/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@kamod-ch/ui/drawer";
import { defineComponent, useTriggerAction } from "@openuidev/react-lang";
import { z } from "zod";
import {
  DEFAULT_MAX_CHILDREN_PER_NODE,
  MAX_DESCRIPTION_LENGTH,
  MAX_LABEL_LENGTH,
} from "../constants";
import { fireOpenUIAction, optionalActionSchema } from "../security/action";
import { buttonVariantSchemaValues } from "../tokens/variants";
import { contentChildUnion } from "./Layout";

const footerActionSchema = z.object({
  label: z.string().min(1).max(MAX_LABEL_LENGTH),
  variant: z.enum(buttonVariantSchemaValues).default("default"),
  action: optionalActionSchema,
});

export const drawerComponent = defineComponent({
  name: "Drawer",
  description:
    "Edge drawer panel. Args: triggerLabel, title, optional description/content/footerActions, direction, defaultOpen.",
  props: z.object({
    triggerLabel: z.string().min(1).max(MAX_LABEL_LENGTH),
    title: z.string().min(1).max(MAX_LABEL_LENGTH),
    description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
    content: z.array(contentChildUnion).max(DEFAULT_MAX_CHILDREN_PER_NODE).default([]),
    direction: z.enum(["bottom", "top", "left", "right"]).default("bottom"),
    defaultOpen: z.boolean().default(false),
    footerActions: z.array(footerActionSchema).max(4).optional(),
  }),
  component: ({ props, renderNode }) => {
    const triggerAction = useTriggerAction();
    return (
      <Drawer direction={props.direction} defaultOpen={props.defaultOpen}>
        <DrawerTrigger type="button">{props.triggerLabel}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{props.title}</DrawerTitle>
            {props.description ? <DrawerDescription>{props.description}</DrawerDescription> : null}
          </DrawerHeader>
          <div class="flex flex-col gap-2 px-4 pb-2">{renderNode(props.content)}</div>
          {props.footerActions && props.footerActions.length > 0 ? (
            <DrawerFooter>
              {props.footerActions.map((item) => (
                <Button
                  key={item.label}
                  type="button"
                  variant={item.variant}
                  onClick={() => fireOpenUIAction(triggerAction, item.label, item.action)}
                >
                  {item.label}
                </Button>
              ))}
            </DrawerFooter>
          ) : null}
        </DrawerContent>
      </Drawer>
    );
  },
});
