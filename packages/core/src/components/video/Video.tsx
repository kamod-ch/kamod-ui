import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type VideoProps = JSX.VideoHTMLAttributes<HTMLVideoElement> & {
  children?: ComponentChildren;
};

export const Video = ({ class: className, controls = true, children, ...rest }: VideoProps) => (
  <video data-slot="video" class={cn("block w-full rounded-md border", className)} controls={controls} {...rest}>
    {children}
  </video>
);

