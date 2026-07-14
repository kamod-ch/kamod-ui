import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@kamod-ch/ui/tooltip";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { MAX_DESCRIPTION_LENGTH, MAX_LABEL_LENGTH } from "../constants";

export const tooltipComponent = defineComponent({
  name: "Tooltip",
  description:
    "Hover/focus tooltip. Args: trigger label text, tooltip content. Optional side top|right|bottom|left.",
  props: z.object({
    trigger: z.string().min(1).max(MAX_LABEL_LENGTH),
    content: z.string().min(1).max(MAX_DESCRIPTION_LENGTH),
    side: z.enum(["top", "right", "bottom", "left"]).default("top"),
  }),
  component: ({ props }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger class="inline-flex cursor-default text-sm underline decoration-dotted underline-offset-2">
          {props.trigger}
        </TooltipTrigger>
        <TooltipContent
          side={props.side}
          class="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md"
        >
          {props.content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
});
