import type { JSX } from "preact";
import { cn } from "../../lib/utils";

export type SelectSearchProps = JSX.InputHTMLAttributes<HTMLInputElement>;

export const SelectSearch = ({ class: className, ...rest }: SelectSearchProps) => (
  <input
    type="text"
    data-slot="select-search"
    class={cn(
      "border-input bg-background placeholder:text-muted-foreground focus:ring-ring mb-1 h-8 w-full rounded-md border px-2.5 text-sm outline-none focus:ring-2",
      className
    )}
    {...rest}
  />
);

