import type { JSX } from "preact";
import { tv, type VariantProps } from "tailwind-variants";

export const input = tv({
  base: [
    "border-input dark:bg-input/30 text-foreground min-w-0 w-full rounded-md border bg-transparent shadow-xs",
    "outline-none focus-visible:border-outline focus-visible:ring-outline/50 transition-[color,box-shadow] focus-visible:ring-3",
    "selection:bg-primary/20 selection:text-foreground",
    "file:text-foreground file:my-auto file:me-4 file:h-full file:border-0 file:bg-transparent file:text-sm file:font-medium",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "aria-invalid:border-error aria-invalid:focus-visible:ring-error/40",
    "peer placeholder:text-muted-foreground"
  ],
  variants: {
    size: { sm: "h-7 px-2.5 text-sm", md: "h-8 px-3 text-sm", lg: "h-9 px-3.5 text-base" }
  },
  defaultVariants: { size: "md" }
});

export type InputProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "size"> &
  VariantProps<typeof input>;

export const Input = ({ size, class: className, ...rest }: InputProps) => (
  <input class={input({ size, class: className as string | undefined })} data-slot="input" {...rest} />
);

