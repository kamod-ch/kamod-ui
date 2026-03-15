import type { ComponentChildren, JSX } from "preact";
import { tv } from "tailwind-variants";

export const popoverHeader = tv({ base: "flex flex-col gap-1.5" });

export type PopoverHeaderProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const PopoverHeader = ({ class: className, children, ...rest }: PopoverHeaderProps) => (
  <div class={popoverHeader({ class: className as string | undefined })} data-slot="popover-header" {...rest}>
    {children}
  </div>
);

