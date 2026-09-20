import { cleanup, fireEvent, render, screen } from "@testing-library/preact";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SidebarProvider, useSidebar } from "./SidebarProvider";

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
