import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { Button } from "../button/Button";
import { useCarousel } from "./Carousel";

const ChevronLeft = ({ class: className }: { class?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={cn("size-4", className)}
    aria-hidden
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronUp = ({ class: className }: { class?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={cn("size-4", className)}
    aria-hidden
  >
    <path d="m18 15-6-6-6 6" />
  </svg>
);

export type CarouselPreviousProps = Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "size"> & {
  children?: ComponentChildren;
};

export const CarouselPrevious = ({ children, class: className, onClick, disabled, ...rest }: CarouselPreviousProps) => {
  const ctx = useCarousel(false);
  const vertical = ctx?.orientation === "vertical";
  const canPrev = ctx?.canScrollPrev.value ?? false;

  return (
    <Button
      {...rest}
      type="button"
      variant="outline"
      size="icon"
      data-slot="carousel-previous"
      aria-label="Previous slide"
      disabled={disabled ?? !canPrev}
      class={cn(
        "absolute z-10 size-8 rounded-full shadow-xs",
        vertical
          ? "-top-12 left-1/2 -translate-x-1/2"
          : "-start-12 top-1/2 -translate-y-1/2 rtl:-rotate-180",
        className
      )}
      onClick={(event) => {
        ctx?.scrollPrev();
        onClick?.(event);
      }}
    >
      {children ?? (
        <>
          <span class="sr-only">Previous slide</span>
          {vertical ? <ChevronUp /> : <ChevronLeft />}
        </>
      )}
    </Button>
  );
};
