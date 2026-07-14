import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@kamod-ch/ui/collapsible";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { DEFAULT_MAX_CHILDREN_PER_NODE, MAX_LABEL_LENGTH } from "../constants";
import { contentChildUnion } from "./Layout";

export const collapsibleComponent = defineComponent({
  name: "Collapsible",
  description:
    "Single expandable section. Args: title, content children array, optional defaultOpen.",
  props: z.object({
    title: z.string().min(1).max(MAX_LABEL_LENGTH),
    content: z.array(contentChildUnion).max(DEFAULT_MAX_CHILDREN_PER_NODE).default([]),
    defaultOpen: z.boolean().default(false),
  }),
  component: ({ props, renderNode }) => (
    <Collapsible defaultOpen={props.defaultOpen} class="w-full rounded-md border">
      <CollapsibleTrigger class="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium hover:bg-muted/50">
        {props.title}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div class="flex flex-col gap-2 border-t px-4 py-3">{renderNode(props.content)}</div>
      </CollapsibleContent>
    </Collapsible>
  ),
});
