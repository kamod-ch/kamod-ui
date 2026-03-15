import type { ComponentChildren, JSX } from "preact";

export type SidebarInsetProps = JSX.HTMLAttributes<HTMLDivElement> & { children?: ComponentChildren };

export const SidebarInset = ({ children, ...rest }: SidebarInsetProps) => (
  <div data-slot="sidebar-inset" {...rest}>
    {children}
  </div>
);

