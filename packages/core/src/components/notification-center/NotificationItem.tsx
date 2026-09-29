import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { Alert, AlertDescription } from "../alert";
import { Button } from "../button/Button";
import { formatTimelineDateTime, toTimelineDateTime } from "../timeline/timeline-utils";
import { CheckIcon, XIcon } from "./notification-center-icons";
import { notificationItem, notificationItemUnreadDot } from "./notification-center-variants";

export type NotificationItemProps = Omit<JSX.HTMLAttributes<HTMLLIElement>, "id"> & {
  /** Stable notification id — exposed as `data-item-id`. */
  itemId: string;
  title: ComponentChildren;
  body?: ComponentChildren;
  createdAt?: Date | string;
  read?: boolean;
  href?: string;
  onMarkRead?: () => void;
  onRemove?: () => void;
  markReadLabel?: string;
  removeLabel?: string;
  pending?: boolean;
  error?: boolean;
  /** Override formatted time — otherwise derived from `createdAt` when provided. */
  timeLabel?: ComponentChildren;
  locale?: string;
  timeZone?: string;
};

export const NotificationItem = ({
  itemId,
  title,
  body,
  createdAt,
  read = false,
  href,
  onMarkRead,
  onRemove,
  markReadLabel = "Mark as read",
  removeLabel = "Remove notification",
  pending = false,
  error = false,
  timeLabel,
  locale,
  timeZone,
  class: className,
  ...rest
}: NotificationItemProps) => {
  const formattedTime =
    timeLabel ??
    (createdAt
      ? formatTimelineDateTime(createdAt, {
          locale,
          timeZone,
          dateStyle: "medium",
          timeStyle: "short",
        })
      : null);
  const dateTimeAttr = createdAt ? toTimelineDateTime(createdAt) : undefined;

  const titleNode = href ? (
    <a
      href={href}
      class="text-sm font-medium underline-offset-4 hover:underline"
      data-slot="notification-item-link"
    >
      {title}
    </a>
  ) : (
    <p class="text-sm font-medium" data-slot="notification-item-title">
      {title}
    </p>
  );

  return (
    <li
      data-slot="notification-item"
      data-item-id={itemId}
      data-read={read ? "true" : "false"}
      class={cn(notificationItem({ read }), className)}
      {...rest}
    >
      <div class="flex w-full items-start gap-2">
        <span
          class={notificationItemUnreadDot({ read })}
          aria-hidden="true"
          data-slot="notification-item-indicator"
        />
        <div class="min-w-0 flex-1 space-y-0.5">
          {titleNode}
          {body ? (
            <p class="text-muted-foreground text-xs" data-slot="notification-item-body">
              {body}
            </p>
          ) : null}
          {formattedTime ? (
            <time
              class="text-muted-foreground block text-[11px]"
              dateTime={dateTimeAttr}
              data-slot="notification-item-time"
            >
              {formattedTime}
            </time>
          ) : null}
          {error ? (
            <Alert variant="destructive" class="mt-2 py-2">
              <AlertDescription>Action failed. Try again.</AlertDescription>
            </Alert>
          ) : null}
        </div>
        <div class="flex shrink-0 flex-col gap-1" data-slot="notification-item-actions">
          {onMarkRead && !read ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={markReadLabel}
              disabled={pending}
              aria-busy={pending}
              onClick={onMarkRead}
            >
              <CheckIcon size={12} />
            </Button>
          ) : null}
          {onRemove ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={removeLabel}
              disabled={pending}
              aria-busy={pending}
              onClick={onRemove}
            >
              <XIcon size={12} />
            </Button>
          ) : null}
        </div>
      </div>
    </li>
  );
};
