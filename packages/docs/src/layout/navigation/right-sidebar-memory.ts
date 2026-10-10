import { useLayoutEffect, useRef } from "preact/hooks";
import { basePrefix } from "../../base-path";
import { connectRightSidebarLinks } from "./right-sidebar-links";

type ScrollArea = "column" | "contents" | "block-contents";
type SidebarMemory = { page: string; offsets: Partial<Record<ScrollArea, number>> };
const storageKey = () => `kamod:right-sidebar:${basePrefix() || "/"}`;
// Hash links only change the reading position within the current page.
const currentPage = () => window.location.pathname.replace(/\/+$/, "") || "/";
const isTopLevel = () => window.self === window.top;

function readMemory(): SidebarMemory | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(storageKey()) ?? "null");
    if (typeof value?.page !== "string" || !value.offsets || typeof value.offsets !== "object")
      return null;
    const offsets: SidebarMemory["offsets"] = {};
    for (const area of ["column", "contents", "block-contents"] as const) {
      const top = value.offsets[area];
      if (Number.isFinite(top) && top >= 0) offsets[area] = top;
    }
    return { page: value.page, offsets };
  } catch {
    return null;
  }
}

function writeMemory(memory: SidebarMemory) {
  try {
    sessionStorage.setItem(storageKey(), JSON.stringify(memory));
  } catch {
    // Contents navigation must keep working when storage is blocked or full.
  }
}

function currentMemory(): SidebarMemory {
  const stored = readMemory();
  if (stored?.page === currentPage()) return stored;
  const memory = { page: currentPage(), offsets: {} };
  writeMemory(memory);
  return memory;
}

/** Invalidate on every page, including pages without a contents sidebar. Preview iframes are isolated. */
export function useRightSidebarPageMemory(page: unknown) {
  useLayoutEffect(() => {
    if (!isTopLevel()) return;
    const update = () => {
      currentMemory();
    };
    update();
    window.addEventListener("pageshow", update);
    return () => window.removeEventListener("pageshow", update);
  }, [page]);
}

/** Restore only the current page's offset, yielding as soon as the user interacts. */
export function useRightSidebarScroll<T extends HTMLElement>(area: ScrollArea, enabled = true) {
  const container = useRef<T>(null);
  const page = typeof window === "undefined" ? "" : currentPage();
  useLayoutEffect(() => {
    const node = container.current;
    if (!enabled || !node || !isTopLevel()) return;
    let top = currentMemory().offsets[area] ?? 0;
    let restoring = true;
    let visible = node.clientHeight > 0;
    let restoreFrame = 0;
    let saveTimer: ReturnType<typeof setTimeout> | undefined;

    const persist = () => {
      // An outgoing component must never replace the new page's memory during teardown.
      if (currentPage() !== page) return;
      const memory = readMemory();
      if (memory?.page !== page) return;
      memory.offsets[area] = top;
      writeMemory(memory);
    };
    const restore = () => {
      if (restoring && node.clientHeight) node.scrollTop = top;
    };
    const resize = () => {
      const nowVisible = node.clientHeight > 0;
      if (nowVisible && !visible) restoring = true;
      visible = nowVisible;
      cancelAnimationFrame(restoreFrame);
      if (restoring && nowVisible) restoreFrame = requestAnimationFrame(restore);
    };
    const interact = () => {
      restoring = false;
      cancelAnimationFrame(restoreFrame);
    };
    const scroll = () => {
      if (restoring || !node.clientHeight) return;
      top = node.scrollTop;
      clearTimeout(saveTimer);
      saveTimer = setTimeout(persist, 150);
    };
    const flush = () => {
      clearTimeout(saveTimer);
      if (!restoring && node.clientHeight) top = node.scrollTop;
      persist();
    };
    const show = (event: PageTransitionEvent) => {
      // Initial pageshow can arrive after the user has already scrolled but before
      // the next storage write. Only a real page-cache restore should reset it.
      if (!event.persisted) return;
      // Back/Forward can revive an old DOM from the browser's page cache.
      top = currentMemory().offsets[area] ?? 0;
      restoring = true;
      restore();
      resize();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(node);
    // Font loading and the feedback card can change the available scroll range after hydration.
    for (const child of node.children) observer.observe(child);
    const intentEvents = ["wheel", "touchstart", "pointerdown", "keydown", "focusin"] as const;
    for (const event of intentEvents) node.addEventListener(event, interact, { passive: true });
    node.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("pagehide", flush);
    window.addEventListener("pageshow", show);
    restore();
    resize();
    const disconnectLinks =
      area === "column" ? undefined : connectRightSidebarLinks(node, interact);
    return () => {
      flush();
      disconnectLinks?.();
      observer.disconnect();
      cancelAnimationFrame(restoreFrame);
      clearTimeout(saveTimer);
      for (const event of intentEvents) node.removeEventListener(event, interact);
      node.removeEventListener("scroll", scroll);
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("pageshow", show);
    };
  }, [area, enabled, page]);
  return container;
}
