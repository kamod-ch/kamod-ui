import type { ComponentChildren, HTMLAttributes } from "preact";
import { cn } from "../../lib/utils";

export type FieldGroupProps = HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const FieldGroup = ({ class: className, children, ...rest }: FieldGroupProps) => (
  <div
    class={cn("flex flex-col gap-6 @container/field-group", className)}
    data-slot="field-group"
    {...rest}
  >
    {children}
  </div>
);
