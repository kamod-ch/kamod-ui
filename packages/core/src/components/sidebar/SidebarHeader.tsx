import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type SidebarHeaderProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const SidebarHeader = ({ class: className, children, ...rest }: SidebarHeaderProps) => (
  <div
    data-slot="sidebar-header"
    data-sidebar="header"
    class={cn("flex flex-col gap-2 p-2", className)}
    {...rest}
  >
    {children}
  </div>
);
