import { signal } from "@preact/signals";
import { createContext } from "preact";
import { useContext, useMemo } from "preact/hooks";
import type { ComponentChildren } from "preact";

export type DropdownSubContextValue = {
  open: ReturnType<typeof signal<boolean>>;
  setOpen: (next: boolean) => void;
};

const DropdownSubContext = createContext<DropdownSubContextValue | null>(null);

export const DropdownSubProvider = ({
  children,
  value
}: {
  children: ComponentChildren;
  value: DropdownSubContextValue;
}) => <DropdownSubContext.Provider value={value}>{children}</DropdownSubContext.Provider>;

export const useDropdownSub = () => {
  const ctx = useContext(DropdownSubContext);
  if (!ctx) throw new Error("Dropdown subcomponents must be used within DropdownSub");
  return ctx;
};

export const useMemoDropdownSub = (): DropdownSubContextValue =>
  useMemo(() => {
    const open = signal(false);
    return {
      open,
      setOpen: (next) => {
        open.value = next;
      }
    };
  }, []);
