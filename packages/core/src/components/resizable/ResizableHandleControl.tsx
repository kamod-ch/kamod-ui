import type { JSX } from "preact";
import { useMemo } from "preact/hooks";
import { cn } from "../../lib/utils";
import { useResizableContext } from "./resizable-context";
import type { ResizableHandleProps } from "./resizable-types";
import {
  getHandleValueRange,
  resizeAdjacentPanels,
  setAdjacentPanelsExtreme,
} from "./resizable-utils";
import { resizableHandle } from "./resizable-variants";
import { useResizableDrag } from "./use-resizable-drag";

export type ResizableHandleControlProps = ResizableHandleProps & {
  handleIndex: number;
};

export const ResizableHandleControl = ({
  handleIndex,
  label,
  disabled = false,
  class: className,
}: ResizableHandleControlProps) => {
  const ctx = useResizableContext();
  const { direction, panels, sizes, setSizes, keyboardStep, containerRef, rtl } = ctx;

  const drag = useResizableDrag({
    direction,
    containerRef,
    onDrag: (index, deltaPercent, startSizes) => {
      const adjustedDelta = rtl ? -deltaPercent : deltaPercent;
      setSizes(resizeAdjacentPanels(startSizes, index, adjustedDelta, panels));
    },
  });

  const aria = useMemo(
    () => getHandleValueRange(sizes, handleIndex, panels),
    [handleIndex, panels, sizes],
  );

  const separatorOrientation = direction === "horizontal" ? "vertical" : "horizontal";
  const ariaLabel =
    label ??
    (direction === "horizontal" ? "Resize panels horizontally" : "Resize panels vertically");

  const nudge = (delta: number) => {
    if (disabled) return;
    setSizes(resizeAdjacentPanels(sizes, handleIndex, delta, panels));
  };

  const handleKeyDown = (event: JSX.TargetedKeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    let handled = false;
    if (direction === "horizontal") {
      if (event.key === "ArrowLeft") {
        nudge(rtl ? keyboardStep : -keyboardStep);
        handled = true;
      } else if (event.key === "ArrowRight") {
        nudge(rtl ? -keyboardStep : keyboardStep);
        handled = true;
      }
    } else {
      if (event.key === "ArrowUp") {
        nudge(-keyboardStep);
        handled = true;
      } else if (event.key === "ArrowDown") {
        nudge(keyboardStep);
        handled = true;
      }
    }

    if (event.key === "Home") {
      setSizes(setAdjacentPanelsExtreme(sizes, handleIndex, "start", panels));
      handled = true;
    } else if (event.key === "End") {
      setSizes(setAdjacentPanelsExtreme(sizes, handleIndex, "end", panels));
      handled = true;
    }

    if (handled) {
      event.preventDefault();
    }
  };

  return (
    <div
      data-slot="resizable-handle"
      data-disabled={disabled ? "true" : undefined}
      role="separator"
      aria-orientation={separatorOrientation}
      aria-label={ariaLabel}
      aria-valuemin={Math.round(aria.min)}
      aria-valuemax={Math.round(aria.max)}
      aria-valuenow={Math.round(aria.now)}
      aria-valuetext={`${Math.round(aria.now)}%`}
      tabIndex={disabled ? -1 : 0}
      class={cn(resizableHandle({ direction }), className)}
      onPointerDown={(event) => {
        if (disabled) return;
        drag.onPointerDown(handleIndex, event as unknown as PointerEvent, sizes);
      }}
      onPointerMove={(event) => {
        drag.onPointerMove(event as unknown as PointerEvent);
      }}
      onPointerUp={(event) => drag.onPointerUp(event as unknown as PointerEvent)}
      onPointerCancel={(event) => drag.onPointerCancel(event as unknown as PointerEvent)}
      onLostPointerCapture={(event) => drag.onLostPointerCapture(event as unknown as PointerEvent)}
      onKeyDown={handleKeyDown}
    />
  );
};
