import { Tabs, TabsContent, TabsList, TabsTrigger } from "@kamod-ch/ui/tabs";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { DEFAULT_MAX_CHILDREN_PER_NODE, MAX_LABEL_LENGTH, MAX_NAME_LENGTH } from "../constants";
import { contentChildUnion, inlineComponent, stackComponent } from "./Layout";

const tabItemSchema = z.object({
  id: z.string().min(1).max(MAX_NAME_LENGTH),
  label: z.string().min(1).max(MAX_LABEL_LENGTH),
  content: z
    .array(z.union([contentChildUnion, inlineComponent.ref, stackComponent.ref]))
    .max(DEFAULT_MAX_CHILDREN_PER_NODE)
    .default([]),
});

export const tabsComponent = defineComponent({
  name: "Tabs",
  description:
    "Tabbed panel. First arg is items (array of {id, label, content}). Optional defaultValue follows. Provide 2–8 items.",
  props: z.object({
    items: z.array(tabItemSchema).min(1).max(8),
    defaultValue: z.string().min(1).max(MAX_NAME_LENGTH).optional(),
  }),
  component: ({ props, renderNode }) => {
    const defaultValue = props.defaultValue ?? props.items[0]?.id ?? "tab-0";
    return (
      <Tabs defaultValue={defaultValue}>
        <TabsList>
          {props.items.map((item) => (
            <TabsTrigger key={item.id} value={item.id}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {props.items.map((item) => (
          <TabsContent key={item.id} value={item.id}>
            <div class="flex flex-col gap-3">{renderNode(item.content)}</div>
          </TabsContent>
        ))}
      </Tabs>
    );
  },
});
