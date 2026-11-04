import type { LooseImgHTMLAttributes } from "preact";
import { cn } from "../../lib/utils";

export type ImageProps = LooseImgHTMLAttributes<HTMLImageElement>;

export const Image = ({ class: className, alt = "", ...rest }: ImageProps) => (
  <img
    data-slot="image"
    alt={alt as string}
    class={cn("block max-w-full rounded-md", className)}
    {...(rest as Record<string, unknown>)}
  />
);
