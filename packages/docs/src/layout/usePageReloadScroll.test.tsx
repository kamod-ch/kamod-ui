/** @vitest-environment jsdom */

import { act, cleanup, fireEvent, render } from "@testing-library/preact";
import type { ComponentChildren } from "preact";
import { useLayoutEffect } from "preact/hooks";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { usePageReloadScroll } from "./usePageReloadScroll";

function Page({ children }: { children?: ComponentChildren }) {
  usePageReloadScroll();
  return <main>Guide{children}</main>;
}
let resize: ResizeObserverCallback;
const disconnect = vi.fn();
let navigationType = "reload";
beforeEach(() => {
  navigationType = "reload";
  vi.useFakeTimers();
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  vi.spyOn(window, "scrollY", "get").mockReturnValue(0);
  vi.stubGlobal("performance", {
    now: () => 0,
    getEntriesByType: () => [{ type: navigationType }],
  });
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: ResizeObserverCallback) {
        resize = callback;
      }
      observe() {}
      disconnect = disconnect;
    },
  );
  history.replaceState({ ppScrollY: 1700 }, "", "/blocks/styles");
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  disconnect.mockClear();
  history.replaceState(null, "", "/");
});

it("restores PreactPress history on reload and retries when the page grows", () => {
  render(<Page />);
  act(() => {
    vi.advanceTimersByTime(50);
  });
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 1700, left: 0, behavior: "instant" });
  vi.mocked(window.scrollTo).mockClear();
  act(() => {
    resize([], {} as ResizeObserver);
    vi.advanceTimersByTime(50);
  });
  expect(window.scrollTo).toHaveBeenCalledOnce();
});

it.each(["navigate", "back_forward"])("leaves %s navigation to the existing router", (type) => {
  navigationType = type;
  render(<Page />);
  act(() => {
    vi.advanceTimersByTime(100);
  });
  expect(window.scrollTo).not.toHaveBeenCalled();
});

it.each([undefined, -1, "1700", Infinity])("ignores invalid saved position %s", (value) => {
  history.replaceState({ ppScrollY: value }, "");
  render(<Page />);
  act(() => {
    vi.advanceTimersByTime(100);
  });
  expect(window.scrollTo).not.toHaveBeenCalled();
});

it.each(["wheel", "pointerdown", "keydown", "hashchange", "popstate"])(
  "yields to %s and releases pending work",
  (event) => {
    render(<Page />);
    fireEvent(window, new Event(event));
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(window.scrollTo).not.toHaveBeenCalled();
    expect(disconnect).toHaveBeenCalledOnce();
  },
);

it("ends layout retries after the loading window and cleans up on unmount", () => {
  const remove = vi.spyOn(window, "removeEventListener");
  const view = render(<Page />);
  act(() => {
    vi.advanceTimersByTime(5000);
  });
  expect(disconnect).toHaveBeenCalledOnce();
  expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function));
  view.unmount();
  expect(disconnect).toHaveBeenCalledOnce();
});

it("captures the saved value before child layout work can overwrite history", () => {
  function ChildLayout() {
    useLayoutEffect(() => {
      history.replaceState({ ppScrollY: 0 }, "");
    }, []);
    return null;
  }
  render(
    <Page>
      <ChildLayout />
    </Page>,
  );
  act(() => {
    vi.advanceTimersByTime(50);
  });
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 1700, left: 0, behavior: "instant" });
});
