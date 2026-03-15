import { signal } from "@preact/signals";
import { createContext } from "preact";
import { useCallback, useContext, useEffect, useMemo, useRef } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";

export type HoverCardContextValue = {
  open: ReturnType<typeof signal<boolean>>;
  openDelay: number;
  closeDelay: number;
  scheduleOpen: () => void;
  scheduleClose: () => void;
  /** Cancel pending timers and keep the card open (pointer entered content). */
  pinOpen: () => void;
  setOpenImmediate: (next: boolean) => void;
};

const HoverCardContext = createContext<HoverCardContextValue | null>(null);

export const useHoverCard = () => {
  const context = useContext(HoverCardContext);
  if (!context) throw new Error("HoverCard subcomponents must be used within HoverCard");
  return context;
};

export type HoverCardProps = JSX.HTMLAttributes<HTMLDivElement> & {
  defaultOpen?: boolean;
  /** Delay before opening (ms). Radix default 700. */
  openDelay?: number;
  /** Delay before closing (ms). Radix default 300. */
  closeDelay?: number;
  children?: ComponentChildren;
};

export const HoverCard = ({
  defaultOpen = false,
  openDelay = 700,
  closeDelay = 300,
  children,
  ...rest
}: HoverCardProps) => {
  const open = useMemo(() => signal(defaultOpen), []);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  const clearOpenTimer = useCallback(() => {
    if (openTimer.current !== null) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
  }, []);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current !== null) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const setOpenImmediate = useCallback(
    (next: boolean) => {
      clearOpenTimer();
      clearCloseTimer();
      open.value = next;
    },
    [clearCloseTimer, clearOpenTimer, open]
  );

  const pinOpen = useCallback(() => {
    clearOpenTimer();
    clearCloseTimer();
    open.value = true;
  }, [clearCloseTimer, clearOpenTimer, open]);

  const scheduleOpen = useCallback(() => {
    clearCloseTimer();
    clearOpenTimer();
    openTimer.current = window.setTimeout(() => {
      openTimer.current = null;
      open.value = true;
    }, openDelay);
  }, [clearCloseTimer, clearOpenTimer, open, openDelay]);

  const scheduleClose = useCallback(() => {
    clearOpenTimer();
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null;
      open.value = false;
    }, closeDelay);
  }, [clearCloseTimer, clearOpenTimer, open, closeDelay]);

  useEffect(
    () => () => {
      clearOpenTimer();
      clearCloseTimer();
    },
    [clearCloseTimer, clearOpenTimer]
  );

  const value = useMemo(
    (): HoverCardContextValue => ({
      open,
      openDelay,
      closeDelay,
      scheduleOpen,
      scheduleClose,
      pinOpen,
      setOpenImmediate
    }),
    [open, openDelay, closeDelay, scheduleOpen, scheduleClose, pinOpen, setOpenImmediate]
  );

  return (
    <HoverCardContext.Provider value={value}>
      <div data-slot="hover-card" data-state={open.value ? "open" : "closed"} class="relative inline-flex" {...rest}>
        {children}
      </div>
    </HoverCardContext.Provider>
  );
};
