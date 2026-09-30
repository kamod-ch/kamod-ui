/** Wait briefly for a route's section to mount; cancel all pending work when the route changes. */
export function scheduleSectionScroll(sectionId: string, behavior: ScrollBehavior = "auto") {
  let frame = 0;
  let attempts = 0;
  const scroll = () => {
    const section = document.getElementById(sectionId);
    if (section) {
      const topbar = document.querySelector<HTMLElement>(".docs-topbar");
      const offset = (topbar?.getBoundingClientRect().height ?? 0) + 16;
      window.scrollTo({
        top: Math.max(0, window.scrollY + section.getBoundingClientRect().top - offset),
        behavior,
      });
    } else if (++attempts < 5) {
      frame = window.requestAnimationFrame(scroll);
    }
  };
  frame = window.requestAnimationFrame(scroll);
  return () => window.cancelAnimationFrame(frame);
}
