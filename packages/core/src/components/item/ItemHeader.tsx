import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type ItemHeaderProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const ItemHeader = ({ class: className, children, ...rest }: ItemHeaderProps) => (
  <div
    data-slot="item-header"
    class={cn("flex basis-full items-center justify-between gap-2", className)}
    {...rest}
  >
    {children}
  </div>
);
