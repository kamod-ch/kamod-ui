import { Typography } from "@kamod-ch/ui/typography";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { MAX_STRING_LENGTH } from "../constants";
import { textToneSchema } from "../tokens/schemas";
import { textToneToTypography } from "../tokens/variants";

export const textComponent = defineComponent({
  name: "Text",
  description:
    "Body text content. Use for paragraphs and descriptions. Prefer short, clear copy. Does not accept children components.",
  props: z.object({
    content: z.string().min(1).max(MAX_STRING_LENGTH),
    tone: textToneSchema,
  }),
  component: ({ props }) => (
    <Typography variant={textToneToTypography[props.tone]} as="p">
      {props.content}
    </Typography>
  ),
});
