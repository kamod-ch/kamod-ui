import { Motion } from "@kamod-ch/motion/motion";
import { useTabs } from "@kamod-ch/ui/tabs";
import { useLayoutEffect, useState } from "preact/hooks";
import { cn } from "../lib/cn.js";

export type MotionTabsIndicatorProps = {
  class?: string;
};

/**
 * Animated highlight for the active tab trigger. Place inside a relatively positioned `TabsList`.
 */
export function MotionTabsIndicator({ class: className }: MotionTabsIndicatorProps) {
  const tabs = useTabs();
  const [box, setBox] = useState<{ x: number; y: number; width: number; height: number } | null>(
    null,
  );

  useLayoutEffect(() => {
    const list = document.querySelector(
      `[data-slot="tabs-list"][data-orientation="${tabs.orientation}"]`,
    ) as HTMLElement | null;
    if (!list) {
      setBox(null);
      return;
    }

    const active = list.querySelector<HTMLElement>('[data-state="active"][role="tab"]');
    if (!active) {
      setBox(null);
      return;
    }

    const listRect = list.getBoundingClientRect();
    const tabRect = active.getBoundingClientRect();
    setBox({
      x: tabRect.left - listRect.left,
      y: tabRect.top - listRect.top,
      width: tabRect.width,
      height: tabRect.height,
    });
  }, [tabs.value, tabs.orientation]);

  if (!box) {
    return null;
  }

  return (
    <Motion
      aria-hidden="true"
      data-slot="tabs-indicator"
      class={cn(
        "pointer-events-none absolute left-0 top-0 rounded-md bg-background shadow-sm ring-1 ring-black/[0.04] dark:ring-white/[0.06]",
        className,
      )}
      animate={{
        translateX: box.x,
        translateY: box.y,
        width: box.width,
        height: box.height,
      }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      style={{
        width: box.width,
        height: box.height,
      }}
    />
  );
}
