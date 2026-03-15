import type { JSX } from "preact";
import { tv, type VariantProps } from "tailwind-variants";

export const label = tv({
  base: [
    "text-foreground select-none font-medium leading-none",
    "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    "has-[+:disabled]:cursor-not-allowed has-[+:disabled]:opacity-70"
  ],
  variants: { size: { sm: "text-sm", md: "text-base", lg: "text-lg" } },
  defaultVariants: { size: "sm" }
});

export type LabelProps = Omit<JSX.LabelHTMLAttributes<HTMLLabelElement>, "size"> &
  VariantProps<typeof label>;

export const Label = ({ size, class: className, ...rest }: LabelProps) => (
  <label class={label({ size, class: className as string | undefined })} data-slot="label" {...rest} />
);

