import type { ComponentChildren, HTMLAttributes } from "preact";
import { cn } from "../../lib/utils";

export type ItemGroupProps = HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const ItemGroup = ({ class: className, children, ...rest }: ItemGroupProps) => (
  <div
    role="list"
    data-slot="item-group"
    class={cn("group/item-group flex flex-col", className)}
    {...rest}
  >
    {children}
  </div>
);
