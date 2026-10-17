/** Wait for an actual layout box, including a lazy guide's hidden SSR placeholder. */
export function scheduleSectionScroll(
  sectionId: string,
  behavior: ScrollBehavior = "auto",
  scrollSection?: (section: HTMLElement) => void,
) {
  const href = window.location.href;
  let frame = 0;
  let stopped = false;
  let mutations: MutationObserver | undefined;
  let resize: ResizeObserver | undefined;
  let observed: HTMLElement | undefined;
  const intent = [
    "wheel",
    "touchstart",
    "pointerdown",
    "keydown",
    "popstate",
    "hashchange",
  ] as const;
  const cancel = () => {
    if (stopped) return;
    stopped = true;
    window.cancelAnimationFrame(frame);
    mutations?.disconnect();
    resize?.disconnect();
    for (const event of intent) window.removeEventListener(event, cancel, true);
  };
  const schedule = () => {
    if (!stopped && !frame) frame = window.requestAnimationFrame(scroll);
  };
  const scroll = () => {
    frame = 0;
    if (stopped || window.location.href !== href) return cancel();
    const section = document.getElementById(sectionId);
    if (
      section?.isConnected &&
      Array.from(section.getClientRects()).some((rect) => rect.width > 0 && rect.height > 0) &&
      getComputedStyle(section).visibility === "visible"
    ) {
      cancel();
      if (scrollSection) return scrollSection(section);
      const topbar = document.querySelector<HTMLElement>(".docs-topbar");
      const offset = (topbar?.getBoundingClientRect().height ?? 0) + 16;
      window.scrollTo({
        top: Math.max(0, window.scrollY + section.getBoundingClientRect().top - offset),
        behavior,
      });
      return;
    }
    // Observe only while this target is missing or parked by a Suspense boundary.
    // No frame polling or timeout competes with hydration and user navigation.
    if (!mutations) {
      mutations = new MutationObserver(schedule);
      mutations.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class", "style", "hidden"],
      });
      if (typeof ResizeObserver !== "undefined") {
        resize = new ResizeObserver(schedule);
        resize.observe(document.documentElement);
      }
    }
    if (section && section !== observed) {
      if (observed) resize?.unobserve(observed);
      observed = section;
      resize?.observe(section);
    }
  };
  for (const event of intent)
    window.addEventListener(event, cancel, { capture: true, passive: true });
  schedule();
  return cancel;
}
