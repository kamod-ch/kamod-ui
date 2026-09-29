import { tv } from "tailwind-variants";

export const bulkActionBar = tv({
  base: [
    "border-border bg-muted/60 text-foreground flex w-full min-w-0 flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border px-3 py-2 shadow-xs",
    "[dir=rtl]:flex-row-reverse",
    "motion-reduce:transition-none transition-[opacity,transform] duration-200 ease-out",
  ],
  variants: {
    variant: {
      default: "relative",
      sticky:
        "sticky top-0 z-10 backdrop-blur-sm supports-[backdrop-filter]:bg-muted/80 supports-[backdrop-filter]:backdrop-blur-sm",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const bulkActionBarCount = tv({
  base: "text-muted-foreground min-w-0 shrink-0 text-sm tabular-nums [overflow-wrap:anywhere]",
});

export const bulkActionBarActions = tv({
  base: [
    "flex min-w-0 flex-1 flex-wrap items-center gap-2",
    "data-[pending=true]:pointer-events-none data-[pending=true]:opacity-60",
    "[dir=rtl]:flex-row-reverse",
  ],
});

export const bulkActionBarClear = tv({
  base: "ms-auto shrink-0 [dir=rtl]:ms-0 [dir=rtl]:me-auto",
});
