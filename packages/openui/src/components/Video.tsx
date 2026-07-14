import { Video } from "@kamod-ch/ui/video";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { validateMediaUrl } from "../security/navigation";

export const videoComponent = defineComponent({
  name: "Video",
  description:
    "Video player. Args: src (required), optional poster, controls (default true). Unsafe URLs render nothing.",
  props: z.object({
    src: z.string().min(1).max(500),
    poster: z.string().max(500).optional(),
    controls: z.boolean().default(true),
  }),
  component: ({ props }) => {
    const src = validateMediaUrl(props.src);
    if (!src.allowed) return null;
    const posterDecision = props.poster ? validateMediaUrl(props.poster) : null;
    const poster = posterDecision?.allowed ? posterDecision.href : undefined;
    return <Video src={src.href} poster={poster} controls={props.controls} />;
  },
});
