import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type NavigationMenuListProps = JSX.HTMLAttributes<HTMLUListElement> & {
  children?: ComponentChildren;
};

export const NavigationMenuList = ({ class: className, children, ...rest }: NavigationMenuListProps) => (
  <ul
    data-slot="navigation-menu-list"
    class={cn("group flex flex-1 list-none items-center justify-center gap-1", className)}
    {...rest}
  >
    {children}
  </ul>
);
