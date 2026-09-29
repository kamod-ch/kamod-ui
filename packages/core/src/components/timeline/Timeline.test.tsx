import { fireEvent, render, screen } from "@testing-library/preact";
import { useRef, useState } from "preact/hooks";
import { describe, expect, it } from "vitest";
import { Timeline } from "./Timeline";
import { TimelineContent } from "./TimelineContent";
import { TimelineDescription } from "./TimelineDescription";
import { TimelineIndicator } from "./TimelineIndicator";
import { TimelineItem } from "./TimelineItem";
import { TimelineTime } from "./TimelineTime";
import { TimelineTitle } from "./TimelineTitle";
import { formatTimelineDateTime, toTimelineDateTime } from "./timeline-utils";

describe("timeline utils", () => {
  it("formats absolute timestamps for SSR-stable display", () => {
    const iso = "2026-08-14T10:30:00.000Z";
    expect(toTimelineDateTime(iso)).toBe(iso);
    expect(formatTimelineDateTime(iso, { locale: "en-US", timeZone: "UTC" })).toContain("2026");
  });
});

describe("Timeline", () => {
  it("renders semantic list items with stable ids and time dateTime", () => {
    render(
      <Timeline aria-label="Order history">
        <TimelineItem itemId="order-shipped">
          <TimelineIndicator />
          <TimelineContent>
            <TimelineTime dateTime="2026-08-14T10:30:00.000Z">Aug 14, 2026, 10:30 AM</TimelineTime>
            <TimelineTitle>Order shipped</TimelineTitle>
          </TimelineContent>
        </TimelineItem>
      </Timeline>,
    );

    const item = document.querySelector("[data-item-id='order-shipped']");
    expect(item?.tagName).toBe("LI");
    expect(screen.getByText("Order shipped")).toBeTruthy();

    const time = screen.getByText("Aug 14, 2026, 10:30 AM");
    expect(time.tagName).toBe("TIME");
    expect(time).toHaveAttribute("dateTime", "2026-08-14T10:30:00.000Z");
  });

  it("wraps long descriptions without a fixed item height", () => {
    const longText =
      "Payment reconciliation note with a very long identifier org_01j9x4k2m8n0p3q5r7s9t1v3w5y7z9a1b3c5d7e9f0 and multi-line operational context that should wrap naturally inside the timeline content region.";

    render(
      <Timeline aria-label="Audit log">
        <TimelineItem itemId="audit-1">
          <TimelineIndicator />
          <TimelineContent>
            <TimelineDescription>{longText}</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      </Timeline>,
    );

    const description = screen.getByText(longText);
    expect(description.className).toContain("overflow-wrap");
    expect(description.closest("[data-slot='timeline-content']")).toBeTruthy();
  });

  it("renders default marker when no avatar or icon is provided", () => {
    render(
      <Timeline aria-label="Minimal feed">
        <TimelineItem itemId="plain">
          <TimelineIndicator />
          <TimelineContent>
            <TimelineTitle>System notice</TimelineTitle>
          </TimelineContent>
        </TimelineItem>
      </Timeline>,
    );

    expect(document.querySelector("[data-slot='timeline-marker']")).toBeTruthy();
  });

  it("keeps focus on the load-more control after appending items", () => {
    const INITIAL = [{ id: "a1", title: "First event" }];
    const MORE = [{ id: "a2", title: "Loaded event" }];

    const LoadMoreFeed = () => {
      const loadMoreRef = useRef<HTMLButtonElement>(null);
      const [items, setItems] = useState(INITIAL);

      return (
        <div>
          <Timeline aria-label="Activity feed">
            {items.map((item) => (
              <TimelineItem key={item.id} itemId={item.id}>
                <TimelineIndicator />
                <TimelineContent>
                  <TimelineTitle>{item.title}</TimelineTitle>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
          <button
            ref={loadMoreRef}
            type="button"
            onClick={() => {
              setItems((current) => [...current, ...MORE]);
              loadMoreRef.current?.focus();
            }}
          >
            Load more
          </button>
        </div>
      );
    };

    render(<LoadMoreFeed />);
    fireEvent.click(screen.getByRole("button", { name: "Load more" }));

    expect(screen.getByText("Loaded event")).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Load more" }));
  });
});
