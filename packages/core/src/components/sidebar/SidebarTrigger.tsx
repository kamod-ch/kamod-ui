import type { ComponentChildren, JSX } from "preact";
import { useSidebar } from "./SidebarProvider";

export type SidebarTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ComponentChildren;
};

export const SidebarTrigger = ({ children = "Toggle Sidebar", onClick, ...rest }: SidebarTriggerProps) => {
  const sidebar = useSidebar();
  return (
    <button
      type="button"
      data-slot="sidebar-trigger"
      aria-expanded={sidebar.open.value}
      onClick={(event) => {
        sidebar.setOpen(!sidebar.open.value);
        onClick?.(event);
      }}
      {...rest}
    >
      {children}
    </button>
  );
};

