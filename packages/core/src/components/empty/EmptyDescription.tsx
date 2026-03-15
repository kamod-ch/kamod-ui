import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type EmptyDescriptionProps = JSX.HTMLAttributes<HTMLParagraphElement> & {
  children?: ComponentChildren;
};

export const EmptyDescription = ({ class: className, children, ...rest }: EmptyDescriptionProps) => (
  <p class={cn("text-muted-foreground max-w-sm text-sm leading-normal", className)} data-slot="empty-description" {...rest}>
    {children}
  </p>
);
