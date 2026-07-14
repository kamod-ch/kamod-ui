import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@kamod-ch/ui/popover";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import {
  DEFAULT_MAX_CHILDREN_PER_NODE,
  MAX_DESCRIPTION_LENGTH,
  MAX_LABEL_LENGTH,
} from "../constants";
import { contentChildUnion } from "./Layout";

export const popoverComponent = defineComponent({
  name: "Popover",
  description:
    "Click-triggered popover. Args: triggerLabel, optional title/description, content children, defaultOpen, side, align.",
  props: z.object({
    triggerLabel: z.string().min(1).max(MAX_LABEL_LENGTH),
    title: z.string().max(MAX_LABEL_LENGTH).optional(),
    description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
    content: z.array(contentChildUnion).max(DEFAULT_MAX_CHILDREN_PER_NODE).default([]),
    defaultOpen: z.boolean().default(false),
    side: z.enum(["top", "right", "bottom", "left"]).default("bottom"),
    align: z.enum(["start", "center", "end"]).default("center"),
  }),
  component: ({ props, renderNode }) => (
    <Popover defaultOpen={props.defaultOpen}>
      <PopoverTrigger type="button">{props.triggerLabel}</PopoverTrigger>
      <PopoverContent side={props.side} align={props.align}>
        {props.title || props.description ? (
          <PopoverHeader>
            {props.title ? <PopoverTitle>{props.title}</PopoverTitle> : null}
            {props.description ? (
              <PopoverDescription>{props.description}</PopoverDescription>
            ) : null}
          </PopoverHeader>
        ) : null}
        <div class="flex flex-col gap-2">{renderNode(props.content)}</div>
      </PopoverContent>
    </Popover>
  ),
});
