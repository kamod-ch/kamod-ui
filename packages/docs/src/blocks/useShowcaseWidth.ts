import type { RefObject } from "preact";
import { useLayoutEffect, useState } from "preact/hooks";

/** Observe the mounted showcase's width without rerendering its source when panel height changes. */
export function useShowcaseWidth(container: RefObject<HTMLElement | null>) {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const node = container.current;
    if (!node) return;
    let current = node.clientWidth;
    let active = true;
    setWidth(current);
    const observer = new ResizeObserver((entries) => {
      const next = entries.at(-1)?.contentRect.width;
      if (!active || next === undefined || next === current) return;
      current = next;
      setWidth(next);
    });
    observer.observe(node);
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [container]);
  return width;
}
