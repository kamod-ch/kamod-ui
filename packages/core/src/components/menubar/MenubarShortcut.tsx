import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type MenubarShortcutProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  children?: ComponentChildren;
};

export const MenubarShortcut = ({ class: className, children, ...rest }: MenubarShortcutProps) => (
  <span
    data-slot="menubar-shortcut"
    class={cn("ms-auto text-xs tracking-widest text-muted-foreground", className)}
    {...rest}
  >
    {children}
  </span>
);
