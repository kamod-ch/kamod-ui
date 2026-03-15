import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { Button } from "../button/Button";
import { useCarousel } from "./Carousel";

const ChevronRight = ({ class: className }: { class?: string }) => (
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
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const ChevronDown = ({ class: className }: { class?: string }) => (
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
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export type CarouselNextProps = Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "size"> & {
  children?: ComponentChildren;
};

export const CarouselNext = ({ children, class: className, onClick, disabled, ...rest }: CarouselNextProps) => {
  const ctx = useCarousel(false);
  const vertical = ctx?.orientation === "vertical";
  const canNext = ctx?.canScrollNext.value ?? false;

  return (
    <Button
      {...rest}
      type="button"
      variant="outline"
      size="icon"
      data-slot="carousel-next"
      aria-label="Next slide"
      disabled={disabled ?? !canNext}
      class={cn(
        "absolute z-10 size-8 rounded-full shadow-xs",
        vertical
          ? "-bottom-12 left-1/2 -translate-x-1/2"
          : "-end-12 top-1/2 -translate-y-1/2 rtl:-rotate-180",
        className
      )}
      onClick={(event) => {
        ctx?.scrollNext();
        onClick?.(event);
      }}
    >
      {children ?? (
        <>
          <span class="sr-only">Next slide</span>
          {vertical ? <ChevronDown /> : <ChevronRight />}
        </>
      )}
    </Button>
  );
};
