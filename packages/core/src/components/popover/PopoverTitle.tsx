import type { ComponentChildren, JSX } from "preact";
import { tv } from "tailwind-variants";

export const popoverTitle = tv({ base: "font-medium leading-none" });

export type PopoverTitleProps = JSX.HTMLAttributes<HTMLHeadingElement> & {
  children?: ComponentChildren;
};

export const PopoverTitle = ({ class: className, children, ...rest }: PopoverTitleProps) => (
  <h3 class={popoverTitle({ class: className as string | undefined })} data-slot="popover-title" {...rest}>
    {children}
  </h3>
);

