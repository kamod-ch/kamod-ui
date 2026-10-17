/** @vitest-environment jsdom */
import { afterEach, expect, it, vi } from "vitest";
import { observeViewportActivity } from "./viewport-activity";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it("shares visibility observation and pauses activity when its document is hidden", () => {
  let notify!: IntersectionObserverCallback;
  const observe = vi.fn();
  const unobserve = vi.fn();
  const disconnect = vi.fn();
  const construct = vi.fn();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        construct();
        notify = callback;
      }
      observe = observe;
      unobserve = unobserve;
      disconnect = disconnect;
    },
  );
  let hidden = false;
  vi.spyOn(document, "hidden", "get").mockImplementation(() => hidden);
  const nodes = [document.createElement("div"), document.createElement("iframe")];
  const updates = [vi.fn(), vi.fn()];
  const stops = nodes.map((node, index) => observeViewportActivity(node, updates[index]));
  expect(construct).toHaveBeenCalledOnce();
  expect(updates[0]).toHaveBeenLastCalledWith(false);
  notify(
    nodes.map(
      (target) => ({ target, isIntersecting: true }) as unknown as IntersectionObserverEntry,
    ),
    {} as IntersectionObserver,
  );
  expect(updates[0]).toHaveBeenLastCalledWith(true);
  hidden = true;
  document.dispatchEvent(new Event("visibilitychange"));
  expect(updates[1]).toHaveBeenLastCalledWith(false);
  hidden = false;
  document.dispatchEvent(new Event("visibilitychange"));
  expect(updates[1]).toHaveBeenLastCalledWith(true);
  stops[0]();
  expect(disconnect).not.toHaveBeenCalled();
  const calls = updates[0].mock.calls.length;
  document.dispatchEvent(new Event("visibilitychange"));
  expect(updates[0]).toHaveBeenCalledTimes(calls);
  stops[1]();
  expect(unobserve).toHaveBeenCalledTimes(2);
  expect(disconnect).toHaveBeenCalledOnce();
});

it("has a cleanup-safe fallback when intersection observation is unavailable", () => {
  vi.stubGlobal("IntersectionObserver", undefined);
  vi.spyOn(document, "hidden", "get").mockReturnValue(false);
  const update = vi.fn();
  const stop = observeViewportActivity(document.createElement("div"), update);
  expect(update).toHaveBeenLastCalledWith(true);
  stop();
  const calls = update.mock.calls.length;
  document.dispatchEvent(new Event("visibilitychange"));
  expect(update).toHaveBeenCalledTimes(calls);
});
