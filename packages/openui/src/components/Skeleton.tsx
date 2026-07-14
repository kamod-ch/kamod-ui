import { Skeleton } from "@kamod-ch/ui/skeleton";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { widthSchema } from "../tokens/schemas";
import { widthClass } from "../tokens/variants";

export const skeletonComponent = defineComponent({
  name: "Skeleton",
  description: "Loading placeholder block. Use while content is streaming or loading.",
  props: z.object({
    width: widthSchema,
    lines: z.number().int().min(1).max(6).default(1),
  }),
  component: ({ props }) => (
    <div class={`flex flex-col gap-2 ${widthClass[props.width]}`} aria-hidden="true">
      {Array.from({ length: props.lines }, (_, i) => (
        <Skeleton key={i} class="h-4 w-full" />
      ))}
    </div>
  ),
});
