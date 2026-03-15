import type { JSX } from "preact";
import { tv } from "tailwind-variants";

export const skeleton = tv({
  base: "rounded-md",
  variants: {
    variant: {
      pulse: "animate-pulse bg-muted/80",
      shimmer:
        "animate-pulse bg-[linear-gradient(110deg,hsl(var(--muted)/0.68),hsl(var(--muted)/0.9),hsl(var(--muted)/0.68))] bg-[length:220%_100%]",
      glass:
        "animate-pulse border border-border/40 bg-[linear-gradient(140deg,hsl(var(--muted)/0.34),hsl(var(--background)/0.78),hsl(var(--muted)/0.28))] backdrop-blur-[1px]"
    }
  },
  defaultVariants: {
    variant: "pulse"
  }
});

type SkeletonVariants = Parameters<typeof skeleton>[0];
type SkeletonVariant = NonNullable<SkeletonVariants>["variant"];

export type SkeletonProps = JSX.HTMLAttributes<HTMLDivElement> & {
  variant?: SkeletonVariant;
};

export const Skeleton = ({ class: className, variant, ...rest }: SkeletonProps) => (
  <div class={skeleton({ class: className as string | undefined, variant })} data-slot="skeleton" {...rest} />
);

