import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/preact";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ApplicationShell1 } from "./application-shell-1";
import { ApplicationShell1Preview } from "./preview";
import type { ApplicationShell1Props } from "./types";

const props: ApplicationShell1Props = {
  brand: { name: "Test workspace", href: "/" },
  user: { name: "Alex Morgan", email: "alex@example.com" },
  breadcrumbs: [{ label: "Workspace", href: "/workspace" }, { label: "Overview" }],
  navigationGroups: [
    {
      id: "main",
      label: "Workspace navigation",
      items: [
        { id: "dashboard", label: "Dashboard", href: "/dashboard" },
        {
          id: "projects",
          label: "Projects",
          items: [
            { id: "recent", label: "Recent", href: "/recent" },
            { id: "archived", label: "Archived", href: "/archived", disabled: true },
          ],
        },
        { id: "action", label: "Create project" },
      ],
    },
  ],
};
const originalMatchMedia = window.matchMedia;
const originalWidth = window.innerWidth;
afterEach(() => {
  cleanup();
  window.matchMedia = originalMatchMedia;
  Object.defineProperty(window, "innerWidth", { configurable: true, value: originalWidth });
});

describe("Application Shell 1", () => {
  it("renders consumer data, breadcrumb links and arbitrary main content", () => {
    render(
      <ApplicationShell1 {...props}>
        <h1>My content</h1>
      </ApplicationShell1>,
    );
    expect(screen.getByRole("link", { name: "Test workspace" }).getAttribute("href")).toBe("/");
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeTruthy();
    expect(screen.getByText("alex@example.com")).toBeTruthy();
    expect(screen.getByText("AM")).toBeTruthy();
    expect(
      within(screen.getByRole("main")).getByRole("heading", { name: "My content" }),
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: "Workspace" }).getAttribute("href")).toBe("/workspace");
    expect(screen.getByText("Overview").getAttribute("aria-current")).toBe("page");
  });

  it("opens and closes nested navigation and marks the active destination", async () => {
    render(<ApplicationShell1 {...props} currentPath="/recent" />);
    const trigger = screen.getByRole("button", { name: "Projects" });
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("link", { name: "Recent" }).getAttribute("aria-current")).toBe("page");
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(trigger);
    await waitFor(() => expect(trigger.getAttribute("aria-expanded")).toBe("true"));
  });

  it("preserves native hrefs and lets a router cancel navigation", () => {
    const onNavigate = vi.fn((_destination, event) => event.preventDefault());
    render(<ApplicationShell1 {...props} onNavigate={onNavigate} />);
    const link = screen.getByRole("link", { name: "Dashboard" });
    expect(link.getAttribute("href")).toBe("/dashboard");
    expect(fireEvent.click(link)).toBe(false);
    expect(onNavigate.mock.calls[0][0].href).toBe("/dashboard");
    fireEvent.click(screen.getByRole("button", { name: "Create project" }));
    expect(onNavigate.mock.calls[1][0].id).toBe("action");
    fireEvent.click(screen.getByRole("link", { name: "Workspace" }));
    expect(onNavigate.mock.calls[2][0].href).toBe("/workspace");
  });

  it("honors explicit active values and disabled destinations", () => {
    const onNavigate = vi.fn();
    render(
      <ApplicationShell1
        {...props}
        onNavigate={onNavigate}
        currentPath="/dashboard"
        navigationGroups={[
          {
            id: "test",
            items: [
              { id: "one", label: "Not current", href: "/dashboard", active: false },
              { id: "two", label: "Explicit current", href: "/other", active: true },
              { id: "three", label: "Unavailable", href: "/disabled", disabled: true },
            ],
          },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "Not current" }).hasAttribute("aria-current")).toBe(
      false,
    );
    expect(
      screen.getByRole("link", { name: "Explicit current" }).getAttribute("aria-current"),
    ).toBe("page");
    const disabled = screen.getByLabelText("Unavailable");
    expect(disabled.getAttribute("href")).toBeNull();
    fireEvent.click(disabled);
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it("supports controlled desktop collapse", () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(<ApplicationShell1 {...props} open onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Toggle Sidebar" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(document.querySelector('[data-slot="sidebar"][data-state="expanded"]')).toBeTruthy();
    rerender(<ApplicationShell1 {...props} open={false} onOpenChange={onOpenChange} />);
    expect(document.querySelector('[data-slot="sidebar"][data-state="collapsed"]')).toBeTruthy();
  });

  it("keeps nested destinations available in icon mode", async () => {
    render(<ApplicationShell1Preview />);
    fireEvent.click(screen.getByRole("button", { name: "Toggle Sidebar" }));
    fireEvent.click(screen.getByRole("button", { name: "Playground" }));
    fireEvent.click(await screen.findByRole("menuitem", { name: "Starred" }));
    expect(screen.getByRole("status").textContent).toBe("Selected Starred");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });

  it.each(["Account", "Billing", "Notifications", "Log out"])(
    "reports the %s user action",
    async (label) => {
      const onUserAction = vi.fn();
      render(<ApplicationShell1 {...props} onUserAction={onUserAction} />);
      fireEvent.click(screen.getByRole("button", { name: "Open account menu for Alex Morgan" }));
      fireEvent.click(await screen.findByRole("menuitem", { name: label }));
      expect(onUserAction).toHaveBeenCalledWith(
        label === "Log out" ? "logout" : label.toLowerCase(),
      );
      expect(screen.queryByRole("menu")).toBeNull();
    },
  );

  it("dismisses a router-handled icon submenu even when the path stays the same", async () => {
    render(
      <ApplicationShell1
        {...props}
        defaultOpen={false}
        currentPath="/recent"
        onNavigate={(_destination, event) => event.preventDefault()}
      />,
    );
    const trigger = screen.getByRole("button", { name: "Projects" });
    fireEvent.click(trigger);
    const recent = await screen.findByRole("menuitem", { name: "Recent" });
    expect(document.activeElement).toBe(recent);
    fireEvent.keyDown(recent, { key: "ArrowDown" });
    expect(document.activeElement).toBe(recent); // The other destination is disabled.
    fireEvent.click(recent);
    expect(screen.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("returns focus to the user trigger on Escape", async () => {
    render(<ApplicationShell1 {...props} />);
    const trigger = screen.getByRole("button", { name: "Open account menu for Alex Morgan" });
    fireEvent.click(trigger);
    const account = await screen.findByRole("menuitem", { name: "Account" });
    account.focus();
    fireEvent.keyDown(account, { key: "Escape" });
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it("closes mobile navigation after a router-handled link", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 320 });
    window.matchMedia = (query: string) => ({
      matches: query.includes("max-width: 767px"),
      media: query,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent: () => true,
    });
    render(
      <ApplicationShell1 {...props} onNavigate={(_destination, event) => event.preventDefault()} />,
    );
    const trigger = screen.getByRole("button", { name: "Toggle Sidebar" });
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("link", { name: "Dashboard" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
});
