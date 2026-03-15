import type { ComponentChildren, JSX } from "preact";
import { tv, type VariantProps } from "tailwind-variants";

export const kbd = tv({
  base: [
    "pointer-events-none inline-flex select-none items-center justify-center gap-1 whitespace-nowrap",
    "rounded-md border border-border bg-muted font-mono font-medium text-muted-foreground shadow-xs",
    "data-[icon=inline-end]:translate-x-0.5"
  ],
  variants: {
    size: {
      sm: "h-5 min-h-5 min-w-5 px-1.5 text-[11px] leading-none",
      md: "h-6 min-h-6 min-w-6 px-2 text-xs leading-none"
    }
  },
  defaultVariants: {
    size: "md"
  }
});

export type KbdProps = Omit<JSX.HTMLAttributes<HTMLElement>, "size"> &
  VariantProps<typeof kbd> & {
    children?: ComponentChildren;
  };

export const Kbd = ({ class: className, size, children, ...rest }: KbdProps) => (
  <kbd data-slot="kbd" class={kbd({ size, class: className as string | undefined })} {...rest}>
    {children}
  </kbd>
);
