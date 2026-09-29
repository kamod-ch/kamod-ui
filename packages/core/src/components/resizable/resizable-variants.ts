import { tv } from "tailwind-variants";

export const resizablePanelGroup = tv({
  base: "flex h-full w-full overflow-hidden",
  variants: {
    direction: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    direction: "horizontal",
  },
});

export const resizablePanel = tv({
  base: "relative min-h-0 min-w-0 overflow-auto outline-none",
});

export const resizableHandle = tv({
  base: [
    "bg-border focus-visible:ring-ring/50 relative shrink-0 outline-none focus-visible:ring-3",
    "after:bg-border after:absolute after:opacity-0 hover:after:opacity-100 focus-visible:after:opacity-100",
    "touch-none select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
  ],
  variants: {
    direction: {
      horizontal: [
        "w-3 cursor-col-resize",
        "after:inset-y-0 after:left-1/2 after:w-px after:-translate-x-1/2",
      ],
      vertical: [
        "h-3 cursor-row-resize",
        "after:inset-x-0 after:top-1/2 after:h-px after:-translate-y-1/2",
      ],
    },
  },
  defaultVariants: {
    direction: "horizontal",
  },
});
