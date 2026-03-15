import type { ComponentChildren, JSX } from "preact";

export type SidebarHeaderProps = JSX.HTMLAttributes<HTMLDivElement> & { children?: ComponentChildren };

export const SidebarHeader = ({ children, ...rest }: SidebarHeaderProps) => (
  <div data-slot="sidebar-header" {...rest}>
    {children}
  </div>
);

