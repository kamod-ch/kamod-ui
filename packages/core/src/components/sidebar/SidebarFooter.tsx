import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type SidebarFooterProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const SidebarFooter = ({ class: className, children, ...rest }: SidebarFooterProps) => (
  <div
    data-slot="sidebar-footer"
    data-sidebar="footer"
    class={cn("flex flex-col gap-2 p-2", className)}
    {...rest}
  >
    {children}
  </div>
);
