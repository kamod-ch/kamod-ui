import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type SelectLabelProps = JSX.HTMLAttributes<HTMLDivElement> & { children?: ComponentChildren };

export const SelectLabel = ({ children, class: className, ...rest }: SelectLabelProps) => (
  <div data-slot="select-label" class={cn("text-muted-foreground px-2 py-1.5 text-xs font-semibold", className)} {...rest}>
    {children}
  </div>
);

