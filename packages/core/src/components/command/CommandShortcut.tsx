import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type CommandShortcutProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  children?: ComponentChildren;
};

export const CommandShortcut = ({ class: className, children, ...rest }: CommandShortcutProps) => (
  <span
    data-slot="command-shortcut"
    class={cn("text-muted-foreground ms-auto text-xs tracking-widest", className)}
    {...rest}
  >
    {children}
  </span>
);
