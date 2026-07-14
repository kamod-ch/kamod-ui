import { ScrollArea } from "@kamod-ch/ui/scroll-area";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { DEFAULT_MAX_CHILDREN_PER_NODE } from "../constants";
import { contentChildUnion } from "./Layout";

const maxHeightClass = {
  sm: "max-h-40",
  md: "max-h-64",
  lg: "max-h-96",
} as const;

export const scrollAreaComponent = defineComponent({
  name: "ScrollArea",
  description:
    "Scrollable region for overflow content. Args: children, optional maxHeight sm|md|lg.",
  props: z.object({
    children: z.array(contentChildUnion).max(DEFAULT_MAX_CHILDREN_PER_NODE).default([]),
    maxHeight: z.enum(["sm", "md", "lg"]).default("md"),
  }),
  component: ({ props, renderNode }) => (
    <ScrollArea class={`w-full ${maxHeightClass[props.maxHeight]}`}>
      <div class="flex flex-col gap-2 p-1">{renderNode(props.children)}</div>
    </ScrollArea>
  ),
});
