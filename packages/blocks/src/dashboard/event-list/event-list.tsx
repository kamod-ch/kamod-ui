import { CalendarClockIcon, MapPinIcon, VideoIcon } from "@kamod-ch/icons/lucide";
import { Badge, Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@kamod-ch/ui";
import { type DateFormatOptions, formatDayLabel, formatTime } from "../../shared";
import { DashboardSection } from "../shared/section-card";

export type EventListStatus = "confirmed" | "tentative" | "cancelled";

export type EventListItem = {
  id: string;
  title: string;
  startsAt: string | Date;
  endsAt?: string | Date;
  status?: EventListStatus;
  location?: string;
  meetingUrl?: string;
};

export type EventListProps = {
  title?: string;
  description?: string;
  events?: EventListItem[];
  emptyTitle?: string;
  emptyDescription?: string;
  locale?: string;
  timeZone?: string;
  now?: Date;
};

const defaultEvents: EventListItem[] = [
  {
    id: "design-review",
    title: "Design review",
    startsAt: "2026-08-14T13:00:00.000Z",
    status: "confirmed",
    location: "Studio B",
  },
  {
    id: "customer-call",
    title: "Customer call",
    startsAt: "2026-08-14T15:30:00.000Z",
    status: "tentative",
    meetingUrl: "https://meet.example.com/ada",
  },
  {
    id: "ship-retro",
    title: "Ship retro",
    startsAt: "2026-08-15T09:00:00.000Z",
    status: "cancelled",
    location: "Room 4",
  },
];

const statusLabel: Record<EventListStatus, string> = {
  confirmed: "Confirmed",
  tentative: "Tentative",
  cancelled: "Cancelled",
};

const statusVariant: Record<EventListStatus, "success" | "warning" | "destructive"> = {
  confirmed: "success",
  tentative: "warning",
  cancelled: "destructive",
};

const toDate = (value: string | Date): Date => (value instanceof Date ? value : new Date(value));

export const EventList = ({
  title = "Upcoming events",
  description = "Your next meetings and reminders.",
  events = defaultEvents,
  emptyTitle = "No upcoming events",
  emptyDescription = "When something is scheduled, it will show up here.",
  locale,
  timeZone,
  now,
}: EventListProps) => {
  const formatOptions: DateFormatOptions = { locale, timeZone };
  const reference = now ?? new Date();

  return (
    <DashboardSection slot="block-event-list" title={title} description={description}>
      {events.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{emptyTitle}</EmptyTitle>
            <EmptyDescription>{emptyDescription}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul class="grid gap-3">
          {events.map((event) => {
            const start = toDate(event.startsAt);
            const status = event.status ?? "confirmed";
            return (
              <li key={event.id} class="rounded-lg border border-border/80 p-3">
                <div class="flex items-start justify-between gap-3">
                  <div class="space-y-1">
                    <p class="text-sm font-medium">{event.title}</p>
                    <p class="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
                      <CalendarClockIcon size={12} aria-hidden="true" />
                      <time dateTime={start.toISOString()}>
                        {formatDayLabel(start, reference, formatOptions)} ·{" "}
                        {formatTime(start, formatOptions)}
                      </time>
                    </p>
                    {event.location ? (
                      <p class="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
                        <MapPinIcon size={12} aria-hidden="true" />
                        {event.location}
                      </p>
                    ) : null}
                    {event.meetingUrl ? (
                      <p class="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
                        <VideoIcon size={12} aria-hidden="true" />
                        Video call
                      </p>
                    ) : null}
                  </div>
                  <Badge variant={statusVariant[status]} size="sm">
                    {statusLabel[status]}
                  </Badge>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardSection>
  );
};
