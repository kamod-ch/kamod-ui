import { AspectRatio } from "@kamod-ch/ui/aspect-ratio";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { DEFAULT_MAX_CHILDREN_PER_NODE } from "../constants";
import { imageComponent } from "./Image";
import { contentChildUnion } from "./Layout";

export const aspectRatioComponent = defineComponent({
  name: "AspectRatio",
  description:
    "Fixed aspect-ratio box for media. Args: ratio (number 0.25–4, default 1.777 ≈ 16/9), content children (prefer Image).",
  props: z.object({
    ratio: z.number().min(0.25).max(4).default(1.777),
    content: z
      .array(z.union([imageComponent.ref, contentChildUnion]))
      .max(DEFAULT_MAX_CHILDREN_PER_NODE)
      .default([]),
  }),
  component: ({ props, renderNode }) => (
    <AspectRatio ratio={props.ratio}>
      {props.content.length > 0 ? (
        <div class="absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
          {renderNode(props.content)}
        </div>
      ) : null}
    </AspectRatio>
  ),
});
