/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render, screen } from "@testing-library/preact";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { FeedbackCard } from "./FeedbackCard";

beforeEach(() => localStorage.clear());
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it("removes the card and preserves dismissal when another page mounts it", async () => {
  const first = render(<FeedbackCard />);
  fireEvent.click(await screen.findByRole("button", { name: "Dismiss feedback card" }));
  expect(screen.queryByRole("region", { name: "Straight talk" })).not.toBeInTheDocument();
  first.unmount();
  render(<FeedbackCard />);
  expect(screen.queryByText("Straight talk")).not.toBeInTheDocument();
  expect(localStorage.getItem("kamod:feedback-dismissed")).toBe("true");
});

it("can still be dismissed when storage access is blocked", async () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new DOMException("Blocked", "SecurityError");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new DOMException("Blocked", "SecurityError");
  });
  render(<FeedbackCard />);
  fireEvent.click(await screen.findByRole("button", { name: "Dismiss feedback card" }));
  expect(screen.queryByText("Straight talk")).not.toBeInTheDocument();
});

it("syncs dismissal from another tab and removes its listener on unmount", async () => {
  const remove = vi.spyOn(window, "removeEventListener");
  const view = render(<FeedbackCard />);
  await screen.findByText("Straight talk");
  act(() => {
    localStorage.setItem("kamod:feedback-dismissed", "true");
    window.dispatchEvent(new StorageEvent("storage", { key: "kamod:feedback-dismissed" }));
  });
  expect(screen.queryByText("Straight talk")).not.toBeInTheDocument();
  view.unmount();
  expect(remove).toHaveBeenCalledWith("storage", expect.any(Function));
});
