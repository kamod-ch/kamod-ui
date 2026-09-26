import { tv } from "tailwind-variants";

export const stepper = tv({
  base: "flex w-full min-w-0 flex-col gap-4",
});

export const stepperList = tv({
  base: "flex min-w-0 list-none p-0",
  variants: {
    orientation: {
      horizontal: "flex-row flex-wrap items-start gap-2 sm:gap-4",
      vertical: "flex-col gap-3",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export const stepperItem = tv({
  base: "relative flex min-w-0 flex-1 items-start gap-2",
  variants: {
    orientation: {
      horizontal: "min-w-[8rem] flex-col sm:flex-row sm:items-center",
      vertical: "flex-row items-start",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export const stepperTrigger = tv({
  base: [
    "inline-flex min-w-0 items-start gap-2 rounded-md text-start outline-none",
    "focus-visible:ring-ring focus-visible:ring-3",
    "disabled:cursor-default disabled:opacity-100",
    "[dir=rtl]:flex-row-reverse",
  ],
  variants: {
    interactive: {
      true: "cursor-pointer hover:bg-muted/50",
      false: "cursor-default",
    },
  },
  defaultVariants: {
    interactive: false,
  },
});

export const stepperIndicator = tv({
  base: [
    "inline-flex shrink-0 items-center justify-center rounded-full border font-medium tabular-nums transition-colors",
    "data-[status=upcoming]:border-border data-[status=upcoming]:bg-background data-[status=upcoming]:text-muted-foreground",
    "data-[status=current]:border-primary data-[status=current]:bg-primary data-[status=current]:text-primary-foreground",
    "data-[status=completed]:border-primary data-[status=completed]:bg-primary data-[status=completed]:text-primary-foreground",
    "data-[status=error]:border-destructive data-[status=error]:bg-destructive data-[status=error]:text-destructive-foreground",
  ],
  variants: {
    size: {
      default: "size-8 text-sm",
      sm: "size-7 text-xs",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export const stepperTitle = tv({
  base: "text-sm font-medium leading-none [overflow-wrap:anywhere]",
  variants: {
    status: {
      upcoming: "text-muted-foreground",
      current: "text-foreground",
      completed: "text-foreground",
      error: "text-destructive",
    },
  },
  defaultVariants: {
    status: "upcoming",
  },
});

export const stepperDescription = tv({
  base: "text-muted-foreground mt-1 text-xs [overflow-wrap:anywhere]",
});

export const stepperSeparator = tv({
  base: "bg-border shrink-0",
  variants: {
    orientation: {
      horizontal: "hidden h-px flex-1 self-center sm:block",
      vertical: "ms-4 hidden w-px self-stretch sm:block",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export const stepperPosition = tv({
  base: "text-muted-foreground text-sm tabular-nums sm:hidden",
});

export const stepperContent = tv({
  base: "min-w-0 outline-none focus:outline-none",
});
