import { useLayoutEffect, useState } from "preact/hooks";

/** PreactPress saves ppScrollY for history navigation, but does not restore it on initial reload. */
export function usePageReloadScroll() {
  // Capture before child layout effects or lazy content can overwrite the router's history value.
  const [position] = useState(() => {
    if (typeof window === "undefined" || window.self !== window.top) return null;
    const navigation = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    const top: unknown = history.state?.ppScrollY;
    return navigation?.type === "reload" &&
      typeof top === "number" &&
      Number.isFinite(top) &&
      top >= 0
      ? top
      : null;
  });
  useLayoutEffect(() => {
    if (position === null) return;
    const top = position;
    const page = location.pathname;
    let stopped = false;
    let frame = 0;
    const restore = () => {
      frame = 0;
      if (stopped || location.pathname !== page) return;
      if (Math.abs(window.scrollY - top) > 1)
        window.scrollTo({ top, left: 0, behavior: "instant" });
    };
    const schedule = () => {
      if (!stopped && !frame) frame = requestAnimationFrame(restore);
    };
    const stop = () => {
      if (stopped) return;
      stopped = true;
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
      observer.disconnect();
      for (const event of [
        "wheel",
        "touchstart",
        "pointerdown",
        "keydown",
        "popstate",
        "hashchange",
      ] as const) {
        window.removeEventListener(event, stop, true);
      }
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
    };
    // Lazy previews, fonts and hydration can change the document height after the first paint.
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    const timeout = window.setTimeout(stop, 5000);
    for (const event of [
      "wheel",
      "touchstart",
      "pointerdown",
      "keydown",
      "popstate",
      "hashchange",
    ] as const) {
      window.addEventListener(event, stop, { capture: true, passive: true });
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);
    void document.fonts?.ready.then(schedule);
    // A second frame also catches section-route scrolls scheduled during hydration.
    frame = requestAnimationFrame(() => {
      frame = 0;
      schedule();
    });
    return stop;
  }, [position]);
}
