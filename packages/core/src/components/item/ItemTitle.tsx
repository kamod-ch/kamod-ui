import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type ItemTitleProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const ItemTitle = ({ class: className, children, ...rest }: ItemTitleProps) => (
  <div
    data-slot="item-title"
    class={cn("flex w-fit items-center gap-2 text-sm font-medium leading-snug", className)}
    {...rest}
  >
    {children}
  </div>
);
