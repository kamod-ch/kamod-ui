import { Progress } from "@kamod-ch/ui/progress";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";

export const progressComponent = defineComponent({
  name: "Progress",
  description:
    "Progress indicator. Use value 0–100, or set indeterminate true for an unknown progress state.",
  props: z.object({
    value: z.number().min(0).max(100).optional(),
    indeterminate: z.boolean().default(false),
  }),
  component: ({ props }) => (
    <Progress
      value={props.indeterminate ? null : (props.value ?? 0)}
      indeterminate={props.indeterminate}
      aria-label="Progress"
    />
  ),
});
