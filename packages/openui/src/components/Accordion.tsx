import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@kamod-ch/ui/accordion";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { DEFAULT_MAX_CHILDREN_PER_NODE, MAX_LABEL_LENGTH, MAX_NAME_LENGTH } from "../constants";
import { contentChildUnion } from "./Layout";

const accordionItemSchema = z.object({
  id: z.string().min(1).max(MAX_NAME_LENGTH),
  title: z.string().min(1).max(MAX_LABEL_LENGTH),
  content: z.array(contentChildUnion).max(DEFAULT_MAX_CHILDREN_PER_NODE).default([]),
});

export const accordionComponent = defineComponent({
  name: "Accordion",
  description:
    "Expandable sections. First arg is items (array of {id, title, content}). Prefer single open panel.",
  props: z.object({
    items: z.array(accordionItemSchema).min(1).max(12),
    type: z.enum(["single", "multiple"]).default("single"),
    collapsible: z.boolean().default(true),
    defaultValue: z.string().max(MAX_NAME_LENGTH).optional(),
  }),
  component: ({ props, renderNode }) => (
    <Accordion type={props.type} collapsible={props.collapsible} defaultValue={props.defaultValue}>
      {props.items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>
            <div class="flex flex-col gap-2 py-1">{renderNode(item.content)}</div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
});
