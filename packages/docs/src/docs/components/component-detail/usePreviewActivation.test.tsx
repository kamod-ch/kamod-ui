// @vitest-environment jsdom
import { act, cleanup, fireEvent, render } from "@testing-library/preact";
import { useRef } from "preact/hooks";
import { afterEach, expect, it, vi } from "vitest";
import { usePreviewActivation } from "./usePreviewActivation";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

function Preview({ onSuspend = () => {} }: { onSuspend?: () => void }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const { active, complete } = usePreviewActivation(frame, onSuspend);
  return <iframe ref={frame} src={active ? "/preview" : "about:blank"} onLoad={complete} />;
}

function startNext() {
  act(() => {
    vi.advanceTimersByTime(50);
  });
}

it("drops queued offscreen frames but retains started and completed previews", () => {
  vi.useFakeTimers();
  vi.stubGlobal("requestIdleCallback", undefined);
  let intersect!: IntersectionObserverCallback;
  const disconnect = vi.fn();
  const suspend = vi.fn();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        intersect = callback;
      }
      observe() {}
      disconnect = disconnect;
    },
  );
  const { container, unmount } = render(<Preview onSuspend={suspend} />);
  const frame = container.querySelector("iframe")!;
  const visibility = (isIntersecting: boolean) =>
    act(() =>
      intersect([{ isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver),
    );
  visibility(true);
  visibility(false);
  act(() => {
    vi.advanceTimersByTime(50);
  });
  expect(frame).toHaveAttribute("src", "about:blank");
  visibility(true);
  act(() => {
    vi.advanceTimersByTime(50);
  });
  expect(frame).toHaveAttribute("src", "/preview");
  visibility(false);
  expect(frame).toHaveAttribute("src", "/preview");
  expect(suspend).toHaveBeenCalledOnce();
  visibility(true);
  act(() => {
    vi.advanceTimersByTime(50);
  });
  fireEvent.load(frame);
  visibility(false);
  expect(frame).toHaveAttribute("src", "/preview");
  expect(disconnect).toHaveBeenCalledOnce();
  unmount();
  expect(disconnect).toHaveBeenCalledTimes(2);
  expect(vi.getTimerCount()).toBe(0);
});

it("releases an unfinished startup on unmount so another preview can start", () => {
  vi.useFakeTimers();
  vi.stubGlobal("IntersectionObserver", undefined);
  vi.stubGlobal("requestIdleCallback", undefined);
  const first = render(<Preview />);
  const second = render(<Preview />);
  startNext();
  expect(first.container.querySelector("iframe")).toHaveAttribute("src", "/preview");
  expect(second.container.querySelector("iframe")).toHaveAttribute("src", "about:blank");
  first.unmount();
  startNext();
  expect(second.container.querySelector("iframe")).toHaveAttribute("src", "/preview");
  second.unmount();
  expect(vi.getTimerCount()).toBe(0);
});

it("cancels native idle work when its last queued preview unmounts", () => {
  vi.stubGlobal("IntersectionObserver", undefined);
  const schedule = vi.fn(() => 0);
  const cancel = vi.fn();
  vi.stubGlobal("requestIdleCallback", schedule);
  vi.stubGlobal("cancelIdleCallback", cancel);
  const { container, unmount } = render(<Preview />);
  expect(container.querySelector("iframe")).toHaveAttribute("src", "about:blank");
  expect(schedule).toHaveBeenCalledOnce();
  unmount();
  expect(cancel).toHaveBeenCalledWith(0);
});
