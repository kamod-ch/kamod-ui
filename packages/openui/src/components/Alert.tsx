import { Alert, AlertDescription, AlertTitle } from "@kamod-ch/ui/alert";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { MAX_DESCRIPTION_LENGTH, MAX_LABEL_LENGTH } from "../constants";
import { toneSchema } from "../tokens/schemas";
import { toneToAlertVariant } from "../tokens/variants";

export const alertComponent = defineComponent({
  name: "Alert",
  description:
    "Inline status message with tone. Use for success, warning, info, or danger feedback.",
  props: z.object({
    title: z.string().min(1).max(MAX_LABEL_LENGTH),
    description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
    tone: toneSchema,
  }),
  component: ({ props }) => (
    <Alert variant={toneToAlertVariant[props.tone]}>
      <AlertTitle>{props.title}</AlertTitle>
      {props.description ? <AlertDescription>{props.description}</AlertDescription> : null}
    </Alert>
  ),
});
