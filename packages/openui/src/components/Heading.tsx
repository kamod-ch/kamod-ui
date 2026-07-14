import { Typography } from "@kamod-ch/ui/typography";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { MAX_LABEL_LENGTH } from "../constants";
import { headingLevelSchema } from "../tokens/schemas";

const levelToVariant = {
  "1": "h1",
  "2": "h2",
  "3": "h3",
  "4": "h4",
} as const;

const levelToTag = {
  "1": "h1",
  "2": "h2",
  "3": "h3",
  "4": "h4",
} as const;

export const headingComponent = defineComponent({
  name: "Heading",
  description:
    "Section heading. Use level 1–4 for document outline. Does not accept children components.",
  props: z.object({
    content: z.string().min(1).max(MAX_LABEL_LENGTH),
    level: headingLevelSchema,
  }),
  component: ({ props }) => (
    <Typography variant={levelToVariant[props.level]} as={levelToTag[props.level]}>
      {props.content}
    </Typography>
  ),
});
