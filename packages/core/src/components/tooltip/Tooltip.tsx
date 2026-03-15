import { signal } from "@preact/signals";
import { createContext } from "preact";
import { useContext, useEffect, useMemo, useRef } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";

type TooltipProviderContextValue = {
  delayDuration: number;
  closeDelayDuration: number;
  disableHoverableContent: boolean;
};

const TooltipProviderContext = createContext<TooltipProviderContextValue | null>(null);

type TooltipContextValue = {
  open: ReturnType<typeof signal<boolean>>;
  contentId: ReturnType<typeof signal<string | undefined>>;
  disableHoverableContent: boolean;
  setOpen: (next: boolean) => void;
  openWithDelay: () => void;
  closeWithDelay: () => void;
  setContentId: (id: string | undefined) => void;
  cancelTimers: () => void;
};

const TooltipContext = createContext<TooltipContextValue | null>(null);

export const useTooltip = () => {
  const context = useContext(TooltipContext);
  if (!context) throw new Error("Tooltip subcomponents must be used within Tooltip");
  return context;
};

export type TooltipProps = JSX.HTMLAttributes<HTMLDivElement> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (next: boolean) => void;
  delayDuration?: number;
  closeDelayDuration?: number;
  disableHoverableContent?: boolean;
  children?: ComponentChildren;
};

export type TooltipProviderProps = {
  delayDuration?: number;
  closeDelayDuration?: number;
  disableHoverableContent?: boolean;
  children?: ComponentChildren;
};

export const TooltipProvider = ({
  delayDuration = 250,
  closeDelayDuration = 120,
  disableHoverableContent = false,
  children
}: TooltipProviderProps) => (
  <TooltipProviderContext.Provider value={{ delayDuration, closeDelayDuration, disableHoverableContent }}>
    {children}
  </TooltipProviderContext.Provider>
);

export const Tooltip = ({
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  delayDuration,
  closeDelayDuration,
  disableHoverableContent,
  children,
  ...rest
}: TooltipProps) => {
  const provider = useContext(TooltipProviderContext);
  const resolvedDelayDuration = delayDuration ?? provider?.delayDuration ?? 250;
  const resolvedCloseDelayDuration = closeDelayDuration ?? provider?.closeDelayDuration ?? 120;
  const resolvedDisableHoverableContent = disableHoverableContent ?? provider?.disableHoverableContent ?? false;
  const open = useMemo(() => signal(defaultOpen), []);
  const contentId = useMemo(() => signal<string | undefined>(undefined), []);
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const { style, ...remainingProps } = rest;
  const isControlled = typeof controlledOpen === "boolean";

  useEffect(() => {
    if (isControlled) {
      open.value = controlledOpen;
    }
  }, [controlledOpen, isControlled, open]);

  const cancelTimers = () => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const setOpen = (next: boolean) => {
    cancelTimers();
    if (isControlled) {
      onOpenChange?.(next);
      return;
    }
    open.value = next;
    onOpenChange?.(next);
  };

  const setContentId = (id: string | undefined) => {
    contentId.value = id;
  };

  const openWithDelay = () => {
    if (open.value) return;
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (openTimerRef.current !== null) return;
    openTimerRef.current = window.setTimeout(() => {
      setOpen(true);
      openTimerRef.current = null;
    }, resolvedDelayDuration);
  };

  const closeWithDelay = () => {
    if (!open.value) return;
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current !== null) return;
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false);
      closeTimerRef.current = null;
    }, resolvedCloseDelayDuration);
  };

  useEffect(() => cancelTimers, []);

  const resolvedStyle =
    typeof style === "object" && style && !("value" in style) ? (style as JSX.CSSProperties) : {};

  const mergedStyle: JSX.CSSProperties = {
    position: "relative",
    display: "inline-flex",
    ...resolvedStyle
  };

  return (
    <TooltipContext.Provider
      value={{
        open,
        contentId,
        disableHoverableContent: resolvedDisableHoverableContent,
        setOpen,
        openWithDelay,
        closeWithDelay,
        setContentId,
        cancelTimers
      }}
    >
      <div
        data-slot="tooltip"
        data-state={open.value ? "open" : "closed"}
        data-delay-duration={resolvedDelayDuration}
        style={mergedStyle}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false);
            event.stopPropagation();
          }
        }}
        {...remainingProps}
      >
        {children}
      </div>
    </TooltipContext.Provider>
  );
};

