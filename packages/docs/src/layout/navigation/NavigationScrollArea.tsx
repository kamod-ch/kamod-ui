import { type ComponentChildren, createContext } from "preact";
import { useContext, useLayoutEffect, useRef, useState } from "preact/hooks";
import { basePrefix } from "../../base-path";

type NavigationMemory = {
  top: number;
  groups: Record<string, boolean>;
  /** Mobile menus align a new destination once, then retain the reader's position. */
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

/** Per-tab navigation memory, isolated by site base path and desktop/mobile presentation. */
export function NavigationScrollArea({
  mode,
  class: className,
  children,
}: {
  mode: "desktop" | "mobile";
  class: string;
  children: ComponentChildren;
}) {
  const key = `kamod:navigation:${basePrefix() || "/"}:${mode}`;
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
    const page = window.location.pathname.replace(/\/$/, "") || "/";
    let aligning = mode === "mobile" && memory.current.page !== page;
    if (aligning) {
      memory.current.top = 0;
      // A newly visited page must be reachable even if its group was previously collapsed.
      for (const trigger of node.querySelectorAll<HTMLElement>(
        "[data-navigation-group][data-current]",
      )) {
        memory.current.groups[trigger.dataset.navigationGroup!] = true;
      }
    }
    setGroups(memory.current.groups);
    let restoring = true;
    let frame = 0;
    let saveTimer: ReturnType<typeof setTimeout> | undefined;
    let wasVisible = node.clientHeight > 0;

    let trailingSpace = 0;
    // Recheck during disclosure/font layout; add only the space needed to align a final link.
    const restore = () => {
      if (!restoring || !node.clientHeight) return;
      const padding = parseFloat(getComputedStyle(node).paddingTop) || 0;
      const active = aligning
        ? (node.querySelector<HTMLElement>(".site-navigation-link[aria-current]") ??
          node.querySelector<HTMLElement>(".navigation-header-link[aria-current]"))
        : null;
      if (active) {
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
    restore();
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
    };
  }, [key, mode]);

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
