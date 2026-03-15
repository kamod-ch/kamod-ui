import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type ItemFooterProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const ItemFooter = ({ class: className, children, ...rest }: ItemFooterProps) => (
  <div
    data-slot="item-footer"
    class={cn("flex basis-full items-center justify-between gap-2", className)}
    {...rest}
  >
    {children}
  </div>
);
