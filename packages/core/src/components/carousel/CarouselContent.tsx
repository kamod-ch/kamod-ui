import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useCarousel } from "./Carousel";

export type CarouselContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const CarouselContent = ({ class: className, children, ...rest }: CarouselContentProps) => {
  const ctx = useCarousel(true);
  if (!ctx) throw new Error("CarouselContent requires Carousel");
  const vertical = ctx.orientation === "vertical";

  return (
    <div
      ref={(el) => {
        ctx.setCarouselViewport(el);
      }}
      data-slot="carousel-viewport"
      data-carousel-axis={vertical ? "y" : "x"}
      class={cn(
        "overflow-hidden",
        vertical && "min-h-0 touch-pan-y",
        className
      )}
      {...rest}
    >
      <div
        data-slot="carousel-container"
        class={cn("flex", vertical ? "h-full min-h-0 flex-col" : "flex-row")}
      >
        {children}
      </div>
    </div>
  );
};
