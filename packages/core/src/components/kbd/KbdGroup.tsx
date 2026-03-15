import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type KbdGroupProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  children?: ComponentChildren;
};

export const KbdGroup = ({ class: className, children, ...rest }: KbdGroupProps) => (
  <span data-slot="kbd-group" class={cn("inline-flex items-center gap-1", className)} {...rest}>
    {children}
  </span>
);
