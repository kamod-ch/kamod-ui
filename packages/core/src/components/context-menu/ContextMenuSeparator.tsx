import type { JSX } from "preact";
import { cn } from "../../lib/utils";

export type ContextMenuSeparatorProps = JSX.HTMLAttributes<HTMLHRElement>;

export const ContextMenuSeparator = ({ class: className, ...rest }: ContextMenuSeparatorProps) => (
  <hr
    data-slot="context-menu-separator"
    role="separator"
    class={cn("bg-border -mx-1 my-1 h-px border-0", className)}
    {...rest}
  />
);
