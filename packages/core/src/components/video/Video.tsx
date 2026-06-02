import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type VideoProps = JSX.VideoHTMLAttributes<HTMLVideoElement> & {
  children?: ComponentChildren;
};

export const Video = ({ class: className, controls = true, children, ...rest }: VideoProps) => (
  // Captions are the consumer's responsibility (passed as <track> via children).
  // oxlint-disable-next-line jsx-a11y/media-has-caption
  <video
    data-slot="video"
    class={cn("block w-full rounded-md border", className)}
    controls={controls}
    {...rest}
  >
    {children}
  </video>
);
