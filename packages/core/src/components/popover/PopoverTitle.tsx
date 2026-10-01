import type { ComponentChildren, HTMLAttributes, JSX } from "preact";
import { tv } from "tailwind-variants";
import { cn } from "../../lib/utils";

export const popoverTitle = tv({ base: "font-medium leading-none" });

export type PopoverTitleProps = HTMLAttributes<HTMLHeadingElement> & {
  children?: ComponentChildren;
};

export const PopoverTitle = ({ class: className, children, ...rest }: PopoverTitleProps) => (
  <h3
    class={cn(popoverTitle(), className)}
    data-slot="popover-title"
    {...(rest as JSX.IntrinsicElements["h3"])}
  >
    {children}
  </h3>
);
