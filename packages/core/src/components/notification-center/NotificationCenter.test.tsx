import { act, fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { useRef, useState } from "preact/hooks";
import { describe, expect, it, vi } from "vitest";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "../empty/Empty";
import { NotificationCenter } from "./NotificationCenter";
import { NotificationCenterContent } from "./NotificationCenterContent";
import { NotificationCenterHeader } from "./NotificationCenterHeader";
import { NotificationCenterTrigger } from "./NotificationCenterTrigger";
import { NotificationItem } from "./NotificationItem";
import { NotificationList } from "./NotificationList";
import {
  filterNotifications,
  LOAD_MORE_ACTION_ID,
  MARK_ALL_READ_ACTION_ID,
} from "./notification-center-utils";

const DEMO_ITEMS = [
  {
    id: "n1",
    title: "Invoice paid",
    body: "Acme Inc.",
    createdAt: "2026-08-14T10:00:00.000Z",
    read: false,
  },
  {
    id: "n2",
    title: "Comment added",
    createdAt: "2026-08-13T12:00:00.000Z",
    read: true,
  },
];

const NotificationCenterFixture = ({
  initialItems = DEMO_ITEMS,
  initialUnreadCount = 1,
  simulateMarkAllError = false,
}: {
  initialItems?: typeof DEMO_ITEMS;
  initialUnreadCount?: number;
  simulateMarkAllError?: boolean;
}) => {
  const [open, setOpen] = useState(true);
  const [items, setItems] = useState(initialItems);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [errorActionId, setErrorActionId] = useState<string | null>(null);
  const removeButtonRef = useRef<HTMLButtonElement>(null);

  const visibleItems = filterNotifications(items, filter);

  const markAllRead = async () => {
    if (pendingActionId) return;
    setPendingActionId(MARK_ALL_READ_ACTION_ID);
    setErrorActionId(null);
    await Promise.resolve();
    if (simulateMarkAllError) {
      setErrorActionId(MARK_ALL_READ_ACTION_ID);
      setPendingActionId(null);
      return;
    }
    setItems((current) => current.map((item) => ({ ...item, read: true })));
    setUnreadCount(0);
    setPendingActionId(null);
  };

  const markRead = async (id: string) => {
    if (pendingActionId) return;
    setPendingActionId(id);
    setErrorActionId(null);
    await Promise.resolve();
    setItems((current) => current.map((item) => (item.id === id ? { ...item, read: true } : item)));
    setUnreadCount((count) => Math.max(0, count - 1));
    setPendingActionId(null);
  };

  const remove = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    requestAnimationFrame(() => removeButtonRef.current?.focus());
  };

  return (
    <NotificationCenter
      open={open}
      onOpenChange={setOpen}
      unreadCount={unreadCount}
      filter={filter}
      onFilterChange={setFilter}
      pendingActionId={pendingActionId}
      errorActionId={errorActionId}
    >
      <NotificationCenterTrigger label="Notifications" />
      <NotificationCenterContent>
        <NotificationCenterHeader
          title="Notifications"
          markAllReadLabel="Mark all read"
          onMarkAllRead={markAllRead}
        />
        <NotificationList
          empty={
            <Empty class="min-h-32 border-0 p-4">
              <EmptyHeader>
                <EmptyTitle>All caught up</EmptyTitle>
                <EmptyDescription>No notifications in this filter.</EmptyDescription>
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
              onMarkRead={() => markRead(item.id)}
              onRemove={() => remove(item.id)}
              removeLabel={`Remove ${item.title}`}
              pending={pendingActionId === item.id}
              error={errorActionId === item.id}
            />
          ))}
        </NotificationList>
      </NotificationCenterContent>
      <button type="button" ref={removeButtonRef}>
        Focus sink
      </button>
    </NotificationCenter>
  );
};

describe("notification-center utils", () => {
  it("filters unread notifications without reordering", () => {
    const filtered = filterNotifications(DEMO_ITEMS, "unread");
    expect(filtered.map((item) => item.id)).toEqual(["n1"]);
  });
});

describe("NotificationCenter", () => {
  it("renders panel content when open", () => {
    render(
      <NotificationCenter open unreadCount={0}>
        <NotificationCenterTrigger label="Notifications" />
        <NotificationCenterContent>
          <p>Panel body</p>
        </NotificationCenterContent>
      </NotificationCenter>,
    );
    expect(screen.getByText("Panel body")).toBeTruthy();
  });

  it("renders notification items inside the list", () => {
    render(
      <NotificationCenter open unreadCount={1}>
        <NotificationCenterTrigger label="Notifications" />
        <NotificationCenterContent>
          <NotificationList showFilter={false}>
            <NotificationItem itemId="n1" title="Invoice paid" onMarkRead={() => {}} />
          </NotificationList>
        </NotificationCenterContent>
      </NotificationCenter>,
    );
    expect(screen.getByText("Invoice paid")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Mark as read" })).toBeTruthy();
  });

  it("renders filter tabs and items together", () => {
    render(
      <NotificationCenter open unreadCount={1} filter="all">
        <NotificationCenterTrigger label="Notifications" />
        <NotificationCenterContent>
          <NotificationList>
            <NotificationItem itemId="n1" title="Invoice paid" onMarkRead={() => {}} />
          </NotificationList>
        </NotificationCenterContent>
      </NotificationCenter>,
    );
    expect(document.querySelector('[data-slot="tabs"]')).toBeTruthy();
    expect(document.querySelector('[data-slot="tabs-trigger"][data-value="all"]')).toBeTruthy();
    expect(screen.getByText("Invoice paid")).toBeTruthy();
  });

  it("exposes accessible unread count on the trigger", () => {
    render(<NotificationCenterFixture initialUnreadCount={4} />);
    expect(screen.getByRole("button", { name: "Notifications, 4 unread" })).toBeTruthy();
    expect(screen.getByText("4")).toBeTruthy();
  });

  it("uses total unread count separate from visible paginated items", () => {
    render(<NotificationCenterFixture initialItems={[DEMO_ITEMS[1]!]} initialUnreadCount={9} />);
    expect(screen.getByRole("button", { name: "Notifications, 9 unread" })).toBeTruthy();
    expect(screen.getByText("9")).toBeTruthy();
  });

  it("marks a notification as read without treating navigation as read status", async () => {
    render(<NotificationCenterFixture />);

    const markReadButton = screen.getByRole("button", { name: "Mark as read" });
    fireEvent.click(markReadButton);

    await waitFor(() => {
      expect(document.querySelector("[data-item-id='n1']")).toHaveAttribute("data-read", "true");
    });
    expect(screen.getByRole("button", { name: "Notifications" })).toBeTruthy();
    expect(screen.queryByText("1")).toBeNull();
  });

  it("filters to unread notifications", () => {
    render(<NotificationCenterFixture />);

    fireEvent.click(screen.getByRole("tab", { name: /Unread/i }));
    expect(screen.getByText("Invoice paid")).toBeTruthy();
    expect(screen.queryByText("Comment added")).toBeNull();
  });

  it("shows mark-all-read error state from errorActionId", () => {
    render(
      <NotificationCenter open unreadCount={2} errorActionId={MARK_ALL_READ_ACTION_ID}>
        <NotificationCenterTrigger label="Notifications" />
        <NotificationCenterContent>
          <NotificationCenterHeader
            title="Notifications"
            markAllReadLabel="Mark all read"
            onMarkAllRead={() => {}}
          />
        </NotificationCenterContent>
      </NotificationCenter>,
    );

    expect(screen.getByText("Could not mark all notifications as read.")).toBeTruthy();
  });

  it("shows mark-all-read error state after simulated action failure", async () => {
    render(<NotificationCenterFixture simulateMarkAllError />);

    fireEvent.click(screen.getByRole("button", { name: "Mark all read" }));
    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByText("Could not mark all notifications as read.")).toBeTruthy();
  });

  it("blocks duplicate mark-all-read clicks while pending", async () => {
    let resolvePending: (() => void) | undefined;
    const pendingGate = new Promise<void>((resolve) => {
      resolvePending = resolve;
    });

    const SlowFixture = () => {
      const [pendingActionId, setPendingActionId] = useState<string | null>(null);
      const markAllRead = () => {
        if (pendingActionId) return;
        setPendingActionId(MARK_ALL_READ_ACTION_ID);
        pendingGate.then(() => setPendingActionId(null));
      };

      return (
        <NotificationCenter open unreadCount={2} pendingActionId={pendingActionId}>
          <NotificationCenterTrigger label="Notifications" />
          <NotificationCenterContent>
            <NotificationCenterHeader
              title="Notifications"
              markAllReadLabel="Mark all read"
              onMarkAllRead={markAllRead}
            />
            <NotificationList />
          </NotificationCenterContent>
        </NotificationCenter>
      );
    };

    render(<SlowFixture />);
    const markAllButton = screen.getByRole("button", { name: "Mark all read" });
    fireEvent.click(markAllButton);
    expect(markAllButton).toBeDisabled();
    fireEvent.click(markAllButton);
    resolvePending?.();
    await waitFor(() => expect(markAllButton).not.toBeDisabled());
  });

  it("restores focus after removing a notification", async () => {
    render(<NotificationCenterFixture />);

    fireEvent.click(screen.getByRole("button", { name: "Remove Invoice paid" }));

    await waitFor(() => {
      expect(document.querySelector("[data-item-id='n1']")).toBeNull();
    });
    await waitFor(() => {
      expect(document.activeElement?.textContent).toBe("Focus sink");
    });
  });

  it("does not announce live region text unless provided", () => {
    render(<NotificationCenterFixture />);
    expect(document.querySelector('[aria-live="polite"]')).toBeNull();
  });

  it("renders optional live region text from consumer", () => {
    render(
      <NotificationCenter open unreadCount={1} liveRegionText="1 new notification">
        <NotificationCenterTrigger label="Notifications" />
      </NotificationCenter>,
    );
    expect(screen.getByText("1 new notification")).toBeTruthy();
  });
});

describe("NotificationCenter load-more", () => {
  it("disables load-more while pending", () => {
    render(
      <NotificationCenter open unreadCount={0} pendingActionId={LOAD_MORE_ACTION_ID}>
        <NotificationCenterTrigger label="Notifications" />
        <NotificationCenterContent>
          <NotificationList onLoadMore={vi.fn()} loadMoreLabel="Load more">
            <NotificationItem itemId="n1" title="Event" />
          </NotificationList>
        </NotificationCenterContent>
      </NotificationCenter>,
    );

    expect(screen.getByRole("button", { name: "Load more" })).toBeDisabled();
  });
});
