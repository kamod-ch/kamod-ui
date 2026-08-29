import { Badge, Button, Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@kamod-ch/ui";
import { formatTime, toDateKey } from "../../shared";
import { formatDateKeyLabel, toInstant } from "./date";
import type { CalendarEvent, CalendarEventAction, EventTypeConfig } from "./types";

export type UpcomingListProps = {
  events: CalendarEvent[];
  types: EventTypeConfig[];
  locale: string;
  timeZone?: string;
  readOnly?: boolean;
  onAction: (action: CalendarEventAction, event: CalendarEvent) => void;
};

export const UpcomingList = ({
  events,
  types,
  locale,
  timeZone,
  readOnly,
  onAction,
}: UpcomingListProps) => {
  if (events.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No upcoming events</EmptyTitle>
          <EmptyDescription>Scheduled items appear here after today.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ul class="grid gap-2">
      {events.map((event) => {
        const start = toInstant(event.startsAt);
        const type = types.find((item) => item.id === event.type);
        return (
          <li key={event.id} class="rounded-lg border p-2">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <p class="truncate text-sm font-medium">{event.title}</p>
                <p class="text-muted-foreground text-xs">
                  <time dateTime={start.toISOString()}>
                    {formatDateKeyLabel(toDateKey(start, timeZone), locale)} ·{" "}
                    {event.allDay ? "All day" : formatTime(start, { locale, timeZone })}
                  </time>
                </p>
              </div>
              {type ? (
                <Badge size="sm" variant="outline">
                  {type.label}
                </Badge>
              ) : null}
            </div>
            {readOnly ? null : (
              <div class="mt-2 flex gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => onAction("edit", event)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => onAction("duplicate", event)}
                >
                  Duplicate
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => onAction("delete", event)}
                >
                  Delete
                </Button>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};
