import type { ComponentChildren, HTMLAttributes, JSX } from "preact";
import { cn } from "../../lib/utils";

export type EmptyTitleProps = HTMLAttributes<HTMLHeadingElement> & {
  children?: ComponentChildren;
};

export const EmptyTitle = ({ class: className, children, ...rest }: EmptyTitleProps) => (
  <h3
    class={cn("text-lg font-semibold tracking-tight", className)}
    data-slot="empty-title"
    {...(rest as JSX.IntrinsicElements["h3"])}
  >
    {children}
  </h3>
);
