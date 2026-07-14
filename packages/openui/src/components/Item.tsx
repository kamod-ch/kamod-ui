import { Item, ItemContent, ItemDescription, ItemTitle } from "@kamod-ch/ui/item";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { MAX_DESCRIPTION_LENGTH, MAX_LABEL_LENGTH } from "../constants";

export const itemComponent = defineComponent({
  name: "Item",
  description:
    "List/content item. Args: title, optional description, variant default|outline|muted, size default|sm|xs.",
  props: z.object({
    title: z.string().min(1).max(MAX_LABEL_LENGTH),
    description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
    variant: z.enum(["default", "outline", "muted"]).default("default"),
    size: z.enum(["default", "sm", "xs"]).default("default"),
  }),
  component: ({ props }) => (
    <Item variant={props.variant} size={props.size}>
      <ItemContent>
        <ItemTitle>{props.title}</ItemTitle>
        {props.description ? <ItemDescription>{props.description}</ItemDescription> : null}
      </ItemContent>
    </Item>
  ),
});
