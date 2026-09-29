import {
  Alert,
  AlertDescription,
  Badge,
  Button,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  LOAD_MORE_ACTION_ID,
  MARK_ALL_READ_ACTION_ID,
  NotificationCenter,
  NotificationCenterContent,
  NotificationCenterHeader,
  NotificationCenterTrigger,
  NotificationItem,
  NotificationList,
} from "@kamod-ch/ui";
import { useMemo, useRef, useState } from "preact/hooks";

type DemoNotification = {
  id: string;
  title: string;
  body?: string;
  createdAt: string;
  read?: boolean;
};

const PAGE_1: DemoNotification[] = [
  {
    id: "demo-1",
    title: "Design review starts in 15 minutes",
    body: "Studio B · with Maya Chen",
    createdAt: "2026-08-14T12:45:00.000Z",
    read: false,
  },
  {
    id: "demo-2",
    title: "Invoice #1842 was paid",
    body: "Acme Inc. · $2,400.00",
    createdAt: "2026-08-13T18:12:00.000Z",
    read: false,
  },
  {
    id: "demo-3",
    title: "New comment on checkout flow",
    body: "Tomoko asked for a reduced-motion pass.",
    createdAt: "2026-08-12T09:04:00.000Z",
    read: true,
  },
];

const PAGE_2: DemoNotification[] = [
  {
    id: "demo-4",
    title: "Backup completed",
    body: "Weekly snapshot stored in eu-central-1",
    createdAt: "2026-08-10T07:30:00.000Z",
    read: true,
  },
];

const LOCALE = "en-US";
const TIME_ZONE = "UTC";

/** Simulated in-memory notifications — demo only, no backend or push integration. */
export const NotificationCenterDemo = () => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(PAGE_1);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [totalUnread, setTotalUnread] = useState(2);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [errorActionId, setErrorActionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [simulateActionError, setSimulateActionError] = useState(false);
  const [liveRegionText, setLiveRegionText] = useState<string | undefined>();
  const loadMoreRef = useRef<HTMLButtonElement>(null);

  const visibleItems = useMemo(
    () => (filter === "unread" ? items.filter((item) => !item.read) : items),
    [items, filter],
  );

  const runAction = async (actionId: string, work: () => void | Promise<void>) => {
    if (pendingActionId) return;
    setPendingActionId(actionId);
    setErrorActionId(null);
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    if (simulateActionError) {
      setErrorActionId(actionId);
      setPendingActionId(null);
      return;
    }
    await work();
    setPendingActionId(null);
  };

  const markRead = (id: string) =>
    runAction(id, () => {
      setItems((current) =>
        current.map((item) => (item.id === id ? { ...item, read: true } : item)),
      );
      setTotalUnread((count) => Math.max(0, count - 1));
    });

  const markAllRead = () =>
    runAction(MARK_ALL_READ_ACTION_ID, () => {
      setItems((current) => current.map((item) => ({ ...item, read: true })));
      setTotalUnread(0);
    });

  const remove = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const loadMore = async () => {
    if (loading || pendingActionId) return;
    setLoading(true);
    setListError(null);
    setPendingActionId(LOAD_MORE_ACTION_ID);
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 500));
      if (items.some((item) => item.id === "demo-4")) {
        throw new Error("Could not load older notifications.");
      }
      setItems((current) => [...current, ...PAGE_2]);
      setHasMore(false);
      loadMoreRef.current?.focus();
    } catch (error) {
      setListError(error instanceof Error ? error.message : "Load failed.");
      setErrorActionId(LOAD_MORE_ACTION_ID);
      loadMoreRef.current?.focus();
    } finally {
      setLoading(false);
      setPendingActionId(null);
    }
  };

  const addSimulatedEvent = () => {
    const next: DemoNotification = {
      id: `demo-new-${Date.now()}`,
      title: "Simulated webhook event",
      body: "Generated locally for this demo.",
      createdAt: new Date().toISOString(),
      read: false,
    };
    setItems((current) => [next, ...current]);
    setTotalUnread((count) => count + 1);
    setLiveRegionText("1 new notification");
  };

  return (
    <div class="space-y-4">
      <Alert>
        <AlertDescription>
          <Badge variant="outline" size="xs" class="me-2">
            Demo simulation
          </Badge>
          Local in-memory notifications only — no server, push, or WebSocket integration. Optimistic
          updates and rollback are handled in this preview component.
        </AlertDescription>
      </Alert>

      <div class="flex flex-wrap items-center gap-2">
        <Button type="button" size="sm" variant="outline" onClick={addSimulatedEvent}>
          Simulate incoming event
        </Button>
        <Button
          type="button"
          size="sm"
          variant={simulateActionError ? "destructive" : "outline"}
          onClick={() => setSimulateActionError((current) => !current)}
        >
          {simulateActionError ? "Action errors enabled" : "Simulate action errors"}
        </Button>
      </div>

      <div class="flex min-h-[280px] items-start justify-end rounded-lg border bg-background p-6">
        <NotificationCenter
          open={open}
          onOpenChange={setOpen}
          unreadCount={totalUnread}
          filter={filter}
          onFilterChange={setFilter}
          pendingActionId={pendingActionId}
          errorActionId={errorActionId}
          liveRegionText={liveRegionText}
        >
          <NotificationCenterTrigger label="Notifications" />
          <NotificationCenterContent>
            <NotificationCenterHeader
              title="Notifications"
              markAllReadLabel="Mark all read"
              onMarkAllRead={markAllRead}
            />
            <NotificationList
              loading={loading}
              error={listError}
              onLoadMore={hasMore ? loadMore : undefined}
              loadMoreLabel="Load older notifications"
              empty={
                <Empty class="min-h-32 border-0 p-4">
                  <EmptyHeader>
                    <EmptyTitle>You're all caught up</EmptyTitle>
                    <EmptyDescription>
                      {filter === "unread"
                        ? "No unread notifications in this demo list."
                        : "No notifications in this demo list."}
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              }
            >
              {visibleItems.map((item) => (
                <NotificationItem
                  key={item.id}
                  itemId={item.id}
                  title={item.title}
                  body={item.body}
                  createdAt={item.createdAt}
                  read={item.read}
                  locale={LOCALE}
                  timeZone={TIME_ZONE}
                  href={`#${item.id}`}
                  onMarkRead={() => markRead(item.id)}
                  onRemove={() => remove(item.id)}
                  markReadLabel={`Mark ${item.title} as read`}
                  removeLabel={`Remove ${item.title}`}
                  pending={pendingActionId === item.id}
                  error={errorActionId === item.id}
                />
              ))}
            </NotificationList>
          </NotificationCenterContent>
        </NotificationCenter>
      </div>
    </div>
  );
};
