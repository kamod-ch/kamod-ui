/** @vitest-environment jsdom */
import { fireEvent } from "@testing-library/preact";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { connectTooltips } from "./connect-tooltips";

const disposers: Array<() => void> = [];
const hover = (node: Element) => {
  const event = new Event("pointerover", { bubbles: true });
  Object.defineProperties(event, {
    pointerType: { value: "mouse" },
    clientX: { value: 100 },
    clientY: { value: 100 },
  });
  fireEvent(node, event);
};

function openHint() {
  document.body.innerHTML = `
    <button title="Copy source"><svg aria-hidden="true"></svg></button>
    <aside data-application-tooltip><div><a href="#source">Source</a></div></aside>
    <input aria-label="Unrelated field">
  `;
  const trigger = document.querySelector("button")!;
  const overlay = document.querySelector("aside")!;
  const content = overlay.querySelector("div")!;
  const link = overlay.querySelector("a")!;
  const unrelated = document.querySelector("input")!;
  const change = vi.fn();
  const stop = connectTooltips(document, change);
  disposers.push(stop);
  hover(trigger);
  vi.advanceTimersByTime(450);
  expect(change).toHaveBeenLastCalledWith(expect.objectContaining({ target: trigger }));
  return { trigger, overlay, content, link, unrelated, change, stop };
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  disposers.splice(0).forEach((stop) => stop());
  document.body.replaceChildren();
  vi.useRealTimers();
});

it("allows crossing the trigger gap and cancels a delayed close on card reentry", () => {
  const { trigger, overlay, change } = openHint();
  fireEvent.pointerOut(trigger, { relatedTarget: document.body });
  vi.advanceTimersByTime(300);
  expect(change).not.toHaveBeenLastCalledWith(null);
  hover(overlay);
  vi.advanceTimersByTime(500);
  expect(change).not.toHaveBeenLastCalledWith(null);
  fireEvent.pointerOut(overlay, { relatedTarget: document.body });
  vi.advanceTimersByTime(349);
  expect(change).not.toHaveBeenLastCalledWith(null);
  vi.advanceTimersByTime(1);
  expect(change).toHaveBeenLastCalledWith(null);
});

it("ignores pointer and focus departures from unrelated page content", () => {
  const { trigger, overlay, unrelated, change } = openHint();
  fireEvent.pointerOut(trigger, { relatedTarget: overlay });
  hover(overlay);
  fireEvent.pointerOut(unrelated, { relatedTarget: document.body });
  fireEvent.focusOut(unrelated, { relatedTarget: document.body });
  vi.advanceTimersByTime(500);
  expect(change).not.toHaveBeenLastCalledWith(null);
});

it("retains a mouse-opened card while its container or nested content scrolls", () => {
  const { trigger, overlay, content, change } = openHint();
  fireEvent.pointerOut(trigger, { relatedTarget: overlay });
  hover(overlay);
  fireEvent.scroll(content);
  fireEvent.scroll(overlay);
  vi.advanceTimersByTime(500);
  expect(change).not.toHaveBeenLastCalledWith(null);
  fireEvent.scroll(document);
  expect(change).toHaveBeenLastCalledWith(null);
});

it("does not dismiss on a native-scrollbar focus loss, but still dismisses outside focus", () => {
  const { trigger, overlay, link, unrelated, change } = openHint();
  fireEvent.pointerOut(trigger, { relatedTarget: overlay });
  hover(overlay);
  fireEvent(link, new FocusEvent("focusout", { bubbles: true, relatedTarget: null }));
  vi.advanceTimersByTime(500);
  expect(change).not.toHaveBeenLastCalledWith(null);
  fireEvent(link, new FocusEvent("focusout", { bubbles: true, relatedTarget: unrelated }));
  expect(change).toHaveBeenLastCalledWith(null);
});

it("keeps Escape and outside pointer dismissal immediate during the grace period", () => {
  const { trigger, change } = openHint();
  fireEvent.pointerOut(trigger, { relatedTarget: document.body });
  fireEvent.keyDown(document.body, { key: "Escape" });
  expect(change).toHaveBeenLastCalledWith(null);
  hover(trigger);
  vi.advanceTimersByTime(450);
  fireEvent.pointerOut(trigger, { relatedTarget: document.body });
  fireEvent.pointerDown(document.body);
  expect(change).toHaveBeenLastCalledWith(null);
  expect(vi.getTimerCount()).toBe(0);
});

it("cleans a pending departure timer and restores native titles when disconnected", () => {
  const { trigger, stop, change } = openHint();
  fireEvent.pointerOut(trigger, { relatedTarget: document.body });
  stop();
  expect(trigger).toHaveAttribute("title", "Copy source");
  expect(vi.getTimerCount()).toBe(0);
  change.mockClear();
  hover(trigger);
  vi.advanceTimersByTime(1000);
  expect(change).not.toHaveBeenCalled();
});
