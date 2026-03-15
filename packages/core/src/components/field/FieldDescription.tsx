import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type FieldDescriptionProps = JSX.HTMLAttributes<HTMLParagraphElement> & {
  children?: ComponentChildren;
};

export const FieldDescription = ({ class: className, children, ...rest }: FieldDescriptionProps) => (
  <p class={cn("text-muted-foreground text-sm leading-normal font-normal", className)} data-slot="field-description" {...rest}>
    {children}
  </p>
);
