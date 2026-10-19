/** @vitest-environment jsdom */
import { act, cleanup, render } from "@testing-library/preact";
import { afterEach, expect, it, vi } from "vitest";
import { useTopbarOffset } from "./useTopbarOffset";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it("updates only changed heights, can shrink again and releases the observer and offset", () => {
  let height = 58;
  let resize = () => {};
  const disconnect = vi.fn();
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: () => void) {
        resize = callback;
      }
      observe() {}
      disconnect = disconnect;
    },
  );
  const measure = vi
    .spyOn(HTMLElement.prototype, "getBoundingClientRect")
    .mockImplementation(() => ({ height }) as DOMRect);
  const set = vi.spyOn(document.documentElement.style, "setProperty");
  function Header() {
    return <header ref={useTopbarOffset()} />;
  }
  const view = render(<Header />);
  expect(document.documentElement.style.getPropertyValue("--docs-topbar-offset")).toBe("58px");
  const calls = set.mock.calls.length;
  act(() => resize());
  expect(set.mock.calls).toHaveLength(calls);
  act(() => {
    height = 127.5;
    resize();
  });
  expect(document.documentElement.style.getPropertyValue("--docs-topbar-offset")).toBe("128px");
  act(() => {
    height = 58;
    resize();
  });
  expect(document.documentElement.style.getPropertyValue("--docs-topbar-offset")).toBe("58px");
  act(() => {
    view.unmount();
  });
  expect(disconnect).toHaveBeenCalledOnce();
  expect(document.documentElement.style.getPropertyValue("--docs-topbar-offset")).toBe("");
  measure.mockRestore();
  set.mockRestore();
});
