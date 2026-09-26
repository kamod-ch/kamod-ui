import type { ComponentChildren } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import { Popover } from "../popover/Popover";
import { Sheet } from "../sheet/Sheet";
import { useIsMobile } from "../sidebar/use-mobile";
import { NotificationCenterContext } from "./notification-center-context";
import type { NotificationFilter } from "./notification-center-types";
import { notificationCenter } from "./notification-center-variants";

export type NotificationCenterProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Total unread count — pass separately from a paginated list when needed. */
  unreadCount: number;
  filter?: NotificationFilter;
  defaultFilter?: NotificationFilter;
  onFilterChange?: (filter: NotificationFilter) => void;
  /** Optional polite announcement for new events — omit on initial load. */
  liveRegionText?: string;
  pendingActionId?: string | null;
  errorActionId?: string | null;
  children?: ComponentChildren;
  class?: string;
};

export const NotificationCenter = ({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  unreadCount,
  filter: filterProp,
  defaultFilter = "all",
  onFilterChange,
  liveRegionText,
  pendingActionId = null,
  errorActionId = null,
  class: className,
  children,
}: NotificationCenterProps) => {
  const isMobile = useIsMobile();
  const isOpenControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isOpenControlled ? openProp : internalOpen;

  const isFilterControlled = filterProp !== undefined;
  const [internalFilter, setInternalFilter] = useState<NotificationFilter>(defaultFilter);
  const filter = isFilterControlled ? filterProp : internalFilter;

  const setOpen = (next: boolean) => {
    onOpenChange?.(next);
    if (!isOpenControlled) {
      setInternalOpen(next);
    }
  };

  const setFilter = (next: NotificationFilter) => {
    onFilterChange?.(next);
    if (!isFilterControlled) {
      setInternalFilter(next);
    }
  };

  useEffect(() => {
    if (isOpenControlled && openProp !== undefined) {
      setInternalOpen(openProp);
    }
  }, [openProp, isOpenControlled]);

  useEffect(() => {
    if (isFilterControlled && filterProp !== undefined) {
      setInternalFilter(filterProp);
    }
  }, [filterProp, isFilterControlled]);

  const contextValue = useMemo(
    () => ({
      open,
      setOpen,
      unreadCount,
      filter,
      setFilter,
      isMobile,
      liveRegionText,
      pendingActionId,
      errorActionId,
    }),
    [open, unreadCount, filter, isMobile, liveRegionText, pendingActionId, errorActionId],
  );

  const Shell = isMobile ? Sheet : Popover;

  return (
    <NotificationCenterContext.Provider value={contextValue}>
      <Shell
        open={open}
        onOpenChange={setOpen}
        class={notificationCenter({ class: className })}
        data-slot="notification-center"
      >
        {children}
      </Shell>
      {liveRegionText ? (
        <div aria-live="polite" aria-atomic="true" class="sr-only">
          {liveRegionText}
        </div>
      ) : null}
    </NotificationCenterContext.Provider>
  );
};
