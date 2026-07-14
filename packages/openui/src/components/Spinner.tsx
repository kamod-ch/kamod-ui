import { Spinner } from "@kamod-ch/ui/spinner";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";

export const spinnerComponent = defineComponent({
  name: "Spinner",
  description: "Loading spinner. Optional size xs|sm|md|lg|xl and tone default|muted|primary.",
  props: z.object({
    size: z.enum(["xs", "sm", "md", "lg", "xl"]).default("sm"),
    tone: z.enum(["default", "muted", "primary"]).default("default"),
  }),
  component: ({ props }) => <Spinner size={props.size} tone={props.tone} />,
});
