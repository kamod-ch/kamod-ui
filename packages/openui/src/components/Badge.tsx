import { Badge } from "@kamod-ch/ui/badge";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { MAX_LABEL_LENGTH } from "../constants";
import { toneSchema } from "../tokens/schemas";
import { toneToBadgeVariant } from "../tokens/variants";

export const badgeComponent = defineComponent({
  name: "Badge",
  description: "Small status or category label. Does not accept children components.",
  props: z.object({
    label: z.string().min(1).max(MAX_LABEL_LENGTH),
    tone: toneSchema,
  }),
  component: ({ props }) => <Badge variant={toneToBadgeVariant[props.tone]}>{props.label}</Badge>,
});
