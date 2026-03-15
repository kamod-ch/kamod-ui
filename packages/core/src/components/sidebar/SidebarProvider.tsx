import { signal } from "@preact/signals";
import { createContext } from "preact";
import { useContext, useMemo } from "preact/hooks";
import type { ComponentChildren } from "preact";

type SidebarContextValue = {
  open: ReturnType<typeof signal<boolean>>;
  setOpen: (next: boolean) => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("Sidebar components must be used within SidebarProvider");
  return context;
};

export type SidebarProviderProps = {
  defaultOpen?: boolean;
  children?: ComponentChildren;
};

export const SidebarProvider = ({ defaultOpen = true, children }: SidebarProviderProps) => {
  const open = useMemo(() => signal(defaultOpen), []);
  return (
    <SidebarContext.Provider value={{ open, setOpen: (next) => (open.value = next) }}>
      {children}
    </SidebarContext.Provider>
  );
};

