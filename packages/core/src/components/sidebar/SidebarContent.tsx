import type { ComponentChildren, JSX } from "preact";

export type SidebarContentProps = JSX.HTMLAttributes<HTMLDivElement> & { children?: ComponentChildren };

export const SidebarContent = ({ children, ...rest }: SidebarContentProps) => (
  <div data-slot="sidebar-content" {...rest}>
    {children}
  </div>
);

