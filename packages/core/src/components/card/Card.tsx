import type { ComponentChildren, JSX } from "preact";
import { tv, type VariantProps } from "tailwind-variants";

export const card = tv({
  base: [
    "bg-card text-card-foreground group/card ring-border flex min-w-0 flex-col rounded-xl ring-1",
    "has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0",
    "*:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl"
  ],
  variants: {
    size: {
      default: "gap-6 py-6",
      sm: "gap-4 py-4 text-sm"
    }
  },
  defaultVariants: {
    size: "default"
  }
});

export type CardProps = JSX.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof card> & {
    children?: ComponentChildren;
  };

export const Card = ({ class: className, size, children, ...rest }: CardProps) => (
  <div
    class={card({ size, class: className as string | undefined })}
    data-slot="card"
    data-size={size ?? "default"}
    {...rest}
  >
    {children}
  </div>
);

