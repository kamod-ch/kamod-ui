import type { ComponentChildren, JSX } from "preact";
import { isValidElement } from "preact";
import { cn } from "../../lib/utils";
import { Badge } from "../badge/Badge";
import { button } from "../button/Button";
import { PopoverTrigger } from "../popover/PopoverTrigger";
import { SheetTrigger } from "../sheet/SheetTrigger";
import { useNotificationCenter } from "./notification-center-context";
import { BellIcon } from "./notification-center-icons";

export type NotificationCenterTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ComponentChildren;
  /** Accessible name when unreadCount is zero. */
  label: string;
  /** Formats trigger label when unreadCount > 0. Defaults to `${label}, ${count} unread`. */
  unreadLabel?: (count: number) => string;
  asChild?: boolean;
};

export const NotificationCenterTrigger = ({
  children,
  label,
  unreadLabel,
  class: className,
  asChild = false,
  ...rest
}: NotificationCenterTriggerProps) => {
  const { unreadCount, isMobile } = useNotificationCenter();
  const Trigger = isMobile ? SheetTrigger : PopoverTrigger;

  const ariaLabel =
    unreadCount > 0 ? (unreadLabel?.(unreadCount) ?? `${label}, ${unreadCount} unread`) : label;

  const badge =
    unreadCount > 0 ? (
      <Badge
        variant="destructive"
        size="xxs"
        class="absolute -top-1 -right-1 min-w-4 justify-center px-1"
        aria-hidden="true"
      >
        {unreadCount > 99 ? "99+" : unreadCount}
      </Badge>
    ) : null;

  const defaultContent = (
    <>
      <BellIcon size={16} />
      {badge}
    </>
  );

  if (asChild && isValidElement(children)) {
    return (
      <Trigger asChild aria-label={ariaLabel} {...rest}>
        {children}
      </Trigger>
    );
  }

  return (
    <Trigger
      aria-label={ariaLabel}
      class={cn(button({ variant: "outline", size: "icon", class: "relative" }), className)}
      data-slot="notification-center-trigger"
      {...rest}
    >
      {children ?? defaultContent}
    </Trigger>
  );
};
