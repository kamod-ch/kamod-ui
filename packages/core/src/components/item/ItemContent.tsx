import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type ItemContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const ItemContent = ({ class: className, children, ...rest }: ItemContentProps) => (
  <div
    data-slot="item-content"
    class={cn("flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none", className)}
    {...rest}
  >
    {children}
  </div>
);
