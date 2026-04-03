import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type DropdownShortcutProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  children?: ComponentChildren;
};

export const DropdownShortcut = ({ class: className, children, ...rest }: DropdownShortcutProps) => (
  <span
    data-slot="dropdown-shortcut"
    class={cn("text-muted-foreground ms-auto text-xs tracking-widest opacity-70", className)}
    {...rest}
  >
    {children}
  </span>
);
