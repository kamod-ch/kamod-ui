import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type MenubarLabelProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const MenubarLabel = ({ class: className, children, ...rest }: MenubarLabelProps) => (
  <div data-slot="menubar-label" class={cn("px-2 py-1.5 text-sm font-medium text-muted-foreground", className)} {...rest}>
    {children}
  </div>
);
