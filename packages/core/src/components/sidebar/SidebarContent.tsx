import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type SidebarContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const SidebarContent = ({ class: className, children, ...rest }: SidebarContentProps) => (
  <div
    data-slot="sidebar-content"
    data-sidebar="content"
    class={cn(
      "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
      className,
    )}
    {...rest}
  >
    {children}
  </div>
);
