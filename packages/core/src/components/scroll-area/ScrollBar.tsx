import type { JSX } from "preact";
import { useLayoutEffect, useRef, useState } from "preact/hooks";
import { cn } from "../../lib/utils";
import { useScrollAreaContext } from "./scroll-area-context";

export type ScrollBarProps = JSX.HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
};

type ThumbState = {
  size: number;
  offset: number;
  hidden: boolean;
};

type Metrics = {
  thumbSize: number;
  maxScroll: number;
  maxThumbTravel: number;
  viewportSize: number;
  scrollSize: number;
};

const MIN_THUMB_SIZE = 18;
const TRACK_PADDING = 2;

export const ScrollBar = ({
  class: className,
  orientation = "vertical",
  onPointerDown: onPointerDownProp,
  ...rest
}: ScrollBarProps) => {
  const { viewportRef } = useScrollAreaContext();
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<Metrics>({
    thumbSize: 0,
    maxScroll: 0,
    maxThumbTravel: 0,
    viewportSize: 0,
    scrollSize: 0
  });
  const dragRef = useRef<{ startPointer: number; startScroll: number } | null>(null);
  const [thumb, setThumb] = useState<ThumbState>({ size: 0, offset: 0, hidden: true });

  useLayoutEffect(() => {
    const scrollEl = viewportRef.current;
    const track = trackRef.current;
    if (!scrollEl || !track) return;

    const compute = () => {
      const isVertical = orientation === "vertical";
      const viewportSize = isVertical ? scrollEl.clientHeight : scrollEl.clientWidth;
      const scrollSize = isVertical ? scrollEl.scrollHeight : scrollEl.scrollWidth;
      const scrollOffset = isVertical ? scrollEl.scrollTop : scrollEl.scrollLeft;
      const trackSize = (isVertical ? track.clientHeight : track.clientWidth) - TRACK_PADDING * 2;
      const maxScroll = scrollSize - viewportSize;

      if (trackSize <= 0 || maxScroll <= 0) {
        metricsRef.current = {
          thumbSize: 0,
          maxScroll: 0,
          maxThumbTravel: 0,
          viewportSize,
          scrollSize
        };
        setThumb({ size: 0, offset: 0, hidden: true });
        return;
      }

      const rawSize = (viewportSize / scrollSize) * trackSize;
      const size = Math.min(trackSize, Math.max(MIN_THUMB_SIZE, rawSize));
      const maxThumbTravel = trackSize - size;
      const ratio = maxScroll > 0 ? scrollOffset / maxScroll : 0;
      const offset = maxThumbTravel * ratio;

      metricsRef.current = {
        thumbSize: size,
        maxScroll,
        maxThumbTravel,
        viewportSize,
        scrollSize
      };
      setThumb({ size, offset, hidden: false });
    };

    compute();
    scrollEl.addEventListener("scroll", compute, { passive: true });
    const resizeObserver = new ResizeObserver(compute);
    resizeObserver.observe(scrollEl);
    resizeObserver.observe(track);
    const mutationObserver = new MutationObserver(compute);
    mutationObserver.observe(scrollEl, { childList: true, subtree: true, characterData: true });

    return () => {
      scrollEl.removeEventListener("scroll", compute);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [orientation, viewportRef]);

  const isVertical = orientation === "vertical";

  const onThumbPointerDown = (e: JSX.TargetedPointerEvent<HTMLDivElement>) => {
    if (thumb.hidden) return;
    e.preventDefault();
    e.stopPropagation();
    const scrollEl = viewportRef.current;
    if (!scrollEl || !e.isPrimary) return;

    const m = metricsRef.current;
    if (m.maxThumbTravel <= 0) return;

    dragRef.current = {
      startPointer: isVertical ? e.clientY : e.clientX,
      startScroll: isVertical ? scrollEl.scrollTop : scrollEl.scrollLeft
    };

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    const onMove = (ev: globalThis.PointerEvent) => {
      if (!dragRef.current) return;
      const el = viewportRef.current;
      if (!el) return;
      const mm = metricsRef.current;
      if (mm.maxThumbTravel <= 0) return;
      const pointer = isVertical ? ev.clientY : ev.clientX;
      const delta = pointer - dragRef.current.startPointer;
      const scrollDelta = (delta / mm.maxThumbTravel) * mm.maxScroll;
      const next = dragRef.current.startScroll + scrollDelta;
      const clamped = Math.max(0, Math.min(mm.maxScroll, next));
      if (isVertical) {
        el.scrollTop = clamped;
      } else {
        el.scrollLeft = clamped;
      }
    };

    const onUp = (ev: globalThis.PointerEvent) => {
      (e.currentTarget as HTMLElement).releasePointerCapture(ev.pointerId);
      dragRef.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  const onTrackPointerDown = (e: JSX.TargetedPointerEvent<HTMLDivElement>) => {
    if (thumb.hidden || e.button !== 0) return;
    const t = thumbRef.current;
    if (t && (e.target === t || t.contains(e.target as Node))) return;

    const scrollEl = viewportRef.current;
    const track = trackRef.current;
    if (!scrollEl || !track) return;

    const m = metricsRef.current;
    if (m.maxThumbTravel <= 0 || m.maxScroll <= 0) return;

    const rect = track.getBoundingClientRect();
    const clickAlong = isVertical
      ? e.clientY - rect.top - TRACK_PADDING
      : e.clientX - rect.left - TRACK_PADDING;

    const thumbCenter = thumb.offset + thumb.size / 2;
    const page = thumb.size + 4;
    let nextOffset = thumb.offset;
    if (clickAlong < thumb.offset) {
      nextOffset = Math.max(0, thumb.offset - page);
    } else if (clickAlong > thumb.offset + thumb.size) {
      nextOffset = Math.min(m.maxThumbTravel, thumb.offset + page);
    } else {
      return;
    }

    const nextScroll = (nextOffset / m.maxThumbTravel) * m.maxScroll;
    if (isVertical) {
      scrollEl.scrollTop = nextScroll;
    } else {
      scrollEl.scrollLeft = nextScroll;
    }
  };

  return (
    <div
      ref={trackRef}
      data-slot="scroll-bar"
      data-orientation={orientation}
      aria-hidden="true"
      class={cn(
        "absolute z-[1] rounded-full bg-border/45 p-0.5 transition-opacity select-none",
        orientation === "vertical" ? "right-1 top-1 bottom-1 w-2" : "right-1 left-1 bottom-1 h-2",
        thumb.hidden ? "pointer-events-none opacity-0" : "opacity-100",
        className
      )}
      {...rest}
      onPointerDown={(e) => {
        onPointerDownProp?.(e);
        onTrackPointerDown(e);
      }}
    >
      <div
        ref={thumbRef}
        data-slot="scroll-bar-thumb"
        class={cn(
          "absolute touch-none rounded-full bg-foreground/35 ring-1 ring-border/40",
          orientation === "vertical" ? "left-0 right-0 top-0 cursor-grab active:cursor-grabbing" : "bottom-0 left-0 top-0 h-full cursor-grab active:cursor-grabbing"
        )}
        style={
          orientation === "vertical"
            ? { height: `${thumb.size}px`, transform: `translateY(${thumb.offset}px)` }
            : { width: `${thumb.size}px`, transform: `translateX(${thumb.offset}px)` }
        }
        onPointerDown={onThumbPointerDown}
      />
    </div>
  );
};
