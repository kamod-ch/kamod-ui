import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type EmptyTitleProps = JSX.HTMLAttributes<HTMLHeadingElement> & {
  children?: ComponentChildren;
};

export const EmptyTitle = ({ class: className, children, ...rest }: EmptyTitleProps) => (
  <h3 class={cn("text-lg font-semibold tracking-tight", className)} data-slot="empty-title" {...rest}>
    {children}
  </h3>
);
