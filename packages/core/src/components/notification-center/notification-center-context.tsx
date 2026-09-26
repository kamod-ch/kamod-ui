import { createContext } from "preact";
import { useContext } from "preact/hooks";
import type { NotificationFilter } from "./notification-center-types";

export type NotificationCenterContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  /** Total unread count — may differ from a paginated visible list. */
  unreadCount: number;
  filter: NotificationFilter;
  setFilter: (filter: NotificationFilter) => void;
  isMobile: boolean;
  /** Optional polite announcement for newly arrived events (consumer-controlled). */
  liveRegionText?: string;
  pendingActionId?: string | null;
  errorActionId?: string | null;
};

export const NotificationCenterContext = createContext<NotificationCenterContextValue | null>(null);

export const useNotificationCenter = (): NotificationCenterContextValue => {
  const context = useContext(NotificationCenterContext);
  if (!context) {
    throw new Error("NotificationCenter subcomponents must be used within NotificationCenter");
  }
  return context;
};
