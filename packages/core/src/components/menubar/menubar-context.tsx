import { signal } from "@preact/signals";
import { createContext } from "preact";
import { useContext } from "preact/hooks";

export type MenubarRootContextValue = {
  openMenuId: ReturnType<typeof signal<string | null>>;
  setOpenMenuId: (id: string | null) => void;
  rootRef: { current: HTMLDivElement | null };
};

export const MenubarRootContext = createContext<MenubarRootContextValue | null>(null);

export const useMenubarRoot = () => {
  const ctx = useContext(MenubarRootContext);
  if (!ctx) throw new Error("Menubar components must be used within Menubar");
  return ctx;
};

export type MenubarMenuContextValue = {
  menuId: string;
};

export const MenubarMenuContext = createContext<MenubarMenuContextValue | null>(null);

export const useMenubarMenu = () => {
  const ctx = useContext(MenubarMenuContext);
  if (!ctx) throw new Error("MenubarTrigger and MenubarContent must be inside MenubarMenu");
  return ctx;
};

export type MenubarRadioContextValue = {
  selected: ReturnType<typeof signal<string>>;
  controlledValue: string | undefined;
  setValue: (next: string) => void;
};

export const MenubarRadioContext = createContext<MenubarRadioContextValue | null>(null);

export const useMenubarRadio = () => {
  const ctx = useContext(MenubarRadioContext);
  if (!ctx) throw new Error("MenubarRadioItem must be inside MenubarRadioGroup");
  return ctx;
};

export type MenubarSubContextValue = {
  open: ReturnType<typeof signal<boolean>>;
  setOpen: (next: boolean) => void;
};

export const MenubarSubContext = createContext<MenubarSubContextValue | null>(null);

export const useMenubarSub = () => {
  const ctx = useContext(MenubarSubContext);
  if (!ctx) throw new Error("MenubarSub parts must be inside MenubarSub");
  return ctx;
};
