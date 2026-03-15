import type { ComponentChildren, JSX } from "preact";

export type SidebarFooterProps = JSX.HTMLAttributes<HTMLDivElement> & { children?: ComponentChildren };

export const SidebarFooter = ({ children, ...rest }: SidebarFooterProps) => (
  <div data-slot="sidebar-footer" {...rest}>
    {children}
  </div>
);

