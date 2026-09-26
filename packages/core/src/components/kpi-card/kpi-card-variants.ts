import { tv } from "tailwind-variants";

export const kpiCard = tv({
  base: "@container/kpi-card group/kpi-card w-full min-w-[12rem] max-w-full",
  variants: {
    size: {
      default: "gap-5 py-5",
      sm: "gap-4 py-4",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export const kpiCardLabel = tv({
  base: "text-muted-foreground min-w-0 flex-1 text-xs font-medium text-pretty [overflow-wrap:anywhere] line-clamp-2",
});

export const kpiCardValue = tv({
  base: "text-foreground min-w-0 flex-1 text-2xl leading-none font-semibold tracking-tight tabular-nums whitespace-nowrap group-data-[size=sm]/kpi-card:text-xl @max-[14rem]/kpi-card:text-xl",
});

export const kpiCardComparison = tv({
  base: "text-muted-foreground min-w-0 text-xs text-pretty [overflow-wrap:anywhere] line-clamp-2",
});

export const kpiCardDescription = tv({
  base: "text-muted-foreground min-w-0 text-xs leading-relaxed text-pretty [overflow-wrap:anywhere] line-clamp-3",
});

export const kpiCardTrend = tv({
  base: "inline-flex max-w-full min-w-0 items-center gap-1 text-xs font-medium tabular-nums",
  variants: {
    sentiment: {
      positive: "text-success",
      negative: "text-destructive",
      neutral: "text-muted-foreground",
    },
  },
  defaultVariants: {
    sentiment: "neutral",
  },
});

export const kpiCardGrid = tv({
  base: "grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4",
});
