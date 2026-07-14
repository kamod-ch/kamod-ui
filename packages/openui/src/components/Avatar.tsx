import { Avatar, AvatarFallback, AvatarImage } from "@kamod-ch/ui/avatar";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { MAX_LABEL_LENGTH } from "../constants";
import { validateMediaUrl } from "../security/navigation";

export const avatarComponent = defineComponent({
  name: "Avatar",
  description:
    "User or entity avatar. Args: fallback initials (required), optional src URL, size sm|default|lg.",
  props: z.object({
    fallback: z.string().min(1).max(MAX_LABEL_LENGTH),
    src: z.string().max(500).optional(),
    alt: z.string().max(MAX_LABEL_LENGTH).optional(),
    size: z.enum(["sm", "default", "lg"]).default("default"),
  }),
  component: ({ props }) => {
    const media = props.src ? validateMediaUrl(props.src) : null;
    const src = media?.allowed ? media.href : undefined;
    return (
      <Avatar size={props.size}>
        {src ? <AvatarImage src={src} alt={props.alt ?? props.fallback} /> : null}
        <AvatarFallback>{props.fallback}</AvatarFallback>
      </Avatar>
    );
  },
});
