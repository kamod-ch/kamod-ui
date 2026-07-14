import { Prose } from "@kamod-ch/ui/prose";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";

export const proseComponent = defineComponent({
  name: "Prose",
  description:
    "Plain-text prose block. Args: content string (max 4000). Split on blank lines into paragraphs. Never passes HTML.",
  props: z.object({
    content: z.string().min(1).max(4000),
  }),
  component: ({ props }) => {
    const paragraphs = props.content
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
    return (
      <Prose>
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </Prose>
    );
  },
});
