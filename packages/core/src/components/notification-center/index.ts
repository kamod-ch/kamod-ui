import { NotificationCenter } from "./NotificationCenter";
import { NotificationCenterContent } from "./NotificationCenterContent";
import { NotificationCenterHeader } from "./NotificationCenterHeader";
import { NotificationCenterTrigger } from "./NotificationCenterTrigger";
import { NotificationItem } from "./NotificationItem";
import { NotificationList } from "./NotificationList";
import {
  notificationCenter,
  notificationCenterContent,
  notificationCenterHeader,
  notificationItem,
  notificationItemUnreadDot,
  notificationList,
  notificationListScroll,
} from "./notification-center-variants";

const NotificationCenterVariants = {
  notificationCenter,
  notificationCenterContent,
  notificationCenterHeader,
  notificationList,
  notificationListScroll,
  notificationItem,
  notificationItemUnreadDot,
};

export type { NotificationCenterProps } from "./NotificationCenter";

export type { NotificationCenterContentProps } from "./NotificationCenterContent";
export type { NotificationCenterHeaderProps } from "./NotificationCenterHeader";
export type { NotificationCenterTriggerProps } from "./NotificationCenterTrigger";
export type { NotificationItemProps } from "./NotificationItem";
export type { NotificationListProps } from "./NotificationList";
export { useNotificationCenter } from "./notification-center-context";
export type {
  NotificationCenterLabels,
  NotificationFilter,
  NotificationRecord,
} from "./notification-center-types";
export {
  filterNotifications,
  LOAD_MORE_ACTION_ID,
  MARK_ALL_READ_ACTION_ID,
} from "./notification-center-utils";
export {
  NotificationCenter,
  NotificationCenterContent,
  NotificationCenterHeader,
  NotificationCenterTrigger,
  NotificationCenterVariants,
  NotificationItem,
  NotificationList,
  notificationCenter,
  notificationCenterContent,
  notificationCenterHeader,
  notificationItem,
  notificationItemUnreadDot,
  notificationList,
  notificationListScroll,
};

export default {
  Root: NotificationCenter,
  Trigger: NotificationCenterTrigger,
  Content: NotificationCenterContent,
  Header: NotificationCenterHeader,
  List: NotificationList,
  Item: NotificationItem,
};
