import { useLayoutEffect } from "preact/hooks";

/** Keep the open guide beside its trigger and below the sticky site header. */
export function usePreviewGuidePosition(id: string) {
  useLayoutEffect(() => {
    const trigger = document.getElementById(`${id}-trigger`);
    const panel = document.getElementById(`${id}-content`);
    if (!trigger || !panel) return;

    const place = () => {
      const gap = 8;
      const viewport = window.visualViewport;
      const left = viewport?.offsetLeft ?? 0;
      const top = viewport?.offsetTop ?? 0;
      const width = viewport?.width ?? window.innerWidth;
      const height = viewport?.height ?? window.innerHeight;
      const headerBottom =
        document.querySelector(".docs-topbar")?.getBoundingClientRect().bottom ?? 0;
      const minTop = Math.max(top, headerBottom) + gap;
      const bottom = top + height - gap;
      panel.style.maxHeight = `${Math.max(0, bottom - minTop)}px`;
      panel.style.maxWidth = `${Math.max(0, width - gap * 2)}px`;
      const anchor = trigger.getBoundingClientRect();
      const above = anchor.top - panel.offsetHeight - gap;
      const preferredTop = above >= minTop ? above : anchor.bottom + gap;
      panel.style.top = `${Math.max(minTop, Math.min(preferredTop, bottom - panel.offsetHeight))}px`;
      panel.style.left = `${Math.max(left + gap, Math.min(anchor.right - panel.offsetWidth, left + width - panel.offsetWidth - gap))}px`;
    };
    // Batch scroll/resize notifications; measure the untransformed panel during its entrance animation.
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(place);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(panel);
    observer.observe(trigger);
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, { capture: true, passive: true });
    window.visualViewport?.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("scroll", schedule);
    place();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
      window.visualViewport?.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("scroll", schedule);
    };
  }, [id]);
}
