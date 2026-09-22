import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Sidebar } from "./Sidebar";
import { SidebarProvider, useSidebar } from "./SidebarProvider";
import { SidebarTrigger } from "./SidebarTrigger";

beforeEach(() => {
  vi.stubGlobal("matchMedia", (media: string) => ({
    matches: false,
    media,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it("returns mobile focus to the pointer opener even when the browser does not focus it", async () => {
  vi.stubGlobal("innerWidth", 320);
  vi.stubGlobal("matchMedia", (media: string) => ({
    matches: media.includes("max-width: 767px"),
    media,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  render(
    <SidebarProvider>
      <button type="button">Previous focus</button>
      <SidebarTrigger />
      <Sidebar>
        <button type="button">Inside sidebar</button>
      </Sidebar>
    </SidebarProvider>,
  );
  screen.getByRole("button", { name: "Previous focus" }).focus();
  const trigger = screen.getByRole("button", { name: "Toggle Sidebar" });
  // fireEvent reproduces Safari's click without a preceding native focus change.
  fireEvent.click(trigger);
  const dialog = await screen.findByRole("dialog", { name: "Sidebar" });
  fireEvent.keyDown(dialog, { key: "Escape" });
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  await waitFor(() => expect(trigger).toHaveFocus());
});

const Navigation = () => {
  const { open, toggleSidebar } = useSidebar();
  return (
    <button type="button" aria-expanded={open} onClick={toggleSidebar}>
      Toggle navigation
    </button>
  );
};

describe("sidebar desktop state", () => {
  it("updates uncontrolled state while reporting changes to an observer", () => {
    const onOpenChange = vi.fn();
    render(
      <SidebarProvider defaultOpen onOpenChange={onOpenChange}>
        <Navigation />
      </SidebarProvider>,
    );
    const trigger = screen.getByRole("button", { name: "Toggle navigation" });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(onOpenChange.mock.calls).toEqual([[false], [true]]);
  });

  it("leaves controlled state with the consumer until the prop changes", () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <SidebarProvider open onOpenChange={onOpenChange}>
        <Navigation />
      </SidebarProvider>,
    );
    const trigger = screen.getByRole("button", { name: "Toggle navigation" });
    fireEvent.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    rerender(
      <SidebarProvider open={false} onOpenChange={onOpenChange}>
        <Navigation />
      </SidebarProvider>,
    );
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
