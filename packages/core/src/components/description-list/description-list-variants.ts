import { tv } from "tailwind-variants";

export const descriptionList = tv({
  base: "grid w-full min-w-0 gap-x-6 gap-y-4",
  variants: {
    layout: {
      stacked:
        "[&_[data-slot=description-list-item]]:flex [&_[data-slot=description-list-item]]:min-w-0 [&_[data-slot=description-list-item]]:flex-col [&_[data-slot=description-list-item]]:gap-1",
      inline:
        "[&_[data-slot=description-list-item]]:grid [&_[data-slot=description-list-item]]:min-w-0 [&_[data-slot=description-list-item]]:grid-cols-1 [&_[data-slot=description-list-item]]:gap-x-4 [&_[data-slot=description-list-item]]:gap-y-1 [&_[data-slot=description-list-item]]:sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] [&_[data-slot=description-list-item]]:sm:items-start",
    },
    columns: {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
    },
    bordered: {
      true: "[&_[data-slot=description-list-item]]:border-border [&_[data-slot=description-list-item]]:border-b [&_[data-slot=description-list-item]]:pb-4 [&_[data-slot=description-list-item]]:last:border-b-0",
      false: "",
    },
  },
  defaultVariants: {
    layout: "stacked",
    columns: 1,
    bordered: false,
  },
});

export const descriptionListItem = tv({
  base: "min-w-0",
});

export const descriptionListTerm = tv({
  base: "text-muted-foreground min-w-0 text-sm leading-snug font-medium break-words",
});

export const descriptionListDetails = tv({
  base: "text-foreground min-w-0 text-sm leading-relaxed [overflow-wrap:anywhere] break-words",
});
