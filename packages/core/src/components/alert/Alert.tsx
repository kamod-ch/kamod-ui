import type { ComponentChildren, JSX } from "preact";
import { tv, type VariantProps } from "tailwind-variants";

export const alert = tv({
  base: [
    "group/alert relative grid w-full gap-y-0.5 rounded-lg border px-4 py-3 text-left text-sm",
    "[&:has(>[data-slot=alert-action])]:relative [&:has(>[data-slot=alert-action])]:pr-18",
    "[&:has(>svg)]:grid-cols-[auto_1fr] [&:has(>svg)]:gap-x-3",
    "[&:has(>svg)_[data-slot=alert-title]]:col-start-2",
    "[&:has(>svg)_[data-slot=alert-description]]:col-start-2 [&:has(>svg)_[data-slot=alert-description]]:row-start-2",
    "[&:has(>svg)]:items-start",
    "[&>svg]:shrink-0 [&>svg]:translate-y-0.5 [&>svg]:text-current [&>svg:not([class*='size-'])]:size-4"
  ],
  variants: {
    variant: {
      default: "border-border bg-card text-card-foreground",
      /** shadcn parity — title + icon use `text-destructive`; description muted via descendant selector. */
      destructive:
        "border-border bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 [&>svg]:text-current",
      primary: "border-primary/30 bg-primary/10 text-foreground",
      secondary: "border-secondary/40 bg-secondary/40 text-secondary-foreground",
      info: "border-info/35 bg-info/10 text-foreground",
      success: "border-success/50 bg-success/18 text-foreground shadow-[inset_0_1px_0_rgb(255_255_255_/_0.28)]",
      warning: "border-warning/40 bg-warning/12 text-foreground",
      error: "border-error/40 bg-error/10 text-foreground"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export type AlertProps = JSX.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alert> & {
  children?: ComponentChildren;
};

/** For icon + title + description layout, put the icon SVG as the first child (sibling before `AlertTitle`) so the description aligns with the title text. */
export const Alert = ({ children, variant, class: className, ...rest }: AlertProps) => (
  <div
    role="alert"
    data-slot="alert"
    data-variant={variant ?? "default"}
    class={alert({ variant, class: className as string | undefined })}
    {...rest}
  >
    {children}
  </div>
);

