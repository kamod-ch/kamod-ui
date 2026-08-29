import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppSidebarPreviewShell } from "./shared/preview-shell";
import { AppSidebar01, AppSidebar01Preview } from "./sidebar-01";
import { AppSidebar03 } from "./sidebar-03";
import { AppSidebar05Preview, sidebar05WidthVars } from "./sidebar-05";
import { AppSidebar06 } from "./sidebar-06";
import { AppSidebar07 } from "./sidebar-07";

const originalMatchMedia = window.matchMedia;
const originalInnerWidth = window.innerWidth;

const toggleSidebar = () =>
  document.querySelector('[data-slot="sidebar-trigger"]') as HTMLButtonElement;

afterEach(() => {
  cleanup();
  window.matchMedia = originalMatchMedia;
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: originalInnerWidth,
  });
});

const mockViewport = (width: number) => {
  Object.defineProperty(window, "innerWidth", { configurable: true, writable: true, value: width });
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: query.includes("max-width: 767px") ? width < 768 : false,
      media: query,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
};

describe("app sidebar blocks", () => {
  it("toggles collapse from the trigger and keeps nav labels in the DOM", async () => {
    mockViewport(1280);
    render(<AppSidebar01Preview />);
    expect(screen.getByText("Dashboard")).toBeTruthy();
    fireEvent.click(toggleSidebar());
    await waitFor(() => {
      expect(document.querySelector('[data-state="collapsed"]')).toBeTruthy();
    });
    expect(screen.getByText("Dashboard")).toBeTruthy();
  });

  it("keeps collapse state controlled", () => {
    mockViewport(1280);
    const onOpenChange = vi.fn();
    render(<AppSidebar01Preview open onOpenChange={onOpenChange} />);
    fireEvent.click(toggleSidebar());
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(document.querySelector('[data-state="collapsed"]')).toBeNull();
  });

  it("marks the active href as the current page", () => {
    mockViewport(1280);
    render(
      <AppSidebarPreviewShell title="active" sidebar={<AppSidebar01 activeHref="/tables" />} />,
    );
    expect(screen.getByRole("link", { name: "Data tables" }).getAttribute("aria-current")).toBe(
      "page",
    );
    expect(screen.getByRole("link", { name: "Dashboard" }).getAttribute("aria-current")).toBeNull();
  });

  it("opens the mobile sheet, traps dialog semantics, and closes on Escape", async () => {
    mockViewport(500);
    render(<AppSidebar01Preview />);
    await waitFor(() => {
      expect(document.querySelector("[data-slot='sidebar']:not([data-mobile])")).toBeNull();
    });
    fireEvent.click(toggleSidebar());
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeTruthy();
    fireEvent.keyDown(dialog, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("filters docs groups from the sidebar-03 search field", () => {
    mockViewport(1280);
    render(<AppSidebarPreviewShell title="docs" sidebar={<AppSidebar03 />} />);
    fireEvent.input(screen.getByLabelText("Search"), { target: { value: "Routing" } });
    expect(screen.getByText("Routing")).toBeTruthy();
    expect(screen.queryByText("Installation")).toBeNull();
  });

  it("applies dual-rail width custom properties without React types", () => {
    mockViewport(1280);
    render(<AppSidebar05Preview />);
    const wrapper = document.querySelector('[data-slot="sidebar-wrapper"]') as HTMLElement | null;
    expect(wrapper?.style.getPropertyValue("--sidebar-width")).toBe(
      sidebar05WidthVars["--sidebar-width"],
    );
    expect(wrapper?.style.getPropertyValue("--sidebar-width-icon")).toBe(
      sidebar05WidthVars["--sidebar-width-icon"],
    );
    expect(screen.getByRole("button", { name: "Home" })).toBeTruthy();
  });

  it("toggles favorites and ignores Cmd+F while typing", () => {
    mockViewport(1280);
    const onFavoriteChange = vi.fn();
    render(
      <AppSidebarPreviewShell
        title="favorites"
        sidebar={<AppSidebar06 onFavoriteChange={onFavoriteChange} />}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Unfavorite Design Engineering" }));
    expect(onFavoriteChange).toHaveBeenCalled();
    const search = screen.getByLabelText("Search");
    search.focus();
    fireEvent.keyDown(search, { key: "f", metaKey: true });
    expect(document.activeElement).toBe(search);
  });

  it("emits sidebar-07 toolbar and command actions without running logout", () => {
    mockViewport(1280);
    const onAction = vi.fn();
    render(
      <AppSidebarPreviewShell
        title="toolbar"
        sidebar={<AppSidebar07 onAction={onAction} commandShortcut />}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Settings" }));
    expect(onAction).toHaveBeenCalledWith("settings");
    fireEvent.keyDown(document.body, { key: "k", metaKey: true });
    expect(onAction).toHaveBeenCalledWith("command");
  });

  it("imports app-sidebar modules without window access at load time", async () => {
    const mod = await import("./index");
    expect(mod.appSidebarBlocks).toHaveLength(7);
    expect(typeof mod.AppSidebar01).toBe("function");
    expect(typeof mod.AppSidebar05).toBe("function");
  });
});
