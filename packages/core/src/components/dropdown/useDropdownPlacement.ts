import type { RefObject } from "preact";
import { useLayoutEffect, useState } from "preact/hooks";

type Side = "top" | "bottom" | "left" | "right";
type Align = "start" | "center" | "end";
type Placement = { left: number; top: number; side: Side };
type PlacementOptions = { side: Side; align: Align; sideOffset: number };

const VIEWPORT_PADDING = 8;
const oppositeSide: Record<Side, Side> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

const alignedOffset = (start: number, end: number, size: number, align: Align) => {
  if (align === "start") return start;
  if (align === "end") return end - size;
  return (start + end - size) / 2;
};

/** Prefer the requested side, flip when the opposite has more room, then clamp both axes. */
const getPlacement = (
  rect: DOMRect,
  width: number,
  height: number,
  viewportWidth: number,
  viewportHeight: number,
  { side, align, sideOffset }: PlacementOptions,
): Placement => {
  const space = {
    top: rect.top - sideOffset - VIEWPORT_PADDING,
    bottom: viewportHeight - rect.bottom - sideOffset - VIEWPORT_PADDING,
    left: rect.left - sideOffset - VIEWPORT_PADDING,
    right: viewportWidth - rect.right - sideOffset - VIEWPORT_PADDING,
  };
  const extent = side === "top" || side === "bottom" ? height : width;
  const opposite = oppositeSide[side];
  const resolvedSide = space[side] < extent && space[opposite] > space[side] ? opposite : side;
  const vertical = resolvedSide === "top" || resolvedSide === "bottom";
  const left = vertical
    ? alignedOffset(rect.left, rect.right, width, align)
    : resolvedSide === "right"
      ? rect.right + sideOffset
      : rect.left - width - sideOffset;
  const top = vertical
    ? resolvedSide === "bottom"
      ? rect.bottom + sideOffset
      : rect.top - height - sideOffset
    : alignedOffset(rect.top, rect.bottom, height, align);
  const clamp = (value: number, available: number) =>
    Math.max(VIEWPORT_PADDING, Math.min(value, available - VIEWPORT_PADDING));

  return {
    left: clamp(left, viewportWidth - width),
    top: clamp(top, viewportHeight - height),
    side: resolvedSide,
  };
};

/** Track fixed portal coordinates while open, including nested scroll and content resizing. */
export const useDropdownPlacement = ({
  enabled,
  triggerRef,
  contentRef,
  side,
  align,
  sideOffset,
}: PlacementOptions & {
  enabled: boolean;
  triggerRef: RefObject<HTMLElement>;
  contentRef: RefObject<HTMLDivElement>;
}): Placement => {
  const [placement, setPlacement] = useState<Placement>({ left: 0, top: 0, side });

  useLayoutEffect(() => {
    // Inline menus use CSS positioning; their composite triggers need no DOM measurement.
    if (!enabled) return;
    const content = contentRef.current;
    const trigger = triggerRef.current;
    const view = trigger?.ownerDocument.defaultView;
    if (!content || !trigger || !view) return;

    const update = () => {
      // Layout dimensions avoid the opening animation's temporary scale affecting placement.
      const next = getPlacement(
        trigger.getBoundingClientRect(),
        content.offsetWidth,
        content.offsetHeight,
        trigger.ownerDocument.documentElement.clientWidth || view.innerWidth,
        view.innerHeight,
        { side, align, sideOffset },
      );
      setPlacement((previous) =>
        previous.left === next.left && previous.top === next.top && previous.side === next.side
          ? previous
          : next,
      );
    };

    update();
    view.addEventListener("scroll", update, true);
    view.addEventListener("resize", update);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(content);
    observer?.observe(trigger);
    return () => {
      view.removeEventListener("scroll", update, true);
      view.removeEventListener("resize", update);
      observer?.disconnect();
    };
  }, [enabled, triggerRef, contentRef, side, align, sideOffset]);

  return placement;
};
