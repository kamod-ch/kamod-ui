import { tv } from "tailwind-variants";

export const filterBar = tv({
  base: "flex w-full min-w-0 flex-col gap-3",
});

export const filterBarSearch = tv({
  base: "flex min-w-0 flex-1 flex-col gap-1.5 sm:min-w-[12rem] sm:max-w-md",
});

export const filterBarControls = tv({
  base: "flex min-w-0 flex-wrap items-end gap-2",
});

export const filterBarChips = tv({
  base: "flex min-w-0 flex-1 flex-wrap items-center gap-1.5",
});

export const filterBarChip = tv({
  base: [
    "border-border bg-muted/40 text-foreground inline-flex max-w-full min-w-0 items-center gap-1 rounded-full border px-2 py-0.5 text-xs",
    "[dir=rtl]:flex-row-reverse",
  ],
});

export const filterBarChipLabel = tv({
  base: "min-w-0 truncate [overflow-wrap:anywhere]",
});

export const filterBarChipRemove = tv({
  base: [
    "text-muted-foreground hover:text-foreground inline-flex size-5 shrink-0 items-center justify-center rounded-full transition-colors",
    "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
  ],
});

export const filterBarMeta = tv({
  base: "flex shrink-0 flex-wrap items-center gap-2 sm:ms-auto",
});

export const filterBarResultCount = tv({
  base: "text-muted-foreground min-w-0 text-sm [overflow-wrap:anywhere]",
});

export const filterBarReset = tv({
  base: "shrink-0",
});
