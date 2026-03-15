import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type ItemActionsProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const ItemActions = ({ class: className, children, ...rest }: ItemActionsProps) => (
  <div data-slot="item-actions" class={cn("flex items-center gap-2", className)} {...rest}>
    {children}
  </div>
);
