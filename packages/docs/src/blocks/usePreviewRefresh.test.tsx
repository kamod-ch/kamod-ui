/** @vitest-environment jsdom */
import { act, cleanup, renderHook } from "@testing-library/preact";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { usePreviewRefresh } from "./usePreviewRefresh";

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
const advance = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

it("locks immediately, waits for the current frame, then holds and resets before unlocking", () => {
  const { result } = renderHook(usePreviewRefresh);
  act(() => {
    expect(result.current.refresh()).toBe(true);
    expect(result.current.refresh()).toBe(false);
  });
  expect(result.current.previewKey).toBe(1);
  act(() => result.current.complete(0));
  expect(result.current.phase).toBe("loading");
  act(() => result.current.complete(1));
  expect(result.current.phase).toBe("complete");
  advance(1000);
  act(() => expect(result.current.refresh()).toBe(false));
  expect(result.current.phase).toBe("complete");
  advance(100);
  expect(result.current.phase).toBe("resetting");
  act(() => expect(result.current.refresh()).toBe(false));
  advance(200);
  expect(result.current.phase).toBe("idle");
  act(() => expect(result.current.refresh()).toBe(true));
  expect(result.current.previewKey).toBe(2);
});

it("ignores late frame events and releases a cancelled refresh", () => {
  const { result } = renderHook(usePreviewRefresh);
  act(() => {
    result.current.refresh();
  });
  act(() => result.current.cancel(1));
  act(() => result.current.complete(1));
  expect(result.current.phase).toBe("resetting");
  advance(200);
  act(() => {
    result.current.refresh();
  });
  act(() => {
    result.current.cancel(1);
    result.current.complete(1);
  });
  expect(result.current.phase).toBe("loading");
  act(() => result.current.complete(2));
  expect(result.current.phase).toBe("complete");
});

it("unlocks a stalled frame without claiming it refreshed successfully", () => {
  const { result } = renderHook(usePreviewRefresh);
  act(() => {
    result.current.refresh();
  });
  advance(30000);
  expect(result.current.phase).toBe("resetting");
  advance(200);
  expect(result.current.phase).toBe("idle");
});

it("cleans up pending cooldown timers on unmount", () => {
  const { result, unmount } = renderHook(usePreviewRefresh);
  act(() => {
    result.current.refresh();
  });
  act(() => result.current.complete(1));
  expect(vi.getTimerCount()).toBeGreaterThan(0);
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});
