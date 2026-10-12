import { type ComponentChildren, createContext } from "preact";
import { useContext, useLayoutEffect, useRef, useState } from "preact/hooks";
import { basePrefix } from "../../base-path";
import { revealRestoredNavigation } from "./navigation-restore";

type NavigationMemory = {
  top: number;
  groups: Record<string, boolean>;
  /** Last rendered destination; mobile menus align a new page once, then retain manual scroll. */
  page?: string;
};
const NavigationMemoryContext = createContext<{
  groups: Record<string, boolean>;
  setGroup: (id: string, open: boolean) => void;
} | null>(null);

/** Share expansion choices with the scroll container so restored offsets keep their meaning. */
export function useNavigationGroup(id: string, current: boolean) {
  const memory = useContext(NavigationMemoryContext);
  return memory
    ? {
        open: memory.groups[id] ?? current,
        onOpenChange: (open: boolean) => memory.setGroup(id, open),
      }
    : { defaultOpen: current };
}

function readMemory(key: string): NavigationMemory {
  try {
    const value = JSON.parse(sessionStorage.getItem(key) ?? "null");
    if (value && Number.isFinite(value.top) && value.top >= 0) {
      const groups = Object.fromEntries(
        Object.entries(value.groups ?? {}).filter(([, open]) => typeof open === "boolean"),
      ) as Record<string, boolean>;
      return {
        top: value.top,
        groups,
        ...(typeof value.page === "string" ? { page: value.page } : {}),
      };
    }
  } catch {
    // Storage may be unavailable or contain a value from an older implementation.
  }
  return { top: 0, groups: {} };
}

/** Reveal a loaded desktop destination without moving the document or an already visible link. */
function revealCurrentLink(node: HTMLElement, active: HTMLElement, style: CSSStyleDeclaration) {
  if (active.closest("[inert]")) return;
  const link = active.getBoundingClientRect();
  if (!link.height) return;
  const viewportTop = node.getBoundingClientRect().top + node.clientTop;
  const top = viewportTop + (parseFloat(style.paddingTop) || 0);
  const bottom = viewportTop + node.clientHeight - (parseFloat(style.paddingBottom) || 0);
  const delta = link.top < top ? link.top - top : link.bottom > bottom ? link.bottom - bottom : 0;
  if (!delta) return;
  node.scrollTop = Math.max(
    0,
    Math.min(node.scrollHeight - node.clientHeight, node.scrollTop + Math.round(delta)),
  );
  return node.scrollTop;
}

/** Per-tab navigation memory, isolated by site base path and desktop/mobile presentation. */
export function NavigationScrollArea({
  mode,
  pathname,
  class: className,
  children,
}: {
  mode: "desktop" | "mobile";
  /** The rendered route also changes when cached SPA navigation reuses this scroll area. */
  pathname: string;
  class: string;
  children: ComponentChildren;
}) {
  const key = `kamod:navigation:${basePrefix() || "/"}:${mode}`;
  const page = pathname.replace(/\/+$/, "") || "/";
  const container = useRef<HTMLDivElement>(null);
  const memory = useRef<NavigationMemory>({ top: 0, groups: {} });
  const [groups, setGroups] = useState<Record<string, boolean>>({});
  const rememberGroups = (node = container.current) => {
    if (!node) return;
    const openGroups = Array.from(
      node.querySelectorAll<HTMLElement>("[data-navigation-group][aria-expanded=true]"),
    );
    for (const group of openGroups) {
      const id = group.dataset.navigationGroup!;
      if (memory.current.groups[id] !== true) {
        memory.current.groups = { ...memory.current.groups, [id]: true };
      }
    }
  };
  const persist = () => {
    try {
      sessionStorage.setItem(key, JSON.stringify(memory.current));
    } catch {
      // Scrolling and disclosure controls still work with storage disabled.
    }
  };

  useLayoutEffect(() => {
    const node = container.current!;
    memory.current = readMemory(key);
    let aligning = mode === "mobile" && memory.current.page !== page;
    if (aligning) memory.current.top = 0;
    if (mode === "desktop") memory.current.page = page;
    const restoreGroups = () => {
      const restored = { ...memory.current.groups };
      if (mode === "desktop" || aligning) {
        // Loading a desktop destination also reopens a previously collapsed owning group.
        for (const trigger of node.querySelectorAll<HTMLElement>(
          "[data-navigation-group][data-current]",
        )) {
          restored[trigger.dataset.navigationGroup!] = true;
        }
      }
      memory.current.groups = restored;
      setGroups(restored);
    };
    restoreGroups();
    let restoring = true;
    let frame = 0;
    let saveTimer: ReturnType<typeof setTimeout> | undefined;
    let wasVisible = node.clientHeight > 0;

    let trailingSpace = 0;
    // Recheck during disclosure/font layout; add only the space needed to align a final link.
    const restore = () => {
      if (!restoring || !node.clientHeight) return;
      const style = getComputedStyle(node);
      const padding = parseFloat(style.paddingTop) || 0;
      const active =
        mode === "desktop" || aligning
          ? (node.querySelector<HTMLElement>(".site-navigation-link[aria-current]") ??
            node.querySelector<HTMLElement>(".navigation-header-link[aria-current]"))
          : null;
      if (active && aligning) {
        memory.current.top = Math.max(
          0,
          Math.round(
            node.scrollTop +
              active.getBoundingClientRect().top -
              node.getBoundingClientRect().top -
              node.clientTop -
              padding,
          ),
        );
      }
      if (mode === "mobile") {
        const needed = Math.max(
          0,
          memory.current.top - (node.scrollHeight - trailingSpace - node.clientHeight),
        );
        if (needed !== trailingSpace) {
          trailingSpace = needed;
          node.style.setProperty("--navigation-trailing-space", `${needed}px`);
        }
        memory.current.page = page;
      }
      node.scrollTop = memory.current.top;
      if (mode === "desktop") {
        if (active) {
          const revealedTop = revealCurrentLink(node, active, style);
          if (revealedTop !== undefined) memory.current.top = revealedTop;
        }
        revealRestoredNavigation(node, memory.current.groups);
      }
      if (aligning) persist();
    };
    const scheduleRestore = () => {
      const visible = node.clientHeight > 0;
      if (visible && !wasVisible) restoring = true;
      wasVisible = visible;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(restore);
    };
    const interact = () => {
      restoring = false;
      aligning = false;
      cancelAnimationFrame(frame);
    };
    // Capture before SheetClose unmounts the menu, including repeated links to this page.
    const follow = (event: MouseEvent) => {
      if (
        mode !== "mobile" ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (
        !link ||
        link.hasAttribute("download") ||
        link.hasAttribute("data-block-placeholder") ||
        (link.target && link.target !== "_self") ||
        new URL(link.href).origin !== location.origin
      )
        return;
      memory.current.page = "";
      persist();
    };
    const saveScroll = () => {
      if (!node.clientHeight || restoring) return;
      memory.current.top = node.scrollTop;
      // Keep scroll events free of directory scans, rerenders and synchronous storage.
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        rememberGroups(node);
        persist();
      }, 150);
    };
    const saveBeforeLeaving = () => {
      clearTimeout(saveTimer);
      if (!restoring && node.clientHeight) {
        memory.current.top = node.scrollTop;
        rememberGroups(node);
      }
      persist();
    };
    const resume = (event: PageTransitionEvent) => {
      if (!event.persisted || mode !== "desktop") return;
      restoring = true;
      restoreGroups();
      restore();
      scheduleRestore();
    };
    const observer = new ResizeObserver(scheduleRestore);
    observer.observe(node);
    // The inner wrapper resizes as groups open, even when the viewport height is unchanged.
    observer.observe(node.firstElementChild!);
    node.addEventListener("click", follow, true);
    node.addEventListener("scroll", saveScroll, { passive: true });
    node.addEventListener("wheel", interact, { passive: true });
    node.addEventListener("touchstart", interact, { passive: true });
    node.addEventListener("pointerdown", interact);
    node.addEventListener("keydown", interact);
    node.addEventListener("focusin", interact);
    window.addEventListener("pagehide", saveBeforeLeaving);
    window.addEventListener("pageshow", resume);
    restore();
    if (mode === "desktop") persist();
    scheduleRestore();
    return () => {
      saveBeforeLeaving();
      observer.disconnect();
      cancelAnimationFrame(frame);
      clearTimeout(saveTimer);
      node.style.removeProperty("--navigation-trailing-space");
      node.removeEventListener("click", follow, true);
      node.removeEventListener("scroll", saveScroll);
      node.removeEventListener("wheel", interact);
      node.removeEventListener("touchstart", interact);
      node.removeEventListener("pointerdown", interact);
      node.removeEventListener("keydown", interact);
      node.removeEventListener("focusin", interact);
      window.removeEventListener("pagehide", saveBeforeLeaving);
      window.removeEventListener("pageshow", resume);
    };
  }, [key, mode, page]);

  const setGroup = (id: string, open: boolean) => {
    // Capture untouched default-open groups too, before leaving their original page.
    rememberGroups();
    memory.current.groups = { ...memory.current.groups, [id]: open };
    setGroups(memory.current.groups);
    persist();
  };

  return (
    <NavigationMemoryContext.Provider value={{ groups, setGroup }}>
      <div class={className} ref={container}>
        <div class="navigation-scroll-content">{children}</div>
      </div>
    </NavigationMemoryContext.Provider>
  );
}
