import { type ComponentChildren, createContext } from "preact";
import { useContext, useLayoutEffect, useRef, useState } from "preact/hooks";
import { basePrefix } from "../../base-path";

type NavigationMemory = { top: number; groups: Record<string, boolean> };
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
      return { top: value.top, groups };
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
    setGroups(memory.current.groups);
    let restoring = true;
    let frame = 0;
    let saveFrame = 0;
    let wasVisible = node.clientHeight > 0;

    // Wait for hydrated groups, fonts and disclosure measurements before clamping the offset.
    const restore = () => {
      if (restoring && node.clientHeight) node.scrollTop = memory.current.top;
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
    };
    const saveScroll = () => {
      if (!node.clientHeight || restoring) return;
      memory.current.top = node.scrollTop;
      rememberGroups(node);
      cancelAnimationFrame(saveFrame);
      saveFrame = requestAnimationFrame(() => {
        setGroups(memory.current.groups);
        persist();
      });
    };
    const saveBeforeLeaving = () => {
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
      cancelAnimationFrame(saveFrame);
      node.removeEventListener("scroll", saveScroll);
      node.removeEventListener("wheel", interact);
      node.removeEventListener("touchstart", interact);
      node.removeEventListener("pointerdown", interact);
      node.removeEventListener("keydown", interact);
      node.removeEventListener("focusin", interact);
      window.removeEventListener("pagehide", saveBeforeLeaving);
    };
  }, [key]);

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
