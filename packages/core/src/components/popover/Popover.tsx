import { signal } from "@preact/signals";
import { createContext } from "preact";
import { useContext, useEffect, useMemo, useRef } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";
import { tv } from "tailwind-variants";
import { createDismissableLayer, createIdFactory } from "../../lib/interactive";

type PopoverContextValue = {
  open: ReturnType<typeof signal<boolean>>;
  setOpen: (next: boolean) => void;
  triggerId: string;
  contentId: string;
  rootRef: { current: HTMLDivElement | null };
  triggerRef: { current: HTMLElement | null };
  contentRef: { current: HTMLDivElement | null };
};

const PopoverContext = createContext<PopoverContextValue | null>(null);
const nextPopoverId = createIdFactory("kamod-popover");

export const usePopover = () => {
  const context = useContext(PopoverContext);
  if (!context) throw new Error("Popover subcomponents must be used within Popover");
  return context;
};

export const popover = tv({
  base: "relative inline-flex"
});

export type PopoverProps = JSX.HTMLAttributes<HTMLDivElement> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ComponentChildren;
};

export const Popover = ({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  class: className,
  children,
  ...rest
}: PopoverProps) => {
  const isControlled = openProp !== undefined;
  const open = useMemo(() => signal(isControlled ? openProp : defaultOpen), []);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const instanceId = useMemo(() => nextPopoverId(), []);

  useEffect(() => {
    if (isControlled && openProp !== undefined) {
      open.value = openProp;
    }
  }, [openProp, isControlled, open]);

  const setOpen = (next: boolean) => {
    onOpenChange?.(next);
    if (!isControlled) {
      open.value = next;
    }
  };

  const setOpenRef = useRef(setOpen);
  setOpenRef.current = setOpen;

  useEffect(() => {
    const layer = createDismissableLayer({
      root: () => rootRef.current,
      open: () => open.value,
      onDismiss: () => {
        setOpenRef.current(false);
      }
    });
    return () => layer.dispose();
  }, []);

  return (
    <PopoverContext.Provider
      value={{
        open,
        setOpen,
        triggerId: `${instanceId}-trigger`,
        contentId: `${instanceId}-content`,
        rootRef,
        triggerRef,
        contentRef
      }}
    >
      <div
        ref={rootRef}
        class={popover({ class: className as string | undefined })}
        data-slot="popover"
        data-state={open.value ? "open" : "closed"}
        {...rest}
      >
        {children}
      </div>
    </PopoverContext.Provider>
  );
};

