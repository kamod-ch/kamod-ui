import type { ComponentChildren, HTMLAttributes } from "preact";
import { cn } from "../../lib/utils";

export type EmptyHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const EmptyHeader = ({ class: className, children, ...rest }: EmptyHeaderProps) => (
  <div class={cn("flex flex-col items-center gap-2", className)} data-slot="empty-header" {...rest}>
    {children}
  </div>
);
