import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CommandPalette } from "./command-palette";
import { DashboardLayout } from "./dashboard-layout";
import { EventList } from "./event-list";
import { NotificationsPopover } from "./notifications-popover";
import { ProfileMenu } from "./profile-menu";
import { ProgressBreakdown } from "./progress-breakdown";
import { QuickActions } from "./quick-actions";
import { ToggleSettingList } from "./toggle-setting-list";

afterEach(() => cleanup());

describe("dashboard essential blocks", () => {
  it("opens the command palette, selects with keyboard, and restores focus", async () => {
    const onSelect = vi.fn();
    render(<CommandPalette onSelect={onSelect} />);
    const trigger = screen.getByRole("button", { name: /Search/ });
    trigger.focus();
    fireEvent.click(trigger);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeTruthy();
    const input = screen.getByLabelText("Search commands");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => expect(onSelect).toHaveBeenCalled());
    expect(onSelect.mock.calls[0]?.[0]?.id).toBeTruthy();

    fireEvent.click(trigger);
    await screen.findByRole("dialog");
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it("registers Cmd+K only when the target is not an editable field", async () => {
    render(
      <div>
        <label>
          Note
          <input aria-label="Note" />
        </label>
        <CommandPalette />
      </div>,
    );

    screen.getByLabelText("Note").focus();
    fireEvent.keyDown(screen.getByLabelText("Note"), { key: "k", metaKey: true });
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.keyDown(document.body, { key: "k", metaKey: true });
    expect(await screen.findByRole("dialog")).toBeTruthy();
  });

  it("keeps command palette open state controlled", async () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(<CommandPalette open={false} onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByRole("button", { name: /Search/ }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("dialog")).toBeNull();

    rerender(<CommandPalette open onOpenChange={onOpenChange} />);
    expect(await screen.findByRole("dialog")).toBeTruthy();
  });

  it("formats event times and shows an empty state", () => {
    const now = new Date("2026-08-14T12:00:00.000Z");
    render(
      <EventList
        now={now}
        locale="en-US"
        timeZone="UTC"
        events={[
          {
            id: "standup",
            title: "Standup",
            startsAt: "2026-08-14T14:00:00.000Z",
            status: "confirmed",
          },
        ]}
      />,
    );
    expect(screen.getByText("Standup")).toBeTruthy();
    expect(screen.getByText("Confirmed")).toBeTruthy();
    expect(screen.getByText(/2:00/)).toBeTruthy();

    cleanup();
    render(<EventList events={[]} />);
    expect(screen.getByText("No upcoming events")).toBeTruthy();
  });

  it("filters unread notifications, dismisses, and marks all read", async () => {
    const onDismiss = vi.fn();
    const onMarkAllRead = vi.fn();
    const items = [
      {
        id: "a",
        title: "Unread ping",
        createdAt: "2026-08-14T12:00:00.000Z",
        read: false,
      },
      {
        id: "b",
        title: "Already seen",
        createdAt: "2026-08-13T12:00:00.000Z",
        read: true,
      },
    ];
    render(
      <NotificationsPopover
        items={items}
        open
        now={new Date("2026-08-14T13:00:00.000Z")}
        locale="en-US"
        timeZone="UTC"
        onDismiss={onDismiss}
        onMarkAllRead={onMarkAllRead}
      />,
    );

    expect(screen.getByText("Unread ping")).toBeTruthy();
    expect(screen.getByText("Already seen")).toBeTruthy();

    fireEvent.click(screen.getByRole("tab", { name: /Unread/ }));
    expect(screen.getByText("Unread ping")).toBeTruthy();
    expect(screen.queryByText("Already seen")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Dismiss Unread ping" }));
    expect(onDismiss).toHaveBeenCalledWith("a");
    expect(screen.getByText("Unread ping")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /Mark all read/ }));
    expect(onMarkAllRead).toHaveBeenCalled();
  });

  it("closes the notifications popover on Escape", async () => {
    const onOpenChange = vi.fn();
    render(<NotificationsPopover open onOpenChange={onOpenChange} />);
    fireEvent.keyDown(screen.getByRole("dialog", { name: "Open notifications" }), {
      key: "Escape",
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("emits profile menu keys and does not run logout itself", async () => {
    const onSelect = vi.fn();
    render(<ProfileMenu onSelect={onSelect} />);

    fireEvent.click(screen.getByRole("button", { name: "Open profile menu" }));
    const logout = await screen.findByRole("menuitem", { name: "Log out" });
    fireEvent.click(logout);
    expect(onSelect).toHaveBeenCalledWith("logout");
  });

  it("closes the profile menu on Escape and restores focus", async () => {
    render(<ProfileMenu />);
    const trigger = screen.getByRole("button", { name: "Open profile menu" });
    trigger.focus();
    fireEvent.click(trigger);
    const menu = await screen.findByRole("menu");
    fireEvent.keyDown(menu, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it("clamps progress values and exposes progressbar labels", () => {
    render(
      <ProgressBreakdown
        items={[
          { id: "high", label: "Over", value: 140 },
          { id: "low", label: "Under", value: -20 },
        ]}
      />,
    );
    const bars = screen.getAllByRole("progressbar");
    expect(bars[0]?.getAttribute("aria-valuenow")).toBe("100");
    expect(bars[1]?.getAttribute("aria-valuenow")).toBe("0");
    expect(bars[0]?.getAttribute("aria-labelledby")).toBe("progress-high-label");
    expect(screen.getByText("100%")).toBeTruthy();
    expect(screen.getByText("0%")).toBeTruthy();
  });

  it("keeps quick-action links router-neutral and honors disabled", () => {
    const onSelect = vi.fn();
    render(
      <QuickActions
        actions={[
          { id: "open", label: "Open docs", href: "/docs" },
          { id: "run", label: "Run job", onSelect },
          { id: "offline", label: "Offline action", onSelect, disabled: true },
        ]}
      />,
    );

    const docs = screen.getByRole("link", { name: "Open docs" });
    expect(docs.getAttribute("href")).toBe("/docs");
    expect(docs.querySelector("button")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Run job" }));
    expect(onSelect).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Offline action" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(
      (screen.getByRole("button", { name: "Offline action" }) as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it("supports controlled and uncontrolled toggle settings", async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <ToggleSettingList
        settings={[{ id: "compact", label: "Compact mode", description: "Denser tables." }]}
        value={{ compact: false }}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.click(screen.getByRole("switch", { name: "Compact mode" }));
    expect(onValueChange).toHaveBeenCalledWith({ compact: true });
    expect(screen.getByRole("switch", { name: "Compact mode" }).getAttribute("aria-checked")).toBe(
      "false",
    );

    rerender(
      <ToggleSettingList
        settings={[{ id: "compact", label: "Compact mode", description: "Denser tables." }]}
        value={{ compact: true }}
        onValueChange={onValueChange}
      />,
    );
    expect(screen.getByRole("switch", { name: "Compact mode" }).getAttribute("aria-checked")).toBe(
      "true",
    );

    cleanup();
    render(
      <ToggleSettingList
        settings={[{ id: "compact", label: "Compact mode", description: "Denser tables." }]}
        defaultValue={{ compact: true }}
      />,
    );
    fireEvent.click(screen.getByRole("switch", { name: "Compact mode" }));
    expect(screen.getByRole("switch", { name: "Compact mode" }).getAttribute("aria-checked")).toBe(
      "false",
    );
  });

  it("renders dashboard-layout slots, breadcrumbs, and collapse without wiring auth", () => {
    const onOpenChange = vi.fn();
    render(
      <DashboardLayout
        breadcrumbs={[{ label: "Home", href: "/home" }, { label: "Overview" }]}
        themeSlot={<button type="button">Theme slot</button>}
        notificationsSlot={<button type="button">Notes slot</button>}
        profileSlot={<button type="button">Profile slot</button>}
        open
        onOpenChange={onOpenChange}
      >
        <p>Main canvas</p>
      </DashboardLayout>,
    );
    expect(screen.getByText("Main canvas")).toBeTruthy();
    expect(screen.getByText("Overview")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Theme slot" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Notes slot" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Profile slot" })).toBeTruthy();
    fireEvent.click(document.querySelector('[data-slot="sidebar-trigger"]') as HTMLButtonElement);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("imports dashboard modules without window access at load time", async () => {
    const mod = await import("./index");
    expect(mod.dashboardBlocks).toHaveLength(15);
    expect(typeof mod.DashboardLayout).toBe("function");
    expect(typeof mod.CommandPalette).toBe("function");
    expect(typeof mod.AnalyticsOverview).toBe("function");
    expect(typeof mod.ConversionFunnel).toBe("function");
    expect(typeof mod.CostBreakdown).toBe("function");
    expect(typeof mod.MetricsGrid).toBe("function");
    expect(typeof mod.ThemeCustomize).toBe("function");
    expect(typeof mod.EventCalendar).toBe("function");
    expect(typeof mod.EventList).toBe("function");
    expect(typeof mod.KanbanBoard).toBe("function");
    expect(typeof mod.NotificationsPopover).toBe("function");
    expect(typeof mod.ProfileMenu).toBe("function");
    expect(typeof mod.ProgressBreakdown).toBe("function");
    expect(typeof mod.QuickActions).toBe("function");
    expect(typeof mod.ToggleSettingList).toBe("function");
  });
});
