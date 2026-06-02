import type { JSX } from "preact";
import { useState } from "preact/hooks";
import { cn } from "../../lib/utils";
import { Button } from "../button/Button";
import { useCarousel } from "./Carousel";

export type CarouselAutoplayPauseProps = Omit<
  JSX.ButtonHTMLAttributes<HTMLButtonElement>,
  "size"
> & {
  class?: string;
};

export const CarouselAutoplayPause = ({
  class: className,
  onClick,
  ...rest
}: CarouselAutoplayPauseProps) => {
  const ctx = useCarousel(false);
  const [paused, setPaused] = useState(false);
  const plugin = ctx?.autoplayPluginRef.current as { play: () => void; stop: () => void } | null;

  if (!plugin) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      data-slot="carousel-autoplay-pause"
      aria-label={paused ? "Resume autoplay" : "Pause autoplay"}
      aria-pressed={paused}
      class={cn("absolute end-2 top-2 z-10 size-8 rounded-full shadow-xs", className)}
      onClick={(event) => {
        if (paused) {
          plugin.play();
        } else {
          plugin.stop();
        }
        setPaused(!paused);
        onClick?.(event);
      }}
      {...rest}
    >
      <span class="sr-only">{paused ? "Resume autoplay" : "Pause autoplay"}</span>
      {paused ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-3.5"
          aria-hidden
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-3.5"
          aria-hidden
        >
          <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
        </svg>
      )}
    </Button>
  );
};
