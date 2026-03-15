import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useMenubarMenu, useMenubarRoot } from "./menubar-context";

export type MenubarTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ComponentChildren;
};

export const MenubarTrigger = ({ class: className, children, onClick, ...rest }: MenubarTriggerProps) => {
  const root = useMenubarRoot();
  const { menuId } = useMenubarMenu();
  const open = root.openMenuId.value === menuId;

  return (
    <button
      type="button"
      data-slot="menubar-trigger"
      data-state={open ? "open" : "closed"}
      aria-expanded={open}
      aria-haspopup="menu"
      class={cn(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1 text-sm font-medium outline-none",
        "focus:bg-accent focus:text-accent-foreground",
        "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        root.setOpenMenuId(open ? null : menuId);
      }}
      {...rest}
    >
      {children}
    </button>
  );
};
