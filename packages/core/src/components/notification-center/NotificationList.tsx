import type { ComponentChildren, JSX } from "preact";
import { toChildArray } from "preact";
import { cn } from "../../lib/utils";
import { Alert, AlertDescription } from "../alert";
import { Button } from "../button/Button";
import { ScrollArea } from "../scroll-area/ScrollArea";
import { Skeleton } from "../skeleton/Skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";
import { useNotificationCenter } from "./notification-center-context";
import { LOAD_MORE_ACTION_ID } from "./notification-center-utils";
import { notificationList, notificationListScroll } from "./notification-center-variants";

export type NotificationListProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
  loading?: boolean;
  error?: ComponentChildren;
  empty?: ComponentChildren;
  onLoadMore?: () => void;
  loadMoreLabel?: string;
  filterAllLabel?: string;
  filterUnreadLabel?: string;
  showFilter?: boolean;
};

export const NotificationList = ({
  children,
  loading = false,
  error,
  empty,
  onLoadMore,
  loadMoreLabel = "Load more",
  filterAllLabel = "All",
  filterUnreadLabel = "Unread",
  showFilter = true,
  class: className,
  ...rest
}: NotificationListProps) => {
  const { filter, setFilter, unreadCount, pendingActionId, errorActionId } =
    useNotificationCenter();
  const items = toChildArray(children);
  const isEmpty = items.length === 0 && !loading;
  const loadMorePending = pendingActionId === LOAD_MORE_ACTION_ID;
  const loadMoreError = errorActionId === LOAD_MORE_ACTION_ID;

  const listBody = loading ? (
    <div class="grid gap-2 p-1" data-slot="notification-list-loading">
      <Skeleton class="h-14 w-full rounded-md" />
      <Skeleton class="h-14 w-full rounded-md" />
      <Skeleton class="h-14 w-full rounded-md" />
    </div>
  ) : isEmpty ? (
    <div data-slot="notification-list-empty">{empty}</div>
  ) : (
    <ScrollArea class={notificationListScroll()}>
      <ul class="grid gap-1 pr-2" data-slot="notification-list-items">
        {items}
      </ul>
    </ScrollArea>
  );

  const loadMoreSection =
    onLoadMore && !loading && !isEmpty ? (
      <div class="pt-1">
        {loadMoreError && error ? (
          <Alert variant="destructive" class="mb-2">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        <Button
          type="button"
          variant="outline"
          size="sm"
          class="w-full"
          disabled={loadMorePending}
          aria-busy={loadMorePending}
          onClick={onLoadMore}
        >
          {loadMoreLabel}
        </Button>
      </div>
    ) : null;

  const errorSection =
    error && !onLoadMore ? (
      <Alert variant="destructive" data-slot="notification-list-error">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    ) : null;

  const listContent = (
    <>
      {listBody}
      {loadMoreSection}
    </>
  );

  if (!showFilter) {
    return (
      <div class={cn(notificationList(), className)} data-slot="notification-list" {...rest}>
        {errorSection}
        <div class="min-h-0 flex-1 pt-3">{listContent}</div>
      </div>
    );
  }

  return (
    <div class={cn(notificationList(), className)} data-slot="notification-list" {...rest}>
      {errorSection}
      <Tabs key={filter} defaultValue={filter} class="flex min-h-0 flex-1 flex-col">
        <TabsList variant="line" class="w-full shrink-0">
          <TabsTrigger value="all" onClick={() => setFilter("all")}>
            {filterAllLabel}
          </TabsTrigger>
          <TabsTrigger value="unread" onClick={() => setFilter("unread")}>
            {filterUnreadLabel}
            {unreadCount > 0 ? ` (${unreadCount})` : ""}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" class="min-h-0 flex-1 pt-3">
          {listContent}
        </TabsContent>
        <TabsContent value="unread" class="min-h-0 flex-1 pt-3">
          {listContent}
        </TabsContent>
      </Tabs>
    </div>
  );
};
