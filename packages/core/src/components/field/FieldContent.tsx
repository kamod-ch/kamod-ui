import type { ComponentChildren, HTMLAttributes } from "preact";
import { cn } from "../../lib/utils";

export type FieldContentProps = HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const FieldContent = ({ class: className, children, ...rest }: FieldContentProps) => (
  <div class={cn("flex flex-1 flex-col gap-1", className)} data-slot="field-content" {...rest}>
    {children}
  </div>
);
