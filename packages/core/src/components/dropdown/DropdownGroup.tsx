import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type DropdownGroupProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const DropdownGroup = ({ class: className, children, ...rest }: DropdownGroupProps) => (
  <div role="group" data-slot="dropdown-group" class={cn("p-1", className)} {...rest}>
    {children}
  </div>
);
