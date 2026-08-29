import type { CalendarEvent, EventTypeConfig } from "./types";

export const previewEventTypes: EventTypeConfig[] = [
  { id: "meet", label: "Meeting", color: "var(--chart-1)" },
  { id: "focus", label: "Focus", color: "var(--chart-2)" },
  { id: "ship", label: "Ship", color: "var(--chart-3)" },
];

export const previewCalendarEvents: CalendarEvent[] = [
  {
    id: "design-review",
    title: "Design review",
    startsAt: "2026-08-14T13:00:00.000Z",
    endsAt: "2026-08-14T14:00:00.000Z",
    type: "meet",
    location: "Studio B",
  },
  {
    id: "deep-work",
    title: "Deep work",
    startsAt: "2026-08-15T09:00:00.000Z",
    endsAt: "2026-08-15T11:30:00.000Z",
    type: "focus",
    allDay: false,
  },
  {
    id: "ship-window",
    title: "Ship window",
    startsAt: "2026-08-18T08:00:00.000Z",
    endsAt: "2026-08-19T17:00:00.000Z",
    type: "ship",
  },
];
