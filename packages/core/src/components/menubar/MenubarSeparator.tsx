import type { HTMLAttributes } from "preact";
import { cn } from "../../lib/utils";

export type MenubarSeparatorProps = HTMLAttributes<HTMLDivElement>;

export const MenubarSeparator = ({ class: className, ...rest }: MenubarSeparatorProps) => (
  <div
    role="separator"
    data-slot="menubar-separator"
    class={cn("mx-1 my-1 h-px bg-border", className)}
    {...rest}
  />
);
