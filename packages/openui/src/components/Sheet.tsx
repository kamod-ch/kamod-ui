import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@kamod-ch/ui/sheet";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import {
  DEFAULT_MAX_CHILDREN_PER_NODE,
  MAX_DESCRIPTION_LENGTH,
  MAX_LABEL_LENGTH,
} from "../constants";
import { contentChildUnion } from "./Layout";

export const sheetComponent = defineComponent({
  name: "Sheet",
  description:
    "Side sheet panel. Args: triggerLabel, title, optional description/content, side, defaultOpen, showCloseButton.",
  props: z.object({
    triggerLabel: z.string().min(1).max(MAX_LABEL_LENGTH),
    title: z.string().min(1).max(MAX_LABEL_LENGTH),
    description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
    content: z.array(contentChildUnion).max(DEFAULT_MAX_CHILDREN_PER_NODE).default([]),
    side: z.enum(["left", "right", "top", "bottom"]).default("right"),
    defaultOpen: z.boolean().default(false),
    showCloseButton: z.boolean().default(true),
  }),
  component: ({ props, renderNode }) => (
    <Sheet defaultOpen={props.defaultOpen}>
      <SheetTrigger type="button">{props.triggerLabel}</SheetTrigger>
      <SheetContent side={props.side} showCloseButton={props.showCloseButton}>
        <SheetHeader>
          <SheetTitle>{props.title}</SheetTitle>
          {props.description ? <SheetDescription>{props.description}</SheetDescription> : null}
        </SheetHeader>
        <div class="flex flex-col gap-2 py-2">{renderNode(props.content)}</div>
      </SheetContent>
    </Sheet>
  ),
});
