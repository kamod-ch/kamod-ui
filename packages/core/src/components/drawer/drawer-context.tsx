import { createContext } from "preact";
import { useContext } from "preact/hooks";

export type DrawerDirection = "top" | "right" | "bottom" | "left";

export type DrawerContextValue = {
  direction: DrawerDirection;
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

export const DrawerProvider = DrawerContext.Provider;

export const useDrawerRoot = () => {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("Drawer subcomponents must be used within Drawer");
  return ctx;
};
