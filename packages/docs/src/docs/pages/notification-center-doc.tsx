import { createGenericDocPage } from "./create-generic-doc-page";
import { NotificationCenterDemo } from "./notification-center-demo";

const BASIC_SNIPPET = `import {
  NotificationCenter,
  NotificationCenterContent,
  NotificationCenterHeader,
  NotificationCenterTrigger,
  NotificationItem,
  NotificationList,
  filterNotifications,
} from "@/components/kamod-ui/notification-center";

export const Example = ({
  open,
  onOpenChange,
  items,
  totalUnread,
  filter,
  onFilterChange,
  pendingActionId,
  errorActionId,
}) => {
  const visible = filterNotifications(items, filter);

  return (
    <NotificationCenter
      open={open}
      onOpenChange={onOpenChange}
      unreadCount={totalUnread}
      filter={filter}
      onFilterChange={onFilterChange}
      pendingActionId={pendingActionId}
      errorActionId={errorActionId}
    >
      <NotificationCenterTrigger label={t("notifications.open")} />
      <NotificationCenterContent>
        <NotificationCenterHeader
          title={t("notifications.title")}
          markAllReadLabel={t("notifications.markAllRead")}
          onMarkAllRead={handleMarkAllRead}
        />
        <NotificationList
          loading={loading}
          error={error}
          empty={<Empty>…</Empty>}
          onLoadMore={hasMore ? handleLoadMore : undefined}
        >
          {visible.map((item) => (
            <NotificationItem
              key={item.id}
              itemId={item.id}
              title={item.title}
              body={item.body}
              createdAt={item.createdAt}
              read={item.read}
              href={item.href}
              onMarkRead={() => handleMarkRead(item.id)}
              onRemove={() => handleRemove(item.id)}
              pending={pendingActionId === item.id}
              error={errorActionId === item.id}
            />
          ))}
        </NotificationList>
      </NotificationCenterContent>
    </NotificationCenter>
  );
};`;

export const notificationCenterDocPage = createGenericDocPage({
  title: "Notification Center",
  slug: "notification-center",
  usageLabel: "Notification Center",
  previewCode: BASIC_SNIPPET,
  installationText:
    "Import from `@kamod-ch/ui/notification-center`. Uses Popover on desktop and Sheet on mobile — only one shell is active. Pass `unreadCount` separately when the visible list is paginated.",
  usageText:
    "Compose trigger, header, list, and items with controlled open state, filter, and action callbacks. Opening the panel does not mark notifications as read — use explicit mark-read actions. Navigation via `href` is separate from read status. Pending and error states use `pendingActionId` / `errorActionId`; optimistic updates belong in the consumer.",
  installationExample: {
    code: `import { NotificationCenterDemo } from "./notification-center-demo";

export const Example = () => <NotificationCenterDemo />;`,
    renderPreview: () => <NotificationCenterDemo />,
  },
  exampleSections: [
    {
      id: "interactive-demo",
      title: "Simulated notifications",
      text: "Local demo with read/unread, All/Unread filter, mark-all-read, load-more, and optional action failures. Clearly labeled as simulation — no backend integration.",
      code: `import { NotificationCenterDemo } from "./notification-center-demo";

export const Example = () => <NotificationCenterDemo />;`,
      renderPreview: () => <NotificationCenterDemo />,
    },
  ],
  apiRows: [
    { prop: "NotificationCenter", type: "root shell (Popover / Sheet)", defaultValue: "—" },
    { prop: "unreadCount", type: "number", defaultValue: "required" },
    { prop: "filter / onFilterChange", type: '"all" | "unread"', defaultValue: "internal" },
    { prop: "pendingActionId", type: "string | null", defaultValue: "null" },
    { prop: "errorActionId", type: "string | null", defaultValue: "null" },
    { prop: "liveRegionText", type: "string", defaultValue: "undefined" },
    { prop: "NotificationItem.onMarkRead", type: "callback", defaultValue: "—" },
    { prop: "NotificationItem.href", type: "string", defaultValue: "—" },
  ],
  accessibilityText:
    "Trigger exposes an accessible unread count. Item actions are separate buttons — not nested inside link or button wrappers. Optional `liveRegionText` announces new events politely; omit on initial load. Keyboard navigation follows Popover, Sheet, Tabs, and ScrollArea primitives.",
});
