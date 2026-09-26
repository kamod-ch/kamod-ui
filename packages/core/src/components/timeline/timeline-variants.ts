import { tv } from "tailwind-variants";

export const timeline = tv({
  base: "relative m-0 flex w-full min-w-0 list-none flex-col p-0",
});

export const timelineItem = tv({
  base: "relative flex min-w-0 gap-3 pb-8 last:pb-0 [dir=rtl]:flex-row-reverse",
});

export const timelineIndicator = tv({
  base: "relative flex w-8 shrink-0 flex-col items-center",
});

export const timelineLine = tv({
  base: [
    "bg-border pointer-events-none absolute start-1/2 top-6 bottom-0 w-px -translate-x-1/2",
    "group-last/timeline-item:hidden",
    "[dir=rtl]:translate-x-1/2",
  ],
});

export const timelineMarker = tv({
  base: [
    "border-border bg-background relative z-[1] flex shrink-0 items-center justify-center rounded-full border",
    "size-2.5",
  ],
  variants: {
    size: {
      default: "size-2.5",
      md: "size-8",
      lg: "size-10",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export const timelineContent = tv({
  base: "min-w-0 flex-1 space-y-1 pt-0.5 [overflow-wrap:anywhere]",
});

export const timelineTime = tv({
  base: "text-muted-foreground block text-xs tabular-nums",
});

export const timelineTitle = tv({
  base: "text-foreground text-sm font-medium leading-snug [overflow-wrap:anywhere]",
});

export const timelineDescription = tv({
  base: "text-muted-foreground text-sm leading-relaxed [overflow-wrap:anywhere]",
});

export const timelineActions = tv({
  base: "flex flex-wrap items-center gap-2 pt-1",
});
