import type { JSX } from "preact";
import { useLayoutEffect, useRef, useState } from "preact/hooks";
import { cn } from "../../lib/utils";

export type ScrollBarProps = JSX.HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
};

type ThumbState = {
  size: number;
  offset: number;
  hidden: boolean;
};

const MIN_THUMB_SIZE = 18;
const TRACK_PADDING = 2;

export const ScrollBar = ({ class: className, orientation = "vertical", ...rest }: ScrollBarProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<ThumbState>({ size: 0, offset: 0, hidden: true });

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const scrollArea = track.parentElement as HTMLDivElement | null;
    if (!scrollArea) return;

    const compute = () => {
      const isVertical = orientation === "vertical";
      const viewportSize = isVertical ? scrollArea.clientHeight : scrollArea.clientWidth;
      const scrollSize = isVertical ? scrollArea.scrollHeight : scrollArea.scrollWidth;
      const scrollOffset = isVertical ? scrollArea.scrollTop : scrollArea.scrollLeft;
      const trackSize = (isVertical ? track.clientHeight : track.clientWidth) - TRACK_PADDING * 2;
      const maxScroll = scrollSize - viewportSize;

      if (trackSize <= 0 || maxScroll <= 0) {
        setThumb({ size: 0, offset: 0, hidden: true });
        return;
      }

      const rawSize = (viewportSize / scrollSize) * trackSize;
      const size = Math.min(trackSize, Math.max(MIN_THUMB_SIZE, rawSize));
      const maxOffset = trackSize - size;
      const ratio = maxScroll > 0 ? scrollOffset / maxScroll : 0;
      const offset = maxOffset * ratio;
      setThumb({ size, offset, hidden: false });
    };

    compute();
    scrollArea.addEventListener("scroll", compute, { passive: true });
    const resizeObserver = new ResizeObserver(compute);
    resizeObserver.observe(scrollArea);
    resizeObserver.observe(track);
    const mutationObserver = new MutationObserver(compute);
    mutationObserver.observe(scrollArea, { childList: true, subtree: true, characterData: true });

    return () => {
      scrollArea.removeEventListener("scroll", compute);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [orientation]);

  return (
    <div
      ref={trackRef}
      data-slot="scroll-bar"
      data-orientation={orientation}
      aria-hidden="true"
      class={cn(
        "pointer-events-none absolute rounded-full bg-border/45 p-0.5 transition-opacity",
        orientation === "vertical" ? "right-1 top-1 bottom-1 w-2" : "right-1 left-1 bottom-1 h-2",
        thumb.hidden ? "opacity-0" : "opacity-100",
        className
      )}
      {...rest}
    >
      <div
        data-slot="scroll-bar-thumb"
        class={cn(
          "absolute rounded-full bg-foreground/35 ring-1 ring-border/40",
          orientation === "vertical" ? "left-0 right-0 top-0" : "bottom-0 left-0 top-0 h-full"
        )}
        style={
          orientation === "vertical"
            ? { height: `${thumb.size}px`, transform: `translateY(${thumb.offset}px)` }
            : { width: `${thumb.size}px`, transform: `translateX(${thumb.offset}px)` }
        }
      />
    </div>
  );
};

