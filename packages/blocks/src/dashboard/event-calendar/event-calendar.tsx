import { CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon } from "@kamod-ch/icons/lucide";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  Skeleton,
} from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import { formatDateKeyLabel, formatMonthTitle } from "./date";
import { MonthGrid } from "./month-grid";
import type {
  CalendarDateRange,
  CalendarEvent,
  CalendarEventAction,
  CalendarStatus,
  DateKey,
  EventTypeConfig,
  WeekStartsOn,
} from "./types";
import { UpcomingList } from "./upcoming-list";
import { useEventCalendar } from "./use-event-calendar";

export type EventCalendarProps = {
  events?: CalendarEvent[];
  onEventsChange?: (events: CalendarEvent[]) => void;
  eventTypes?: EventTypeConfig[];
  selectedRange?: CalendarDateRange | null;
  defaultSelectedRange?: CalendarDateRange | null;
  onSelectedRangeChange?: (range: CalendarDateRange | null) => void;
  visibleMonth?: DateKey;
  defaultVisibleMonth?: DateKey;
  onVisibleMonthChange?: (month: DateKey) => void;
  weekStartsOn?: WeekStartsOn;
  locale?: string;
  timeZone?: string;
  now?: Date;
  readOnly?: boolean;
  status?: CalendarStatus;
  errorMessage?: string;
  onEventAction?: (action: CalendarEventAction, event: CalendarEvent) => void;
};

export const EventCalendar = ({
  events = [],
  onEventsChange,
  eventTypes = [],
  selectedRange,
  defaultSelectedRange,
  onSelectedRangeChange,
  visibleMonth,
  defaultVisibleMonth,
  onVisibleMonthChange,
  weekStartsOn = 0,
  locale = "en",
  timeZone,
  now,
  readOnly = false,
  status = "ready",
  errorMessage = "Could not load events.",
  onEventAction,
}: EventCalendarProps) => {
  const calendar = useEventCalendar({
    events,
    onEventsChange,
    selectedRange,
    defaultSelectedRange,
    onSelectedRangeChange,
    visibleMonth,
    defaultVisibleMonth,
    onVisibleMonthChange,
    weekStartsOn,
    locale,
    timeZone,
    now,
    readOnly,
    onEventAction,
  });
  const [contextKey, setContextKey] = useState<DateKey | null>(null);
  const contextEvents = contextKey ? calendar.eventsOnDate(contextKey) : [];

  return (
    <div
      data-slot="block-event-calendar"
      class="bg-background text-foreground mx-auto w-full max-w-5xl space-y-4 rounded-xl border p-4"
    >
      <header class="flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <CalendarDaysIcon size={18} aria-hidden="true" />
          <h2 class="text-base font-semibold">{formatMonthTitle(calendar.monthKey, locale)}</h2>
        </div>
        <div class="flex items-center gap-1">
          <Button
            type="button"
            size="icon-sm"
            variant="outline"
            aria-label="Previous month"
            onClick={calendar.goPrev}
          >
            <ChevronLeftIcon size={16} />
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={calendar.goToday}>
            Today
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="outline"
            aria-label="Next month"
            onClick={calendar.goNext}
          >
            <ChevronRightIcon size={16} />
          </Button>
        </div>
      </header>

      {status === "loading" ? (
        <div class="grid gap-2" aria-busy="true">
          <Skeleton class="h-8 w-48" />
          <Skeleton class="h-72 w-full" />
        </div>
      ) : null}

      {status === "error" ? (
        <Alert>
          <AlertTitle>Events unavailable</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {status === "ready" ? (
        <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <ContextMenu>
            <ContextMenuTrigger
              onContextMenu={(event) => {
                const target = (event.target as HTMLElement | null)?.closest("[data-date]");
                setContextKey(target?.getAttribute("data-date") ?? null);
              }}
            >
              <MonthGrid
                grid={calendar.grid}
                weekStartsOn={calendar.weekStartsOn}
                locale={locale}
                todayKey={calendar.todayKey}
                focusedKey={calendar.focusedKey}
                range={calendar.range}
                eventsFor={calendar.eventsOnDate}
                types={eventTypes}
                onGridKeyDown={calendar.onGridKeyDown}
                onSelect={calendar.selectKey}
                onCellPointerDown={calendar.onCellPointerDown}
                onCellPointerEnter={calendar.onCellPointerEnter}
                onCellPointerUp={calendar.onCellPointerUp}
                gridRef={calendar.gridRef}
              />
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuLabel>{contextKey ?? "Day"}</ContextMenuLabel>
              {contextEvents.length === 0 ? (
                <ContextMenuItem disabled>No events</ContextMenuItem>
              ) : (
                contextEvents.map((event) => (
                  <div key={event.id}>
                    <ContextMenuLabel>{event.title}</ContextMenuLabel>
                    {readOnly ? null : (
                      <>
                        <ContextMenuItem onClick={() => calendar.runAction("edit", event)}>
                          Edit
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => calendar.runAction("duplicate", event)}>
                          Duplicate
                        </ContextMenuItem>
                        <ContextMenuItem
                          variant="destructive"
                          onClick={() => calendar.runAction("delete", event)}
                        >
                          Delete
                        </ContextMenuItem>
                      </>
                    )}
                    <ContextMenuSeparator />
                  </div>
                ))
              )}
            </ContextMenuContent>
          </ContextMenu>

          <aside class="space-y-3">
            <section class="space-y-1">
              <h3 class="text-sm font-medium">Selected</h3>
              {calendar.range ? (
                <p class="text-muted-foreground text-sm">
                  {formatDateKeyLabel(calendar.range.start, locale)}
                  {calendar.range.start !== calendar.range.end
                    ? ` – ${formatDateKeyLabel(calendar.range.end, locale)}`
                    : ""}
                  {` · ${calendar.selectedEvents.length} event${calendar.selectedEvents.length === 1 ? "" : "s"}`}
                </p>
              ) : (
                <p class="text-muted-foreground text-sm">
                  Click a day, Shift+click a range, or use the arrow keys.
                </p>
              )}
              {calendar.selectedEvents.length === 0 && events.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>No events</EmptyTitle>
                    <EmptyDescription>
                      Pass events and onEventsChange. Fixtures stay in previews.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : null}
            </section>
            <section class="space-y-2">
              <h3 class="text-sm font-medium">Upcoming</h3>
              <UpcomingList
                events={calendar.upcoming}
                types={eventTypes}
                locale={locale}
                timeZone={timeZone}
                readOnly={readOnly}
                onAction={calendar.runAction}
              />
            </section>
          </aside>
        </div>
      ) : null}
    </div>
  );
};
