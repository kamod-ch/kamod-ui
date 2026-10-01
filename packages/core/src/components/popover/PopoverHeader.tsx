import type { ComponentChildren, HTMLAttributes } from "preact";
import { tv } from "tailwind-variants";
import { cn } from "../../lib/utils";

export const popoverHeader = tv({ base: "flex flex-col gap-1.5" });

export type PopoverHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const PopoverHeader = ({ class: className, children, ...rest }: PopoverHeaderProps) => (
  <div class={cn(popoverHeader(), className)} data-slot="popover-header" {...rest}>
    {children}
  </div>
);
