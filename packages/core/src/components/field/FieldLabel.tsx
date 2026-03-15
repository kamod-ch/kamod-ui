import type { JSX } from "preact";
import { cn } from "../../lib/utils";
import { label as labelStyles } from "../label/Label";

export type FieldLabelProps = JSX.LabelHTMLAttributes<HTMLLabelElement>;

export const FieldLabel = ({ class: className, ...rest }: FieldLabelProps) => (
  <label
    class={cn(
      labelStyles({ size: "sm" }),
      "group-data-[disabled]/field:pointer-events-none group-data-[disabled]/field:opacity-50",
      className
    )}
    data-slot="field-label"
    {...rest}
  />
);
