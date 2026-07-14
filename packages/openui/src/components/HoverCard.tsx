import { HoverCard, HoverCardContent, HoverCardTrigger } from "@kamod-ch/ui/hover-card";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { MAX_DESCRIPTION_LENGTH, MAX_LABEL_LENGTH } from "../constants";

export const hoverCardComponent = defineComponent({
  name: "HoverCard",
  description:
    "Hover preview card. Args: triggerLabel, content text, optional title/description, side.",
  props: z.object({
    triggerLabel: z.string().min(1).max(MAX_LABEL_LENGTH),
    content: z.string().min(1).max(MAX_DESCRIPTION_LENGTH),
    title: z.string().max(MAX_LABEL_LENGTH).optional(),
    description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
    side: z.enum(["top", "right", "bottom", "left"]).default("bottom"),
  }),
  component: ({ props }) => (
    <HoverCard>
      <HoverCardTrigger type="button">{props.triggerLabel}</HoverCardTrigger>
      <HoverCardContent side={props.side} class="w-64">
        {props.title ? <div class="text-sm font-medium">{props.title}</div> : null}
        {props.description ? (
          <p class="text-muted-foreground text-xs">{props.description}</p>
        ) : null}
        <p class="text-sm">{props.content}</p>
      </HoverCardContent>
    </HoverCard>
  ),
});
