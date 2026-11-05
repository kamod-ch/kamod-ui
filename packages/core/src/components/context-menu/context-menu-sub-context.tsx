import { signal } from "@preact/signals";
import type { ComponentChildren } from "preact";
import { createContext } from "preact";
import { useContext, useMemo } from "preact/hooks";

export type ContextMenuSubContextValue = {
  open: ReturnType<typeof signal<boolean>>;
  setOpen: (next: boolean) => void;
  markFocusOnOpen: () => void;
  consumeFocusOnOpen: () => boolean;
};

const ContextMenuSubContext = createContext<ContextMenuSubContextValue | null>(null);

export const ContextMenuSubProvider = ({
  children,
  value,
}: {
  children: ComponentChildren;
  value: ContextMenuSubContextValue;
}) => <ContextMenuSubContext.Provider value={value}>{children}</ContextMenuSubContext.Provider>;

export const useContextMenuSub = () => {
  const ctx = useContext(ContextMenuSubContext);
  if (!ctx) throw new Error("ContextMenu subcomponents must be used within ContextMenuSub");
  return ctx;
};

export const useMemoContextMenuSub = (): ContextMenuSubContextValue =>
  useMemo(() => {
    const open = signal(false);
    let focusOnOpen = false;
    return {
      open,
      setOpen: (next) => {
        open.value = next;
        if (!next) focusOnOpen = false;
      },
      markFocusOnOpen: () => {
        focusOnOpen = true;
      },
      consumeFocusOnOpen: () => {
        const next = focusOnOpen;
        focusOnOpen = false;
        return next;
      },
    };
  }, []);
