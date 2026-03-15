import { signal } from "@preact/signals";
import { createContext } from "preact";
import { useContext, useMemo } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";

export type CollapsibleContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
};

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

export const useCollapsible = () => {
  const context = useContext(CollapsibleContext);
  if (!context) throw new Error("Collapsible subcomponents must be used within Collapsible");
  return context;
};

export type CollapsibleProps = JSX.HTMLAttributes<HTMLDivElement> & {
  /** Uncontrolled initial state */
  defaultOpen?: boolean;
  /** Controlled open state */
  open?: boolean;
  /** Called when open state changes (toggle or programmatic) */
  onOpenChange?: (open: boolean) => void;
  children?: ComponentChildren;
};

export const Collapsible = ({
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  children,
  ...rest
}: CollapsibleProps) => {
  const uncontrolled = useMemo(() => signal(defaultOpen), []);
  const isControlled = openProp !== undefined;
  const open = isControlled ? Boolean(openProp) : uncontrolled.value;

  const setOpen = (next: boolean) => {
    if (!isControlled) {
      uncontrolled.value = next;
    }
    onOpenChange?.(next);
  };

  const context: CollapsibleContextValue = { open, setOpen };

  return (
    <CollapsibleContext.Provider value={context}>
      <div data-slot="collapsible" data-state={open ? "open" : "closed"} {...rest}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
};
