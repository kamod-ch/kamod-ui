import type { JSX } from "preact";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../../lib/utils";

export const fieldLegend = tv({
  base: "",
  variants: {
    variant: {
      legend: "text-base font-semibold",
      label: "text-sm font-medium"
    }
  },
  defaultVariants: { variant: "legend" }
});

export type FieldLegendProps = JSX.HTMLAttributes<HTMLLegendElement> & VariantProps<typeof fieldLegend>;

export const FieldLegend = ({ class: className, variant, ...rest }: FieldLegendProps) => (
  <legend class={cn(fieldLegend({ variant }), className)} data-slot="field-legend" {...rest} />
);
