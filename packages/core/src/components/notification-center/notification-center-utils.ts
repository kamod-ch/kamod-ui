import type { NotificationFilter, NotificationRecord } from "./notification-center-types";

export const filterNotifications = (
  items: NotificationRecord[],
  filter: NotificationFilter,
): NotificationRecord[] => (filter === "unread" ? items.filter((item) => !item.read) : items);

export const MARK_ALL_READ_ACTION_ID = "mark-all-read";
export const LOAD_MORE_ACTION_ID = "load-more";
