import { Label } from "@kamod-ch/ui/label";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { MAX_LABEL_LENGTH } from "../constants";

export const labelComponent = defineComponent({
  name: "Label",
  description: "Standalone form label text. Prefer Field wrappers when binding controls.",
  props: z.object({
    content: z.string().min(1).max(MAX_LABEL_LENGTH),
    size: z.enum(["sm", "md", "lg"]).default("sm"),
  }),
  component: ({ props }) => <Label size={props.size}>{props.content}</Label>,
});
