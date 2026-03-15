import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type MenubarGroupProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const MenubarGroup = ({ class: className, children, ...rest }: MenubarGroupProps) => (
  <div role="group" data-slot="menubar-group" class={cn("p-1", className)} {...rest}>
    {children}
  </div>
);
