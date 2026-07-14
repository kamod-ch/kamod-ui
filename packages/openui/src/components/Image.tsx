import { Image } from "@kamod-ch/ui/image";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { MAX_LABEL_LENGTH } from "../constants";
import { validateMediaUrl } from "../security/navigation";

const widthClass = {
  sm: "w-24",
  md: "w-48",
  lg: "w-80",
  full: "w-full",
} as const;

export const imageComponent = defineComponent({
  name: "Image",
  description:
    "Image from http(s) or relative src. Args: src, alt, optional width sm|md|lg|full. Unsafe URLs render alt text only.",
  props: z.object({
    src: z.string().min(1).max(500),
    alt: z.string().min(1).max(MAX_LABEL_LENGTH),
    width: z.enum(["sm", "md", "lg", "full"]).default("full"),
  }),
  component: ({ props }) => {
    const media = validateMediaUrl(props.src);
    if (!media.allowed) {
      return <span class="text-muted-foreground text-sm">{props.alt}</span>;
    }
    return <Image src={media.href} alt={props.alt} class={widthClass[props.width]} />;
  },
});
