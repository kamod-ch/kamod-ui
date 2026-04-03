import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type DropdownLabelProps = JSX.HTMLAttributes<HTMLDivElement> & {
  inset?: boolean;
  children?: ComponentChildren;
};

export const DropdownLabel = ({ inset = false, class: className, children, ...rest }: DropdownLabelProps) => (
  <div
    data-slot="dropdown-label"
    data-inset={inset ? "true" : undefined}
    class={cn("text-muted-foreground px-1 py-0.5 text-xs font-semibold", inset && "ps-6", className)}
    {...rest}
  >
    {children}
  </div>
);
