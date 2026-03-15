import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type InputGroupTextProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  children?: ComponentChildren;
};

export const InputGroupText = ({ class: className, children, ...rest }: InputGroupTextProps) => (
  <span data-slot="input-group-text" class={cn("text-muted-foreground text-sm", className)} {...rest}>
    {children}
  </span>
);

