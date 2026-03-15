import type { ComponentChildren, JSX } from "preact";
import { useSidebar } from "./SidebarProvider";

export type SidebarProps = JSX.HTMLAttributes<HTMLElement> & { children?: ComponentChildren };

export const Sidebar = ({ children, ...rest }: SidebarProps) => {
  const sidebar = useSidebar();
  return (
    <aside
      data-slot="sidebar"
      data-state={sidebar.open.value ? "open" : "closed"}
      hidden={!sidebar.open.value}
      {...rest}
    >
      {children}
    </aside>
  );
};

