import type { JSX } from "preact";
import { cn } from "../../lib/utils";

export type DropdownSeparatorProps = JSX.HTMLAttributes<HTMLDivElement>;

export const DropdownSeparator = ({ class: className, ...rest }: DropdownSeparatorProps) => (
  <div
    role="separator"
    data-slot="dropdown-separator"
    class={cn("bg-border -mx-px my-px h-px", className)}
    {...rest}
  />
);
