/** @vitest-environment jsdom */
import { act, cleanup, render } from "@testing-library/preact";
import { useRef } from "preact/hooks";
import { afterEach, expect, it, vi } from "vitest";
import { useShowcaseWidth } from "./useShowcaseWidth";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it("does not rerender on height-only deliveries and releases its observer on teardown", () => {
  let notify!: ResizeObserverCallback;
  const observe = vi.fn();
  const disconnect = vi.fn();
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: ResizeObserverCallback) {
        notify = callback;
      }
      observe = observe;
      disconnect = disconnect;
    },
  );
  const renders = vi.fn();
  function Showcase() {
    const container = useRef<HTMLElement>(null);
    const width = useShowcaseWidth(container);
    renders(width);
    return <article ref={container}>{width}</article>;
  }
  const { container, unmount } = render(<Showcase />);
  const resize = (width: number, height: number) =>
    act(() =>
      notify([{ contentRect: { width, height } } as ResizeObserverEntry], {} as ResizeObserver),
    );
  expect(observe).toHaveBeenCalledWith(container.querySelector("article"));
  resize(1000, 320);
  const settled = renders.mock.calls.length;
  for (let height = 330; height <= 500; height += 10) resize(1000, height);
  expect(renders).toHaveBeenCalledTimes(settled);
  resize(700, 500);
  expect(container.querySelector("article")).toHaveTextContent("700");
  expect(renders).toHaveBeenCalledTimes(settled + 1);
  unmount();
  expect(disconnect).toHaveBeenCalledOnce();
  resize(500, 500);
  expect(renders).toHaveBeenCalledTimes(settled + 1);
});
