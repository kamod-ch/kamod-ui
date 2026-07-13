import { Separator } from "@kamod-ch/ui/separator";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";

export const dividerComponent = defineComponent({
  name: "Divider",
  description: "Visual separator between sections. Does not accept children.",
  props: z.object({
    orientation: z.enum(["horizontal", "vertical"]).default("horizontal"),
  }),
  component: ({ props }) => <Separator orientation={props.orientation} decorative />,
});
