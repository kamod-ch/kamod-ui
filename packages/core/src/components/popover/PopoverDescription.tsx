import type { ComponentChildren, JSX } from "preact";
import { tv } from "tailwind-variants";

export const popoverDescription = tv({ base: "text-muted-foreground text-sm" });

export type PopoverDescriptionProps = JSX.HTMLAttributes<HTMLParagraphElement> & {
  children?: ComponentChildren;
};

export const PopoverDescription = ({ class: className, children, ...rest }: PopoverDescriptionProps) => (
  <p class={popoverDescription({ class: className as string | undefined })} data-slot="popover-description" {...rest}>
    {children}
  </p>
);

