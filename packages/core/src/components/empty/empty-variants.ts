import { tv, type VariantProps } from "tailwind-variants";

/** Composable Empty root (shadcn-aligned). */
export const emptyRoot = tv({
  base: "group/empty flex w-full flex-col items-center justify-center gap-6 text-balance text-center"
});

export type EmptyRootVariants = VariantProps<typeof emptyRoot>;

export const emptyMedia = tv({
  base: "mb-0 flex shrink-0 justify-center",
  variants: {
    variant: {
      default: "",
      icon: [
        "mb-2 flex size-10 items-center justify-center rounded-md border bg-muted text-muted-foreground",
        "[&_svg:not([class*='size-'])]:size-6"
      ]
    }
  },
  defaultVariants: {
    variant: "default"
  }
});
