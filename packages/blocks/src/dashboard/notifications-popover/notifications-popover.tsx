import { BellIcon, CheckCheckIcon, XIcon } from "@kamod-ch/icons/lucide";
import {
  Badge,
  Button,
  ButtonVariants,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { isValidElement } from "preact";
import { useState } from "preact/hooks";
import { classifyDayGroup, formatDayLabel, formatTime, useControllableState } from "../../shared";
import { groupBy } from "../../shared/collection";

export type NotificationItem = {
  id: string;
  title: string;
  body?: string;
  createdAt: string | Date;
  read?: boolean;
};

export type NotificationsPopoverProps = {
  items?: NotificationItem[];
  defaultItems?: NotificationItem[];
  title?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onDismiss?: (id: string) => void;
  onMarkAllRead?: () => void;
  trigger?:
    | ComponentChildren
    | ((state: { open: boolean; unreadCount: number }) => ComponentChildren);
  locale?: string;
  timeZone?: string;
  now?: Date;
  /** Drop preview chrome so the popover can sit in a topbar. */
  embedded?: boolean;
};

const defaultNotifications: NotificationItem[] = [
  {
    id: "n1",
    title: "Design review starts in 15 minutes",
    body: "Studio B · with Maya Chen",
    createdAt: "2026-08-14T12:45:00.000Z",
    read: false,
  },
  {
    id: "n2",
    title: "Invoice #1842 was paid",
    body: "Acme Inc. · $2,400.00",
    createdAt: "2026-08-13T18:12:00.000Z",
    read: false,
  },
  {
    id: "n3",
    title: "New comment on checkout flow",
    body: "Tomoko asked for a reduced-motion pass.",
    createdAt: "2026-08-12T09:04:00.000Z",
    read: true,
  },
];

const toDate = (value: string | Date): Date => (value instanceof Date ? value : new Date(value));

export const NotificationsPopover = ({
  items: itemsProp,
  defaultItems = defaultNotifications,
  title = "Notifications",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onDismiss,
  onMarkAllRead,
  trigger,
  locale,
  timeZone,
  now,
  embedded = false,
}: NotificationsPopoverProps) => {
  const isItemsControlled = itemsProp !== undefined;
  const [internalItems, setInternalItems] = useState(defaultItems);
  const items = isItemsControlled ? itemsProp : internalItems;
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const unreadCount = items.filter((item) => !item.read).length;
  const reference = now ?? new Date();

  const dismiss = (id: string) => {
    onDismiss?.(id);
    if (!isItemsControlled) {
      setInternalItems((current) => current.filter((item) => item.id !== id));
    }
  };

  const markAllRead = () => {
    onMarkAllRead?.();
    if (!isItemsControlled) {
      setInternalItems((current) => current.map((item) => ({ ...item, read: true })));
    }
  };

  const triggerState = { open, unreadCount };
  const resolvedTrigger = typeof trigger === "function" ? trigger(triggerState) : trigger;
  const customTrigger = isValidElement(resolvedTrigger) ? resolvedTrigger : null;
  const defaultTrigger = (
    <>
      <BellIcon size={16} aria-hidden="true" />
      {unreadCount > 0 ? (
        <Badge
          variant="destructive"
          size="xxs"
          class="absolute -top-1 -right-1 min-w-4 justify-center px-1"
        >
          {unreadCount}
        </Badge>
      ) : null}
    </>
  );

  const renderList = (list: NotificationItem[], emptyLabel: string) => {
    if (list.length === 0) {
      return (
        <Empty class="min-h-32 border-0 p-4">
          <EmptyHeader>
            <EmptyTitle>You're all caught up</EmptyTitle>
            <EmptyDescription>{emptyLabel}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      );
    }

    const grouped = groupBy(
      list,
      (item) => classifyDayGroup(toDate(item.createdAt), reference, timeZone).kind,
    );
    const order = ["today", "yesterday", "previous-7-days", "earlier", "date"] as const;

    return (
      <div class="grid max-h-80 gap-3 overflow-y-auto pr-1">
        {order.map((kind) => {
          const bucket = grouped[kind];
          if (!bucket?.length) return null;
          return (
            <section key={kind} class="grid gap-1.5">
              <h3 class="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
                {formatDayLabel(toDate(bucket[0].createdAt), reference, { locale, timeZone })}
              </h3>
              <ul class="grid gap-1">
                {bucket.map((item) => (
                  <li key={item.id}>
                    <div
                      class="hover:bg-muted/50 flex items-start gap-2 rounded-md p-2"
                      data-read={item.read ? "true" : "false"}
                    >
                      <span
                        class={`mt-1.5 size-1.5 shrink-0 rounded-full ${item.read ? "bg-border" : "bg-primary"}`}
                        aria-hidden="true"
                      />
                      <div class="min-w-0 flex-1">
                        <p class="text-sm font-medium">{item.title}</p>
                        {item.body ? (
                          <p class="text-muted-foreground text-xs">{item.body}</p>
                        ) : null}
                        <p class="text-muted-foreground mt-0.5 text-[11px]">
                          {formatTime(toDate(item.createdAt), { locale, timeZone })}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Dismiss ${item.title}`}
                        onClick={() => dismiss(item.id)}
                      >
                        <XIcon size={12} aria-hidden="true" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    );
  };

  return (
    <div
      data-slot="block-notifications-popover"
      class={
        embedded
          ? "text-foreground"
          : "flex min-h-[240px] items-start justify-end bg-background p-6 text-foreground"
      }
    >
      <Popover open={open} onOpenChange={setOpen} class="relative">
        {customTrigger ? (
          <PopoverTrigger asChild>{customTrigger}</PopoverTrigger>
        ) : (
          <PopoverTrigger
            class={ButtonVariants.button({ variant: "outline", size: "icon", class: "relative" })}
            aria-label="Open notifications"
          >
            {defaultTrigger}
          </PopoverTrigger>
        )}
        <PopoverContent align="end" class="w-[min(22rem,calc(100vw-2rem))] gap-3 p-3 sm:w-96">
          <PopoverHeader class="flex flex-row items-center justify-between gap-2 space-y-0 p-0">
            <PopoverTitle>{title}</PopoverTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={unreadCount === 0}
              onClick={markAllRead}
            >
              <CheckCheckIcon size={14} aria-hidden="true" />
              Mark all read
            </Button>
          </PopoverHeader>
          <Tabs defaultValue="all">
            <TabsList variant="line" class="w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">
                Unread {unreadCount ? `(${unreadCount})` : ""}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" class="pt-3">
              {renderList(items, "You have no notifications.")}
            </TabsContent>
            <TabsContent value="unread" class="pt-3">
              {renderList(
                items.filter((item) => !item.read),
                "No unread notifications.",
              )}
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
};
