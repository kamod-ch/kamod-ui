/** @vitest-environment jsdom */
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { scheduleSectionScroll } from "./scroll-to-section";

let frames: Map<number, FrameRequestCallback>;
let sequence = 0;
const flush = () => {
  const pending = [...frames.values()];
  frames.clear();
  pending.forEach((callback) => callback(0));
};

beforeEach(() => {
  frames = new Map();
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    frames.set(++sequence, callback);
    return sequence;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => frames.delete(id));
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});
afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

it("reaches a late-mounted section below the sticky header", () => {
  scheduleSectionScroll("usage");
  flush();
  document.body.innerHTML = '<header class="docs-topbar"></header><section id="usage"></section>';
  vi.spyOn(document.querySelector("header")!, "getBoundingClientRect").mockReturnValue({
    height: 64,
  } as DOMRect);
  vi.spyOn(document.querySelector("section")!, "getBoundingClientRect").mockReturnValue({
    top: 500,
  } as DOMRect);
  flush();
  expect(window.scrollTo).toHaveBeenCalledWith({ top: 420, behavior: "auto" });
  expect(frames.size).toBe(0);
});

it("cancels a retry so an abandoned route cannot scroll the next page", () => {
  const cancel = scheduleSectionScroll("usage");
  flush();
  cancel();
  document.body.innerHTML = '<section id="usage"></section>';
  flush();
  expect(window.scrollTo).not.toHaveBeenCalled();
  expect(frames.size).toBe(0);
});

it("stops retrying if a section never mounts", () => {
  scheduleSectionScroll("missing");
  for (let attempt = 0; attempt < 10; attempt++) flush();
  expect(window.requestAnimationFrame).toHaveBeenCalledTimes(5);
  expect(window.scrollTo).not.toHaveBeenCalled();
  expect(frames.size).toBe(0);
});
