import type { JSX } from "preact";
import { cn } from "../../lib/utils";

export type ImageProps = JSX.ImgHTMLAttributes<HTMLImageElement>;

export const Image = ({ class: className, alt = "", ...rest }: ImageProps) => (
  <img data-slot="image" alt={alt} class={cn("block max-w-full rounded-md", className)} {...rest} />
);

