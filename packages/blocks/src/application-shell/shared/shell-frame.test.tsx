import { cleanup, fireEvent, render, screen, within } from "@testing-library/preact";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ApplicationShell2 } from "../application-shell-2";
import { ApplicationShell3 } from "../application-shell-3";
import { ApplicationShell4 } from "../application-shell-4";
import { ApplicationShell5 } from "../application-shell-5";
import { ApplicationShell6 } from "../application-shell-6";
import { ApplicationShell7 } from "../application-shell-7";
import { ApplicationShell8 } from "../application-shell-8";
import { ApplicationShell8Preview } from "../application-shell-8/preview";
import type { ApplicationShellFrameProps } from "./types";

const props: ApplicationShellFrameProps = {
  brand: { name: "Example workspace", href: "/workspace" },
  user: { name: "Alex Morgan", email: "alex@example.com" },
  breadcrumbs: [{ label: "Workspace" }, { label: "Overview" }],
  currentPath: "/overview",
  navigationGroups: [
    {
      id: "main",
      items: [
        { id: "overview", label: "Overview", href: "/overview" },
        {
          id: "projects",
          label: "Projects",
          items: [{ id: "recent", label: "Recent", href: "/recent" }],
        },
        {
          id: "disabled",
          label: "Unavailable",
          disabled: true,
          items: [{ id: "private", label: "Private", href: "/private" }],
        },
      ],
    },
  ],
};
afterEach(cleanup);

describe("Application Shell variants", () => {
  it.each([
    [ApplicationShell2, "inset", "expanded"],
    [ApplicationShell3, "sidebar", "collapsed"],
    [ApplicationShell5, "sidebar", "expanded"],
    [ApplicationShell7, "sidebar", "expanded"],
    [ApplicationShell8, "sidebar", "expanded"],
  ] as const)("preserves layout defaults and consumer content", (Shell, variant, state) => {
    const { container } = render(
      <Shell {...props}>
        <h1>Working area</h1>
      </Shell>,
    );
    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(
      within(screen.getByRole("main")).getByRole("heading", { name: "Working area" }),
    ).toBeTruthy();
    expect(
      container.querySelector(`[data-variant="${variant}"][data-state="${state}"]`),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Toggle Sidebar" }));
    expect(
      container.querySelector(`[data-state="${state === "expanded" ? "collapsed" : "expanded"}"]`),
    ).toBeTruthy();
  });
  it("honors a controlled rail and places right navigation after the main landmark", () => {
    const onOpenChange = vi.fn();
    const { container, unmount } = render(
      <ApplicationShell3 {...props} open onOpenChange={onOpenChange} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Toggle Sidebar" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(container.querySelector('[data-state="expanded"]')).toBeTruthy();
    unmount();
    const right = render(<ApplicationShell5 {...props} />);
    expect(right.container.querySelector('[data-side="right"]')).toBeTruthy();
    const main = screen.getByRole("main");
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(main.compareDocumentPosition(nav) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
  it("flattens horizontal destinations, preserves links and disables children of disabled groups", () => {
    const onNavigate = vi.fn((_destination, event) => event.preventDefault());
    render(<ApplicationShell4 {...props} onNavigate={onNavigate} />);
    const nav = within(screen.getByRole("navigation", { name: "Workspace navigation" }));
    expect(nav.getByRole("link", { name: "Overview" }).getAttribute("aria-current")).toBe("page");
    fireEvent.click(nav.getByRole("link", { name: "Recent" }));
    expect(onNavigate.mock.calls[0][0].href).toBe("/recent");
    expect(nav.getByRole("button", { name: "Private" }).hasAttribute("disabled")).toBe(true);
    fireEvent.click(nav.getByRole("button", { name: "Private" }));
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });
  it("connects the inspector toggle and removes optional controls when no inspector exists", () => {
    const { rerender } = render(
      <ApplicationShell6
        {...props}
        inspectorTitle="Record details"
        inspector={<p>Record owner</p>}
      />,
    );
    const toggle = screen.getByRole("button", { name: "Record details" });
    expect(screen.getByRole("complementary").id).toBe(toggle.getAttribute("aria-controls"));
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("complementary")).toBeNull();
    fireEvent.click(toggle);
    expect(screen.getByText("Record owner")).toBeTruthy();
    rerender(<ApplicationShell6 {...props} />);
    expect(screen.queryByRole("button", { name: "Record details" })).toBeNull();
  });

  it("keeps contextual routes native, honors explicit active state and omits empty navigation", () => {
    const onNavigate = vi.fn((_destination, event) => event.preventDefault());
    const { rerender } = render(
      <ApplicationShell7
        {...props}
        onNavigate={onNavigate}
        sectionLabel="Project sections"
        sectionLinks={[
          { id: "overview", label: "Project overview", href: "/overview", active: false },
          { id: "activity", label: "Activity", href: "/activity", active: true },
          { id: "locked", label: "Restricted", href: "/locked", disabled: true, active: true },
        ]}
      />,
    );
    const nav = within(screen.getByRole("navigation", { name: "Project sections" }));
    expect(nav.getByRole("link", { name: "Project overview" }).hasAttribute("aria-current")).toBe(
      false,
    );
    expect(nav.getByRole("link", { name: "Activity" }).getAttribute("aria-current")).toBe("page");
    fireEvent.click(nav.getByRole("link", { name: "Activity" }));
    expect(onNavigate.mock.calls[0][0].href).toBe("/activity");
    expect(nav.getByRole("button", { name: "Restricted" }).hasAttribute("disabled")).toBe(true);
    expect(nav.getByRole("button", { name: "Restricted" }).hasAttribute("aria-current")).toBe(
      false,
    );
    rerender(<ApplicationShell7 {...props} />);
    expect(screen.queryByRole("navigation", { name: "Section navigation" })).toBeNull();
  });

  it("renders optional footer slots in flow and preserves form edits through sidebar collapse", () => {
    const { unmount } = render(<ApplicationShell8 {...props} />);
    expect(screen.queryByRole("contentinfo", { name: "Page actions" })).toBeNull();
    unmount();
    const demo = render(<ApplicationShell8Preview />);
    const name = screen.getByRole("textbox", { name: "Workspace name" }) as HTMLInputElement;
    const save = screen.getByRole("button", { name: "Save settings" }) as HTMLButtonElement;
    expect(save.disabled).toBe(true);
    fireEvent.input(name, { target: { value: "New workspace" } });
    fireEvent.click(screen.getByRole("button", { name: "Toggle Sidebar" }));
    expect(name.value).toBe("New workspace");
    expect(save.form).toBe(name.form);
    fireEvent.submit(name.form!);
    expect(save.disabled).toBe(true);
    fireEvent.input(name, { target: { value: "Discard this" } });
    fireEvent.reset(name.form!);
    expect(name.value).toBe("New workspace");
    demo.unmount();
    expect(document.querySelector('[data-application-shell="actions"]')).toBeNull();
  });
});
