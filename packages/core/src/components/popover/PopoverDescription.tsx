import type { ComponentChildren, HTMLAttributes } from "preact";
import { tv } from "tailwind-variants";
import { cn } from "../../lib/utils";

export const popoverDescription = tv({ base: "text-muted-foreground text-sm" });

export type PopoverDescriptionProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ComponentChildren;
};

export const PopoverDescription = ({
  class: className,
  children,
  ...rest
}: PopoverDescriptionProps) => (
  <p class={cn(popoverDescription(), className)} data-slot="popover-description" {...rest}>
    {children}
  </p>
);
