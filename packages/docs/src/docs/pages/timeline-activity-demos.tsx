import { classifyDayGroup, formatDayLabel, formatTime, groupBy } from "@kamod-ch/blocks";
import { PackageIcon, ShieldIcon, TruckIcon, UserPlusIcon } from "@kamod-ch/icons/lucide";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  formatTimelineDateTime,
  Skeleton,
  Timeline,
  TimelineActions,
  TimelineContent,
  TimelineDescription,
  TimelineIndicator,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
  toTimelineDateTime,
} from "@kamod-ch/ui";
import { useMemo, useRef, useState } from "preact/hooks";

const LOCALE = "en-US";
const TIME_ZONE = "UTC";
const NOW = new Date("2026-08-14T18:00:00.000Z");

const formatInstant = (value: string) =>
  formatTimelineDateTime(value, { locale: LOCALE, timeZone: TIME_ZONE });

/** 1. Order history — consumer-defined order, absolute timestamps. */
export const OrderHistoryTimelineDemo = () => (
  <Timeline aria-label="Order history">
    <TimelineItem itemId="ord-created">
      <TimelineIndicator markerSize="md">
        <span class="bg-muted text-foreground flex size-8 items-center justify-center rounded-full">
          <PackageIcon size={16} aria-hidden="true" />
        </span>
      </TimelineIndicator>
      <TimelineContent>
        <TimelineTime dateTime={toTimelineDateTime("2026-08-14T08:15:00.000Z")}>
          {formatInstant("2026-08-14T08:15:00.000Z")}
        </TimelineTime>
        <TimelineTitle>Order #4821 placed</TimelineTitle>
        <TimelineDescription>3 items · $184.20 total</TimelineDescription>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem itemId="ord-shipped">
      <TimelineIndicator markerSize="md">
        <span class="bg-muted text-foreground flex size-8 items-center justify-center rounded-full">
          <TruckIcon size={16} aria-hidden="true" />
        </span>
      </TimelineIndicator>
      <TimelineContent>
        <TimelineTime dateTime={toTimelineDateTime("2026-08-14T11:42:00.000Z")}>
          {formatInstant("2026-08-14T11:42:00.000Z")}
        </TimelineTime>
        <TimelineTitle>Shipment handed to carrier</TimelineTitle>
        <TimelineDescription>Tracking ID CH-94821-NW</TimelineDescription>
        <TimelineActions>
          <Button type="button" size="xs" variant="outline">
            Track package
          </Button>
        </TimelineActions>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem itemId="ord-delivered">
      <TimelineIndicator markerSize="md" hideLine>
        <span class="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full">
          <PackageIcon size={16} aria-hidden="true" />
        </span>
      </TimelineIndicator>
      <TimelineContent>
        <TimelineTime dateTime={toTimelineDateTime("2026-08-14T16:05:00.000Z")}>
          {formatInstant("2026-08-14T16:05:00.000Z")}
        </TimelineTime>
        <TimelineTitle>Delivered to front desk</TimelineTitle>
        <TimelineDescription>Signed by reception</TimelineDescription>
      </TimelineContent>
    </TimelineItem>
  </Timeline>
);

type TeamEvent = {
  id: string;
  at: string;
  actor: string;
  initials: string;
  title: string;
  description: string;
};

const TEAM_EVENTS: TeamEvent[] = [
  {
    id: "team-1",
    at: "2026-08-14T09:10:00.000Z",
    actor: "Maya Chen",
    initials: "MC",
    title: "Updated project brief",
    description: "Added accessibility acceptance criteria for the dashboard release.",
  },
  {
    id: "team-2",
    at: "2026-08-14T12:25:00.000Z",
    actor: "Jonas Keller",
    initials: "JK",
    title: "Commented on timeline spec",
    description: "Suggested keeping day grouping in the activity-feed example only.",
  },
  {
    id: "team-3",
    at: "2026-08-14T15:40:00.000Z",
    actor: "Guest",
    initials: "?",
    title: "Invite sent",
    description: "Pending avatar — fallback initials only.",
  },
];

/** 2. Team activity feed with avatars (including missing image fallback). */
export const TeamActivityTimelineDemo = () => (
  <Timeline aria-label="Team activity">
    {TEAM_EVENTS.map((event, index) => (
      <TimelineItem key={event.id} itemId={event.id}>
        <TimelineIndicator markerSize="lg" hideLine={index === TEAM_EVENTS.length - 1}>
          <Avatar size="sm">
            <AvatarFallback>{event.initials}</AvatarFallback>
          </Avatar>
        </TimelineIndicator>
        <TimelineContent>
          <TimelineTime dateTime={toTimelineDateTime(event.at)}>
            {formatInstant(event.at)}
          </TimelineTime>
          <TimelineTitle>
            {event.actor} · {event.title}
          </TimelineTitle>
          <TimelineDescription>{event.description}</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
    ))}
  </Timeline>
);

type AuditEvent = {
  id: string;
  at: string;
  actor: string;
  action: string;
  detail: string;
  status: "info" | "warning" | "success";
};

const AUDIT_EVENTS: AuditEvent[] = [
  {
    id: "audit-1",
    at: "2026-08-14T07:05:00.000Z",
    actor: "system",
    action: "Role changed",
    detail: "Editor → Admin for user ada@example.com",
    status: "warning",
  },
  {
    id: "audit-2",
    at: "2026-08-14T10:18:00.000Z",
    actor: "ada@example.com",
    action: "Export requested",
    detail: "Billing report CSV",
    status: "info",
  },
  {
    id: "audit-3",
    at: "2026-08-14T13:55:00.000Z",
    actor: "system",
    action: "Status updated",
    detail: "Webhook delivery marked as delivered",
    status: "success",
  },
];

const auditVariant = {
  info: "secondary",
  warning: "warning",
  success: "success",
} as const;

/** 3. Audit presentation — no immutability claims, status badges only. */
export const AuditTimelineDemo = () => (
  <div class="space-y-3">
    <p class="text-muted-foreground text-xs">
      UI presentation of audit-style events. This demo does not verify storage, retention, or tamper
      resistance.
    </p>
    <Timeline aria-label="Audit events">
      {AUDIT_EVENTS.map((event, index) => (
        <TimelineItem key={event.id} itemId={event.id}>
          <TimelineIndicator markerSize="md" hideLine={index === AUDIT_EVENTS.length - 1}>
            <span class="bg-muted text-foreground flex size-8 items-center justify-center rounded-full">
              <ShieldIcon size={16} aria-hidden="true" />
            </span>
          </TimelineIndicator>
          <TimelineContent>
            <TimelineTime dateTime={toTimelineDateTime(event.at)}>
              {formatInstant(event.at)}
            </TimelineTime>
            <TimelineTitle>{event.action}</TimelineTitle>
            <TimelineDescription>
              {event.actor} — {event.detail}
            </TimelineDescription>
            <TimelineActions>
              <Badge variant={auditVariant[event.status]} size="xs">
                {event.status}
              </Badge>
            </TimelineActions>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  </div>
);

type FeedEvent = {
  id: string;
  at: string;
  title: string;
  description: string;
};

const FEED_PAGE_1: FeedEvent[] = [
  {
    id: "feed-1",
    at: "2026-08-14T08:00:00.000Z",
    title: "Workspace created",
    description: "Northwind Labs",
  },
  {
    id: "feed-2",
    at: "2026-08-13T17:20:00.000Z",
    title: "Member invited",
    description: "ops@northwind.dev",
  },
];

const FEED_PAGE_2: FeedEvent[] = [
  {
    id: "feed-3",
    at: "2026-08-12T09:45:00.000Z",
    title: "Billing profile updated",
    description: "VAT ID added",
  },
];

/** 4. Grouped activity feed with consumer-side day grouping and load-more callback. */
export const GroupedActivityFeedDemo = () => {
  const loadMoreRef = useRef<HTMLButtonElement>(null);
  const [items, setItems] = useState(FEED_PAGE_1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const groups = useMemo(() => {
    const grouped = groupBy(
      items,
      (item) => classifyDayGroup(new Date(item.at), NOW, TIME_ZONE).kind,
    );
    const order = ["today", "yesterday", "previous-7-days", "earlier", "date"] as const;
    return order.flatMap((kind) => {
      const bucket = grouped[kind];
      if (!bucket?.length) return [];
      return [
        {
          kind,
          label: formatDayLabel(new Date(bucket[0]!.at), NOW, {
            locale: LOCALE,
            timeZone: TIME_ZONE,
          }),
          items: bucket,
        },
      ];
    });
  }, [items]);

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 450));
      if (items.some((item) => item.id === "feed-3")) {
        throw new Error("Could not load older events.");
      }
      setItems((current) => [...current, ...FEED_PAGE_2]);
      setHasMore(false);
      loadMoreRef.current?.focus();
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Load failed.");
      loadMoreRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Empty class="min-h-40">
        <EmptyHeader>
          <EmptyTitle>No activity yet</EmptyTitle>
          <EmptyDescription>Events appear here in the order you pass them.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div class="space-y-4">
      {groups.map((group) => (
        <section key={group.kind} class="space-y-3">
          <h3 class="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {group.label}
          </h3>
          <Timeline aria-label={`Activity on ${group.label}`}>
            {group.items.map((event, index) => (
              <TimelineItem key={event.id} itemId={event.id}>
                <TimelineIndicator markerSize="md" hideLine={index === group.items.length - 1}>
                  <span class="bg-muted text-foreground flex size-8 items-center justify-center rounded-full">
                    <UserPlusIcon size={16} aria-hidden="true" />
                  </span>
                </TimelineIndicator>
                <TimelineContent>
                  <TimelineTime dateTime={toTimelineDateTime(event.at)}>
                    {formatTime(new Date(event.at), { locale: LOCALE, timeZone: TIME_ZONE })}
                  </TimelineTime>
                  <TimelineTitle>{event.title}</TimelineTitle>
                  <TimelineDescription>{event.description}</TimelineDescription>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </section>
      ))}

      {error ? (
        <Alert variant="destructive" role="alert">
          <AlertTitle>Could not load more</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {loading ? (
        <div class="space-y-2" aria-hidden="true">
          <Skeleton class="h-4 w-40" />
          <Skeleton class="h-16 w-full" />
        </div>
      ) : null}

      {hasMore ? (
        <Button
          ref={loadMoreRef}
          type="button"
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={() => void loadMore()}
        >
          Load more
        </Button>
      ) : (
        <p class="text-muted-foreground text-sm">End of activity history.</p>
      )}
    </div>
  );
};
