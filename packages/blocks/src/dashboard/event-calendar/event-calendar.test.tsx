import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EventCalendar } from "./event-calendar";
import { previewCalendarEvents, previewEventTypes } from "./fixtures";

afterEach(() => cleanup());

const now = new Date("2026-08-14T12:00:00.000Z");

describe("EventCalendar", () => {
  it("navigates the month grid with arrow keys and keeps focus", async () => {
    render(
      <EventCalendar
        events={previewCalendarEvents}
        eventTypes={previewEventTypes}
        now={now}
        timeZone="UTC"
        weekStartsOn={1}
      />,
    );
    const today = screen.getByRole("button", { name: "2026-08-14" });
    today.focus();
    fireEvent.keyDown(screen.getByRole("grid", { name: "Month" }), { key: "ArrowRight" });
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByRole("button", { name: "2026-08-15" })),
    );
    fireEvent.keyDown(screen.getByRole("grid", { name: "Month" }), { key: "Home" });
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByRole("button", { name: "2026-08-10" })),
    );
  });

  it("selects a Shift range and summarizes it", () => {
    render(
      <EventCalendar events={previewCalendarEvents} now={now} timeZone="UTC" weekStartsOn={1} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "2026-08-14" }));
    fireEvent.click(screen.getByRole("button", { name: "2026-08-16" }), { shiftKey: true });
    expect(screen.getByText(/Aug 14, 2026\s+–\s+Aug 16, 2026/)).toBeTruthy();
    expect(screen.getByText(/2 events/)).toBeTruthy();
  });

  it("deletes through onEventsChange and keeps consumer data as source of truth", () => {
    const onEventsChange = vi.fn();
    render(
      <EventCalendar
        events={previewCalendarEvents}
        onEventsChange={onEventsChange}
        eventTypes={previewEventTypes}
        now={now}
        timeZone="UTC"
      />,
    );
    fireEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]!);
    expect(onEventsChange).toHaveBeenCalled();
    const next = onEventsChange.mock.calls[0]?.[0] as { id: string }[];
    expect(next.some((event) => event.id === "design-review")).toBe(false);
  });

  it("places a late-UTC instant on the previous civil day in America/Los_Angeles", () => {
    render(
      <EventCalendar
        events={[
          {
            id: "late",
            title: "West coast standup",
            startsAt: "2026-08-14T02:30:00.000Z",
          },
        ]}
        now={now}
        timeZone="America/Los_Angeles"
        weekStartsOn={1}
      />,
    );
    expect(
      screen
        .getByRole("button", { name: "2026-08-13" })
        .querySelector("[title='West coast standup']"),
    ).toBeTruthy();
  });

  it("renders loading and error states", () => {
    const { container, rerender } = render(<EventCalendar status="loading" now={now} />);
    expect(container.querySelector("[aria-busy='true']")).toBeTruthy();
    rerender(<EventCalendar status="error" errorMessage="Offline" now={now} />);
    expect(screen.getByText("Offline")).toBeTruthy();
  });
});
