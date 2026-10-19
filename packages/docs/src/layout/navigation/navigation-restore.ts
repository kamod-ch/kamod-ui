declare global {
  interface Window {
    /** One-shot first-paint guard; removed after restoration or its failure fallback. */
    __kamodRevealNavigation?: () => void;
  }
}

/** Hide only a returning reader's sidebar until its saved layout and offset are restored. */
export function navigationRestoreScript(base: string) {
  const key = JSON.stringify(`kamod:navigation:${base}:desktop`).replaceAll("<", "\\u003c");
  return `(() => {
    try {
      const memory = JSON.parse(sessionStorage.getItem(${key}) || "null");
      if (!memory || !Number.isFinite(memory.top) || memory.top <= 0) return;
      document.documentElement.setAttribute("data-navigation-restoring", "");
      window.__kamodRevealNavigation = () => {
        clearTimeout(fallback);
        document.documentElement.removeAttribute("data-navigation-restoring");
        delete window.__kamodRevealNavigation;
      };
      const fallback = setTimeout(window.__kamodRevealNavigation, 3000);
    } catch {}
  })();`;
}

/** Existing resize callbacks handle disclosure layout; don't reveal an intermediate scroll range. */
export function revealRestoredNavigation(node: HTMLElement, groups: Record<string, boolean>) {
  if (!window.__kamodRevealNavigation) return;
  for (const trigger of node.querySelectorAll<HTMLElement>("[data-navigation-group]")) {
    const open = groups[trigger.dataset.navigationGroup!] ?? trigger.hasAttribute("data-current");
    if ((trigger.getAttribute("aria-expanded") === "true") !== open) return;
    const panel = document.getElementById(trigger.getAttribute("aria-controls") ?? "");
    if (
      open
        ? panel?.style.height !== "auto" || panel.style.maxHeight !== "none"
        : panel && panel.getBoundingClientRect().height > 0
    )
      return;
  }
  window.__kamodRevealNavigation();
}
