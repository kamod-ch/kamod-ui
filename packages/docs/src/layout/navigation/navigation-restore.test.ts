/** @vitest-environment jsdom */
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { navigationRestoreScript, revealRestoredNavigation } from "./navigation-restore";

const key = "kamod:navigation:/:desktop";
const pending = () => document.documentElement.hasAttribute("data-navigation-restoring");
const boot = (base = "/") => window.eval(navigationRestoreScript(base));

beforeEach(() => {
  vi.useFakeTimers();
  sessionStorage.clear();
});
afterEach(() => {
  window.__kamodRevealNavigation?.();
  document.body.replaceChildren();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

it.each([null, "invalid", '{"top":0}', '{"top":-1}', '{"top":"350"}'])(
  "leaves first visits and invalid memory visible without a timer: %s",
  (value) => {
    if (value !== null) sessionStorage.setItem(key, value);
    boot();
    expect(pending()).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  },
);

it("guards only this base path's desktop memory", () => {
  sessionStorage.setItem(key, '{"top":350}');
  boot("/subpath");
  expect(pending()).toBe(false);
  sessionStorage.setItem("kamod:navigation:/subpath:desktop", '{"top":120}');
  boot("/subpath");
  expect(pending()).toBe(true);
  expect(vi.getTimerCount()).toBe(1);
});

it("keeps the sidebar available when storage is blocked", () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  expect(boot).not.toThrow();
  expect(pending()).toBe(false);
});

it("reveals restored groups together and cancels the fallback", () => {
  sessionStorage.setItem(key, '{"top":350}');
  boot();
  document.body.innerHTML = `<div id="sidebar">
    <button data-navigation-group="components" aria-controls="links" aria-expanded="false"></button>
  </div>`;
  const node = document.getElementById("sidebar")!;
  const groups = { components: true };
  revealRestoredNavigation(node, groups);
  expect(pending()).toBe(true);
  node.firstElementChild!.setAttribute("aria-expanded", "true");
  node.insertAdjacentHTML("beforeend", '<div id="links" style="height:0px"></div>');
  revealRestoredNavigation(node, groups);
  expect(pending()).toBe(true);
  document.getElementById("links")!.style.height = "auto";
  document.getElementById("links")!.style.maxHeight = "none";
  revealRestoredNavigation(node, groups);
  expect(pending()).toBe(false);
  expect(window.__kamodRevealNavigation).toBeUndefined();
  expect(vi.getTimerCount()).toBe(0);
});

it("waits for a restored closed group to finish collapsing", () => {
  sessionStorage.setItem(key, '{"top":350}');
  boot();
  document.body.innerHTML = `<div id="sidebar">
    <button data-navigation-group="components" data-current aria-controls="links" aria-expanded="false"></button>
    <div id="links"></div>
  </div>`;
  const node = document.getElementById("sidebar")!;
  const height = vi.spyOn(document.getElementById("links")!, "getBoundingClientRect");
  height.mockReturnValue({ height: 120 } as DOMRect);
  revealRestoredNavigation(node, { components: false });
  expect(pending()).toBe(true);
  // A zero-height panel can unmount without another resize notification.
  height.mockReturnValue({ height: 0 } as DOMRect);
  revealRestoredNavigation(node, { components: false });
  expect(pending()).toBe(false);
});

it("reveals static navigation if hydration never finishes", () => {
  sessionStorage.setItem(key, '{"top":350}');
  boot();
  vi.advanceTimersByTime(3000);
  expect(pending()).toBe(false);
  expect(window.__kamodRevealNavigation).toBeUndefined();
  expect(vi.getTimerCount()).toBe(0);
});
