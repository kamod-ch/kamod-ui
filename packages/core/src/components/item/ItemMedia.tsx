import type { ComponentChildren, JSX } from "preact";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../../lib/utils";

export const itemMedia = tv({
  base: [
    "flex shrink-0 items-center justify-center gap-2",
    "group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start",
    "[&_svg]:pointer-events-none",
  ],
  variants: {
    variant: {
      default: "bg-transparent",
      icon: "bg-muted size-8 rounded-sm border [&_svg:not([class*='size-'])]:size-4",
      image: "size-10 overflow-hidden rounded-sm [&_img]:size-full [&_img]:object-cover",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type ItemMediaProps = JSX.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof itemMedia> & {
    children?: ComponentChildren;
  };

export const ItemMedia = ({ variant, class: className, children, ...rest }: ItemMediaProps) => {
  const resolvedVariant = variant ?? "default";
  return (
    <div
      data-slot="item-media"
      data-variant={resolvedVariant}
      class={cn(itemMedia({ variant: resolvedVariant, class: className as string | undefined }))}
      {...rest}
    >
      {children}
    </div>
  );
};
