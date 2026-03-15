import type { JSX } from "preact";
import { cn } from "../../lib/utils";

export type FieldSetProps = JSX.FieldsetHTMLAttributes<HTMLFieldSetElement>;

export const FieldSet = ({ class: className, ...rest }: FieldSetProps) => (
  <fieldset class={cn("m-0 min-w-0 space-y-6 border-0 p-0", className)} data-slot="field-set" {...rest} />
);
