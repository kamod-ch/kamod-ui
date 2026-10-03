/** @vitest-environment jsdom */
import { act, cleanup, render } from "@testing-library/preact";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { ComponentPreviewFrame } from "./ComponentPreviewFrame";

beforeEach(() => vi.useFakeTimers());

afterEach(() => {
  cleanup();
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

it("loads after a batched hidden-to-visible jump and disconnects on teardown", () => {
  let notify: IntersectionObserverCallback;
  const disconnect = vi.fn();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        notify = callback;
      }
      observe() {}
      disconnect = disconnect;
    },
  );
  const { container, unmount } = render(
    <ComponentPreviewFrame
      slug="formisch"
      index={4}
      title="Formisch"
      appearance={{ preset: "ocean", scheme: "dark" }}
    />,
  );
  const frame = container.querySelector("iframe")!;
  expect(frame.hasAttribute("src")).toBe(false);
  act(() =>
    notify(
      [
        { isIntersecting: false } as IntersectionObserverEntry,
        { isIntersecting: true } as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    ),
  );
  expect(frame.getAttribute("src")).toBe(
    "/component-preview-frame.htm?component=formisch&example=4",
  );
  expect(disconnect).toHaveBeenCalledTimes(1);
  unmount();
  expect(disconnect).toHaveBeenCalledTimes(2);
});

it("replaces resize observers on reload and cancels pending measurements on unmount", () => {
  vi.stubGlobal("IntersectionObserver", undefined);
  const observers: { disconnect: ReturnType<typeof vi.fn> }[] = [];
  vi.stubGlobal(
    "ResizeObserver",
    class {
      disconnect = vi.fn();
      constructor() {
        observers.push(this);
      }
      observe() {}
    },
  );
  let nextFrame = 0;
  const pending = new Map<number, FrameRequestCallback>();
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    pending.set(++nextFrame, callback);
    return nextFrame;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => pending.delete(id));
  const onLoad = vi.fn();
  const { container, unmount } = render(
    <ComponentPreviewFrame
      slug="input"
      index={0}
      title="Input"
      appearance={{ preset: "kamod", scheme: "light" }}
      previewKey={3}
      onLoad={onLoad}
    />,
  );
  const frame = container.querySelector("iframe")!;
  const previewDocument = document.implementation.createHTMLDocument();
  previewDocument.body.innerHTML =
    '<main id="component-preview-root" data-preview-ready="true"></main>';
  Object.defineProperty(frame, "contentDocument", { value: previewDocument });
  let measurement = 0;
  const load = () =>
    act(() => {
      frame.dispatchEvent(new Event("load"));
      // Capture this measurement before Preact schedules its own effect frames.
      measurement = nextFrame;
    });
  load();
  expect(onLoad).toHaveBeenCalledWith(3);
  const firstMeasurement = measurement;
  expect(pending.has(firstMeasurement)).toBe(true);
  load();
  expect(observers[0].disconnect).toHaveBeenCalledOnce();
  expect(pending.has(firstMeasurement)).toBe(false);
  expect(pending.has(measurement)).toBe(true);
  unmount();
  expect(observers[1].disconnect).toHaveBeenCalledOnce();
  expect(pending.has(measurement)).toBe(false);
});
