import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type DialogDescriptionProps = JSX.HTMLAttributes<HTMLParagraphElement> & {
  children?: ComponentChildren;
};

export const DialogDescription = ({ class: className, children, ...rest }: DialogDescriptionProps) => (
  <p data-slot="dialog-description" class={cn("text-muted-foreground text-sm", className)} {...rest}>
    {children}
  </p>
);
