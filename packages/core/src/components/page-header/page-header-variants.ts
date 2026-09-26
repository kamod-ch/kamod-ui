import { tv } from "tailwind-variants";

export const pageHeader = tv({
  base: [
    "@container/page-header grid w-full min-w-0 gap-4",
    "has-data-[slot=page-header-actions]:@max-[31.999rem]/page-header:gap-3",
    "has-data-[slot=page-header-actions]:@min-[32rem]/page-header:grid-cols-[minmax(0,1fr)_auto]",
    "has-data-[slot=page-header-actions]:@min-[32rem]/page-header:items-start",
    "has-data-[slot=page-header-actions]:@min-[32rem]/page-header:gap-x-6",
    "[&>[data-slot=breadcrumb]]:col-span-full",
    "[&>[data-slot=page-header-footer]]:col-span-full",
  ],
});

export const pageHeaderHeading = tv({
  base: "min-w-0 space-y-1.5",
});

export const pageHeaderTitle = tv({
  base: "font-heading text-foreground min-w-0 font-semibold tracking-tight text-balance break-words [overflow-wrap:anywhere] @max-[31.999rem]/page-header:text-xl @max-[31.999rem]/page-header:leading-snug @min-[32rem]/page-header:text-2xl @min-[32rem]/page-header:leading-tight",
  variants: {
    size: {
      default: "",
      sm: "text-xl leading-tight @min-[32rem]/page-header:text-xl",
      lg: "text-2xl leading-tight @min-[32rem]/page-header:text-3xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export const pageHeaderDescription = tv({
  base: "text-muted-foreground min-w-0 text-sm leading-relaxed break-words [overflow-wrap:anywhere]",
});

export const pageHeaderActions = tv({
  base: [
    "flex w-full min-w-0 shrink-0 flex-col gap-2 @min-[32rem]/page-header:w-auto @min-[32rem]/page-header:flex-row @min-[32rem]/page-header:flex-wrap @min-[32rem]/page-header:justify-end",
    "@max-[31.999rem]/page-header:[&>*]:w-full",
  ],
});

export const pageHeaderFooter = tv({
  base: "min-w-0 pt-1",
});
