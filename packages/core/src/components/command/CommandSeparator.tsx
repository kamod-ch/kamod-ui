import type { JSX } from "preact";
import { cn } from "../../lib/utils";

export type CommandSeparatorProps = JSX.HTMLAttributes<HTMLHRElement>;

export const CommandSeparator = ({ class: className, ...rest }: CommandSeparatorProps) => (
  <hr
    data-slot="command-separator"
    role="separator"
    class={cn("bg-border -mx-1 my-1 h-px border-0", className)}
    {...rest}
  />
);
