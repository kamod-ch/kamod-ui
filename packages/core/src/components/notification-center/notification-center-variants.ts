import { tv } from "tailwind-variants";

export const notificationCenter = tv({
  base: "relative inline-flex",
});

export const notificationCenterContent = tv({
  base: "flex min-h-0 flex-col gap-3",
});

export const notificationCenterHeader = tv({
  base: "flex items-center justify-between gap-2",
});

export const notificationList = tv({
  base: "flex min-h-0 flex-1 flex-col gap-3",
});

export const notificationListScroll = tv({
  base: "max-h-80 min-h-0",
});

export const notificationItem = tv({
  base: "hover:bg-muted/50 flex items-start gap-2 rounded-md p-2",
  variants: {
    read: {
      true: "opacity-80",
      false: "",
    },
  },
  defaultVariants: {
    read: false,
  },
});

export const notificationItemUnreadDot = tv({
  base: "mt-1.5 size-1.5 shrink-0 rounded-full",
  variants: {
    read: {
      true: "bg-border",
      false: "bg-primary",
    },
  },
  defaultVariants: {
    read: false,
  },
});
