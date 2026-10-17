/** @vitest-environment jsdom */
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { scheduleSectionScroll } from "./scroll-to-section";

let frames: Map<number, FrameRequestCallback>;
let sequence = 0;
let mutate: MutationCallback;
let resize: ResizeObserverCallback;
const mutationDisconnect = vi.fn();
const resizeDisconnect = vi.fn();
const flush = () => {
  const pending = [...frames.values()];
  frames.clear();
  pending.forEach((callback) => callback(0));
};

beforeEach(() => {
  frames = new Map();
  mutationDisconnect.mockClear();
  resizeDisconnect.mockClear();
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    frames.set(++sequence, callback);
    return sequence;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => frames.delete(id));
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  vi.spyOn(HTMLElement.prototype, "getClientRects").mockReturnValue([
    new DOMRect(0, 0, 100, 20),
  ] as unknown as DOMRectList);
  vi.stubGlobal(
    "MutationObserver",
    class {
      constructor(callback: MutationCallback) {
        mutate = callback;
      }
      observe() {}
      disconnect = mutationDisconnect;
    },
  );
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: ResizeObserverCallback) {
        resize = callback;
      }
      observe() {}
      unobserve() {}
      disconnect = resizeDisconnect;
    },
  );
});
afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  history.replaceState(null, "", "/");
});

it("reaches a section mounted after more than five frames without polling", () => {
  scheduleSectionScroll("usage");
  for (let attempt = 0; attempt < 10; attempt++) flush();
  expect(window.requestAnimationFrame).toHaveBeenCalledOnce();
  document.body.innerHTML = '<header class="docs-topbar"></header><section id="usage"></section>';
  vi.spyOn(document.querySelector("header")!, "getBoundingClientRect").mockReturnValue({
    height: 64,
  } as DOMRect);
  vi.spyOn(document.querySelector("section")!, "getBoundingClientRect").mockReturnValue({
    top: 500,
  } as DOMRect);
  mutate([], {} as MutationObserver);
  flush();
  expect(window.scrollTo).toHaveBeenCalledWith({ top: 420, behavior: "auto" });
  expect(frames.size).toBe(0);
  expect(mutationDisconnect).toHaveBeenCalledOnce();
  expect(resizeDisconnect).toHaveBeenCalledOnce();
});

it("waits for an existing SSR heading to gain a layout box before following it", () => {
  document.body.innerHTML = '<section id="usage" style="display:none"></section>';
  const section = document.getElementById("usage")!;
  const rects = vi.spyOn(section, "getClientRects").mockReturnValue([] as unknown as DOMRectList);
  scheduleSectionScroll("usage", "instant");
  flush();
  expect(window.scrollTo).not.toHaveBeenCalled();
  rects.mockReturnValue([new DOMRect(0, 500, 100, 20)] as unknown as DOMRectList);
  vi.spyOn(section, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 500, 100, 20));
  section.style.display = "";
  resize([], {} as ResizeObserver);
  flush();
  expect(window.scrollTo).toHaveBeenCalledExactlyOnceWith({ top: 484, behavior: "instant" });
  expect(mutationDisconnect).toHaveBeenCalledOnce();
  expect(resizeDisconnect).toHaveBeenCalledOnce();
});

it("waits for a positive-layout heading to become visible after the page-ready reveal", () => {
  document.body.innerHTML = '<section id="usage" style="visibility:hidden"></section>';
  const section = document.getElementById("usage")!;
  vi.spyOn(section, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 500, 100, 20));
  scheduleSectionScroll("usage", "instant");
  flush();
  expect(section.getClientRects()).toHaveLength(1);
  expect(window.scrollTo).not.toHaveBeenCalled();
  section.style.visibility = "visible";
  mutate([], {} as MutationObserver);
  flush();
  expect(window.scrollTo).toHaveBeenCalledExactlyOnceWith({ top: 484, behavior: "instant" });
  expect(mutationDisconnect).toHaveBeenCalledOnce();
  expect(resizeDisconnect).toHaveBeenCalledOnce();
});

it("cancels a retry so an abandoned route cannot scroll the next page", () => {
  const cancel = scheduleSectionScroll("usage");
  flush();
  cancel();
  document.body.innerHTML = '<section id="usage"></section>';
  mutate([], {} as MutationObserver);
  resize([], {} as ResizeObserver);
  flush();
  expect(window.scrollTo).not.toHaveBeenCalled();
  expect(frames.size).toBe(0);
  expect(mutationDisconnect).toHaveBeenCalledOnce();
  expect(resizeDisconnect).toHaveBeenCalledOnce();
});

it("does not poll for a missing section and releases its observers when cancelled", () => {
  const cancel = scheduleSectionScroll("missing");
  for (let attempt = 0; attempt < 10; attempt++) flush();
  expect(window.requestAnimationFrame).toHaveBeenCalledOnce();
  expect(window.scrollTo).not.toHaveBeenCalled();
  expect(frames.size).toBe(0);
  cancel();
  expect(mutationDisconnect).toHaveBeenCalledOnce();
  expect(resizeDisconnect).toHaveBeenCalledOnce();
});

it.each(["wheel", "touchstart", "pointerdown", "keydown", "popstate", "hashchange"])(
  "yields to %s without following a later target",
  (event) => {
    scheduleSectionScroll("usage");
    flush();
    window.dispatchEvent(new Event(event));
    document.body.innerHTML = '<section id="usage"></section>';
    mutate([], {} as MutationObserver);
    flush();
    expect(window.scrollTo).not.toHaveBeenCalled();
    expect(mutationDisconnect).toHaveBeenCalledOnce();
  },
);

it("rejects a target belonging to a newer route even when its id matches", () => {
  scheduleSectionScroll("usage");
  flush();
  history.replaceState(null, "", "/other");
  document.body.innerHTML = '<section id="usage"></section>';
  mutate([], {} as MutationObserver);
  flush();
  expect(window.scrollTo).not.toHaveBeenCalled();
  expect(mutationDisconnect).toHaveBeenCalledOnce();
});
