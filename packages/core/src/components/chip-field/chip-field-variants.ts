import { tv } from "tailwind-variants";

export const chipFieldContainer = tv({
  base: "border-input bg-background flex min-h-8 w-full flex-wrap items-center gap-1 rounded-md border px-2 py-1 shadow-xs outline-none focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
});

export const removableChip = tv({
  base: "bg-secondary text-secondary-foreground inline-flex max-w-full items-center gap-0.5 rounded-md px-2 py-0.5 text-xs",
});
