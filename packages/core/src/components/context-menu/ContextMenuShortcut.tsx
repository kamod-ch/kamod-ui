import type { ComponentChildren, HTMLAttributes } from "preact";
import { cn } from "../../lib/utils";

export type ContextMenuShortcutProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ComponentChildren;
};

export const ContextMenuShortcut = ({
  class: className,
  children,
  ...rest
}: ContextMenuShortcutProps) => (
  <span
    data-slot="context-menu-shortcut"
    class={cn("text-muted-foreground ms-auto text-xs tracking-widest", className)}
    {...rest}
  >
    {children}
  </span>
);
