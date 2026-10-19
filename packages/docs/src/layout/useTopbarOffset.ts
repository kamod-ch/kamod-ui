import { useLayoutEffect, useRef } from "preact/hooks";

/** Keep native anchors below a wrapping navbar without scroll listeners or render updates. */
export function useTopbarOffset() {
  const header = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const node = header.current;
    if (!node) return;
    const root = node.ownerDocument.documentElement;
    let previous = 0;
    const update = () => {
      if (!node.isConnected) return;
      const height = Math.ceil(node.getBoundingClientRect().height);
      if (!height || height === previous) return;
      previous = height;
      root.style.setProperty("--docs-topbar-offset", `${height}px`);
    };
    update();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(node);
    return () => {
      observer?.disconnect();
      root.style.removeProperty("--docs-topbar-offset");
    };
  }, []);
  return header;
}
