import type { ComponentChildren } from "preact";

export type NotificationFilter = "all" | "unread";

export type NotificationRecord = {
  id: string;
  title: ComponentChildren;
  body?: ComponentChildren;
  createdAt: Date | string;
  read?: boolean;
  href?: string;
};

export type NotificationCenterLabels = {
  trigger: string;
  triggerUnread?: (count: number) => string;
  title: string;
  markAllRead: string;
  filterAll: string;
  filterUnread: string;
  emptyAll: string;
  emptyUnread: string;
  markRead?: (item: NotificationRecord) => string;
  remove?: (item: NotificationRecord) => string;
  loadMore?: string;
};
