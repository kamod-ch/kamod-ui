import type { ComponentChildren, JSX } from "preact";
import { createContext } from "preact";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "preact/hooks";
import { cn } from "../../lib/utils";
import { TooltipProvider } from "../tooltip";
import { useIsMobile } from "./use-mobile";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
export const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

export type SidebarContextValue = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean | ((prev: boolean) => boolean)) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("Sidebar components must be used within SidebarProvider");
  return context;
};

export type SidebarProviderProps = JSX.HTMLAttributes<HTMLDivElement> & {
  /** Initial desktop state when uncontrolled; the mobile sheet always starts closed. */
  defaultOpen?: boolean;
  /** Controlled desktop state. Mobile visibility is managed separately. */
  open?: boolean;
  /** Reports requested desktop state in both controlled and uncontrolled usage. */
  onOpenChange?: (open: boolean) => void;
  children?: ComponentChildren;
};

export const SidebarProvider = ({
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  class: className,
  style,
  children,
  ...rest
}: SidebarProviderProps) => {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobileState] = useState(false);
  const mobileTriggerRef = useRef<HTMLElement | null>(null);
  const setOpenMobile = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    setOpenMobileState((previous) => {
      const next = typeof value === "function" ? value(previous) : value;
      // The mobile Sheet is controlled here, outside a SheetTrigger. Remember the
      // opener so Escape, backdrop dismissal and navigation all restore focus.
      if (next && !previous && typeof document !== "undefined") {
        mobileTriggerRef.current =
          document.activeElement instanceof HTMLElement ? document.activeElement : null;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (!openMobile) {
      mobileTriggerRef.current?.focus({ preventScroll: true });
      mobileTriggerRef.current = null;
    }
  }, [openMobile]);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = openProp ?? internalOpen;

  const setOpen = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (openProp === undefined) {
        setInternalOpen(openState);
      }
      onOpenChange?.(openState);
      if (typeof document !== "undefined") {
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      }
    },
    [onOpenChange, open, openProp],
  );

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile((prev) => !prev);
    } else {
      setOpen((prev) => !prev);
    }
  }, [isMobile, setOpen, setOpenMobile]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const state = open ? "expanded" : "collapsed";

  const contextValue = useMemo<SidebarContextValue>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={{
            ["--sidebar-width" as string]: SIDEBAR_WIDTH,
            ["--sidebar-width-icon" as string]: SIDEBAR_WIDTH_ICON,
            ...(typeof style === "object" && style !== null ? style : {}),
          }}
          class={cn(
            "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar",
            className,
          )}
          {...rest}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
};
