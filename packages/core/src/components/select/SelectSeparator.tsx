import type { JSX } from "preact";
import { cn } from "../../lib/utils";

export type SelectSeparatorProps = JSX.HTMLAttributes<HTMLDivElement>;

export const SelectSeparator = ({ class: className, ...rest }: SelectSeparatorProps) => (
  <div role="separator" data-slot="select-separator" class={cn("bg-border my-1 h-px w-full shrink-0", className)} {...rest} />
);

