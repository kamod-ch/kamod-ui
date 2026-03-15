import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type SelectGroupProps = JSX.HTMLAttributes<HTMLDivElement> & { children?: ComponentChildren };

export const SelectGroup = ({ children, class: className, ...rest }: SelectGroupProps) => (
  <div data-slot="select-group" class={cn("p-1", className)} {...rest}>
    {children}
  </div>
);

