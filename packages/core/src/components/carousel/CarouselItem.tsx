import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type CarouselItemProps = JSX.HTMLAttributes<HTMLDivElement> & { children?: ComponentChildren };

export const CarouselItem = ({ class: className, children, ...rest }: CarouselItemProps) => (
  <div
    role="group"
    aria-roledescription="slide"
    data-slot="carousel-item"
    class={cn("min-h-0 min-w-0 shrink-0 grow-0 basis-full", className)}
    {...rest}
  >
    {children}
  </div>
);
