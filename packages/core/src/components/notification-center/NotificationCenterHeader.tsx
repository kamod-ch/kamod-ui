import type { JSX } from "preact";
import { cn } from "../../lib/utils";
import { Alert, AlertDescription } from "../alert";
import { Button } from "../button/Button";
import { PopoverHeader } from "../popover/PopoverHeader";
import { PopoverTitle } from "../popover/PopoverTitle";
import { SheetHeader } from "../sheet/SheetHeader";
import { SheetTitle } from "../sheet/SheetTitle";
import { useNotificationCenter } from "./notification-center-context";
import { CheckCheckIcon } from "./notification-center-icons";
import { MARK_ALL_READ_ACTION_ID } from "./notification-center-utils";
import { notificationCenterHeader } from "./notification-center-variants";

export type NotificationCenterHeaderProps = {
  title: string;
  markAllReadLabel: string;
  onMarkAllRead?: () => void;
  class?: string;
};

export const NotificationCenterHeader = ({
  title,
  markAllReadLabel,
  onMarkAllRead,
  class: className,
}: NotificationCenterHeaderProps) => {
  const { unreadCount, isMobile, pendingActionId, errorActionId } = useNotificationCenter();
  const pending = pendingActionId === MARK_ALL_READ_ACTION_ID;
  const error = errorActionId === MARK_ALL_READ_ACTION_ID;

  const markAllButton = onMarkAllRead ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={unreadCount === 0 || pending}
      aria-busy={pending}
      onClick={onMarkAllRead}
    >
      <CheckCheckIcon size={14} />
      {markAllReadLabel}
    </Button>
  ) : null;

  const errorAlert =
    error && onMarkAllRead ? (
      <Alert variant="destructive" class="mt-2">
        <AlertDescription>Could not mark all notifications as read.</AlertDescription>
      </Alert>
    ) : null;

  if (isMobile) {
    return (
      <div class={cn("space-y-2", className)} data-slot="notification-center-header">
        <SheetHeader class="space-y-0 p-0 text-start">
          <div class={notificationCenterHeader()}>
            <SheetTitle>{title}</SheetTitle>
            {markAllButton}
          </div>
        </SheetHeader>
        {errorAlert}
      </div>
    );
  }

  return (
    <div class={cn("space-y-2", className)} data-slot="notification-center-header">
      <PopoverHeader class={notificationCenterHeader({ class: "space-y-0 p-0" })}>
        <PopoverTitle>{title}</PopoverTitle>
        {markAllButton}
      </PopoverHeader>
      {errorAlert}
    </div>
  );
};
