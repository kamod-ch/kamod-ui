import { signal } from "@preact/signals";
import { createContext } from "preact";
import { useContext, useEffect, useMemo, useRef } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type ContextMenuPoint = { x: number; y: number };

export type ContextMenuContextValue = {
  open: ReturnType<typeof signal<boolean>>;
  setOpen: (next: boolean) => void;
  position: ReturnType<typeof signal<ContextMenuPoint>>;
  setPosition: (p: ContextMenuPoint) => void;
  contentWrapperRef: { current: HTMLDivElement | null };
};

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

export const useContextMenu = () => {
  const ctx = useContext(ContextMenuContext);
  if (!ctx) throw new Error("ContextMenu subcomponents must be used within ContextMenu");
  return ctx;
};

export type ContextMenuProps = JSX.HTMLAttributes<HTMLDivElement> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ComponentChildren;
};

export const ContextMenu = ({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  class: className,
  children,
  ...rest
}: ContextMenuProps) => {
  const isControlled = openProp !== undefined;
  const open = useMemo(() => signal(isControlled ? Boolean(openProp) : defaultOpen), []);
  const position = useMemo(() => signal<ContextMenuPoint>({ x: 0, y: 0 }), []);
  const contentWrapperRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <ContextMenuContext.Provider
      value={{
        open,
        setOpen: (next) => setOpenRef.current(next),
        position,
        setPosition: (p) => {
          position.value = p;
        },
        contentWrapperRef
      }}
    >
      <div
        data-slot="context-menu"
        data-state={open.value ? "open" : "closed"}
        class={cn("relative inline-flex", className)}
        {...rest}
      >
        {children}
      </div>
    </ContextMenuContext.Provider>
  );
};
