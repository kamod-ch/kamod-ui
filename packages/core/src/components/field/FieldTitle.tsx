import type { ComponentChildren, HTMLAttributes } from "preact";
import { cn } from "../../lib/utils";

export type FieldTitleProps = HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const FieldTitle = ({ class: className, children, ...rest }: FieldTitleProps) => (
  <div class={cn("text-sm leading-none font-medium", className)} data-slot="field-title" {...rest}>
    {children}
  </div>
);
