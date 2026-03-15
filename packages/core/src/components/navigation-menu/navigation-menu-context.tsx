import { signal } from "@preact/signals";
import { createContext } from "preact";
import { useContext } from "preact/hooks";

export type NavigationMenuRootContextValue = {
  openValue: ReturnType<typeof signal<string | null>>;
  delayDuration: number;
  skipDelayDuration: number;
  rootRef: { current: HTMLElement | null };
  openTimerRef: { current: ReturnType<typeof setTimeout> | null };
  closeTimerRef: { current: ReturnType<typeof setTimeout> | null };
  lastOpenAtRef: { current: number };
  requestOpen: (itemValue: string) => void;
  requestClose: (delayMs?: number) => void;
  clearTimers: () => void;
  toggleItem: (itemValue: string) => void;
};

export const NavigationMenuRootContext = createContext<NavigationMenuRootContextValue | null>(null);

export const useNavigationMenuRoot = () => {
  const ctx = useContext(NavigationMenuRootContext);
  if (!ctx) throw new Error("NavigationMenu subcomponents must be used within NavigationMenu");
  return ctx;
};

export type NavigationMenuItemContextValue = {
  value: string;
};

export const NavigationMenuItemContext = createContext<NavigationMenuItemContextValue | null>(null);

export const useNavigationMenuItemCtx = () => {
  const ctx = useContext(NavigationMenuItemContext);
  if (!ctx) throw new Error("NavigationMenuTrigger and NavigationMenuContent must be inside NavigationMenuItem");
  return ctx;
};
