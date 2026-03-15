import type { JSX } from "preact";
import { tv, type VariantProps } from "tailwind-variants";

export const textarea = tv({
  base: [
    "border-input/70 bg-background/80 text-foreground ring-offset-background min-h-16 w-full rounded-lg border shadow-xs",
    "px-3 py-2 leading-relaxed transition-[color,box-shadow,border-color] outline-none resize-y",
    "placeholder:text-muted-foreground/80",
    "focus-visible:border-outline focus-visible:ring-outline/45 focus-visible:ring-3",
    "file:text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "aria-invalid:border-error aria-invalid:focus-visible:ring-error/40 aria-invalid:focus-visible:border-error",
    "peer"
  ],
  variants: {
    size: {
      sm: "min-h-16 px-2.5 py-1.5 text-sm",
      md: "min-h-16 px-3 py-2 text-base",
      lg: "min-h-24 px-4 py-3 text-lg"
    }
  },
  defaultVariants: { size: "md" }
});

export type TextareaProps = Omit<JSX.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> &
  VariantProps<typeof textarea>;

export const Textarea = ({ size, class: className, ...rest }: TextareaProps) => (
  <textarea
    class={textarea({ size, class: className as string | undefined })}
    data-slot="textarea"
    {...rest}
  />
);

