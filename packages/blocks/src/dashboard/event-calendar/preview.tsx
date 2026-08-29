import { useState } from "preact/hooks";
import { EventCalendar } from "./event-calendar";
import { previewCalendarEvents, previewEventTypes } from "./fixtures";
import type { CalendarEvent } from "./types";

export const EventCalendarPreview = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(previewCalendarEvents);
  return (
    <div class="p-4">
      <EventCalendar
        events={events}
        onEventsChange={setEvents}
        eventTypes={previewEventTypes}
        now={new Date("2026-08-14T12:00:00.000Z")}
        locale="en"
        timeZone="UTC"
        weekStartsOn={1}
      />
    </div>
  );
};
