// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { setupHoverPrefetch, setupViewportPrefetch } from "./link-prefetch";
import { createPageLoader } from "./page-loading";
import {
  connectScrollPersistence,
  finishScrollRestoration,
  guardScrollRestoration,
  readRememberedScrollPosition,
  rememberScrollPosition,
} from "./scroll-persistence";

let intersect: IntersectionObserverCallback;
const disconnect = vi.fn();
const unobserve = vi.fn();
const cleanups: Array<() => void> = [];
const route = (href: string) => {
  const url = new URL(href, location.href);
  return url.origin === location.origin ? url.pathname : undefined;
};
beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  history.replaceState({}, "", "/");
  document.body.innerHTML = "";
  vi.stubGlobal("requestIdleCallback", undefined);
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        intersect = callback;
      }
      observe = vi.fn();
      unobserve = unobserve;
      disconnect = disconnect;
    },
  );
});
afterEach(() => {
  cleanups.splice(0).forEach((cleanup) => cleanup());
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
const visible = (links = [...document.querySelectorAll("a")]) =>
  intersect(
    links.map((target) => ({
      target,
      isIntersecting: true,
      intersectionRatio: 1,
      boundingClientRect: new DOMRect(),
      intersectionRect: new DOMRect(),
      rootBounds: null,
      time: 0,
    })),
    {} as IntersectionObserver,
  );

it("coalesces a scroll burst, flushes pagehide, and cancels late writes after route cleanup", () => {
  const persist = vi.fn();
  const stop = connectScrollPersistence(persist);
  cleanups.push(stop);
  for (let index = 0; index < 60; index++) {
    window.dispatchEvent(new Event("scroll"));
    vi.advanceTimersByTime(16);
  }
  expect(persist).not.toHaveBeenCalled();
  vi.advanceTimersByTime(150);
  expect(persist).toHaveBeenCalledTimes(1);
  window.dispatchEvent(new Event("scroll"));
  window.dispatchEvent(new Event("pagehide"));
  expect(persist).toHaveBeenCalledTimes(2);
  window.dispatchEvent(new Event("scroll"));
  stop();
  vi.runAllTimers();
  expect(persist).toHaveBeenCalledTimes(2);
});

it("cancels native Back's pending save before router cleanup and restores the freshest entry", () => {
  let top = 0;
  vi.spyOn(window, "scrollY", "get").mockImplementation(() => top);
  const incoming = connectScrollPersistence(vi.fn());
  const firstEntry = history.state;
  top = 275;
  window.dispatchEvent(new Event("scroll"));
  incoming();
  // The latest position exists only in memory, not in a debounced history write.
  expect(firstEntry.ppScrollY).toBeUndefined();
  history.pushState({}, "", "/outgoing");
  const persist = vi.fn();
  cleanups.push(connectScrollPersistence(persist));
  top = 950;
  window.dispatchEvent(new Event("scroll"));
  const outgoingEntry = history.state;
  history.replaceState(firstEntry, "", "/");
  window.dispatchEvent(new PopStateEvent("popstate", { state: firstEntry }));
  // Keep the outgoing listener mounted beyond its timer deadline, as slow route work can do.
  vi.advanceTimersByTime(200);
  expect(persist).not.toHaveBeenCalled();
  expect(readRememberedScrollPosition(0)).toBe(275);
  // An intermediate layout clamp must not overwrite the restoration destination.
  top = 0;
  window.dispatchEvent(new Event("scroll"));
  expect(readRememberedScrollPosition(0)).toBe(275);
  top = 275;
  finishScrollRestoration();
  top = 300;
  window.dispatchEvent(new Event("scroll"));
  vi.advanceTimersByTime(150);
  expect(persist).toHaveBeenCalledTimes(1);
  history.replaceState(outgoingEntry, "", "/outgoing");
  window.dispatchEvent(new PopStateEvent("popstate", { state: outgoingEntry }));
  expect(readRememberedScrollPosition(0)).toBe(950);
});

it("never writes a queued outgoing save into a new pushState entry", () => {
  const persist = vi.fn();
  cleanups.push(connectScrollPersistence(persist));
  window.dispatchEvent(new Event("scroll"));
  history.pushState({}, "", "/destination");
  // A new router connection may assign identity before the outgoing effect cleans up.
  rememberScrollPosition(0);
  vi.advanceTimersByTime(200);
  expect(persist).not.toHaveBeenCalled();
});

it("keeps repeated URLs and native fragment entries distinct, without waiting for a remount", () => {
  let top = 0;
  vi.spyOn(window, "scrollY", "get").mockImplementation(() => top);
  const persist = vi.fn();
  const stop = connectScrollPersistence(persist);
  cleanups.push(stop);
  top = 100;
  window.dispatchEvent(new Event("scroll"));
  const firstEntry = history.state;
  history.pushState({}, "", "/#usage");
  window.dispatchEvent(new HashChangeEvent("hashchange"));
  top = 350;
  window.dispatchEvent(new Event("scroll"));
  const fragmentEntry = history.state;
  expect(fragmentEntry.kamodScrollEntry).not.toBe(firstEntry.kamodScrollEntry);
  history.replaceState(firstEntry, "", "/");
  window.dispatchEvent(new PopStateEvent("popstate", { state: firstEntry }));
  window.dispatchEvent(new HashChangeEvent("hashchange"));
  expect(readRememberedScrollPosition(0)).toBe(100);
  stop();
  // A separate visit to the exact same URL gets its own identity too.
  history.pushState({}, "", "/");
  cleanups.push(connectScrollPersistence(persist));
  rememberScrollPosition(700);
  expect(history.state.kamodScrollEntry).not.toBe(firstEntry.kamodScrollEntry);
  history.replaceState(fragmentEntry, "", "/#usage");
  expect(readRememberedScrollPosition(0)).toBe(350);
});

it("records synthetic search navigation's new entry and bounds retained history positions", () => {
  cleanups.push(connectScrollPersistence(vi.fn()));
  const oldest = history.state;
  rememberScrollPosition(123);
  for (let index = 0; index < 90; index++) {
    history.pushState({}, "", `/search-${index}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
    rememberScrollPosition(index);
  }
  expect(readRememberedScrollPosition(0)).toBe(89);
  history.replaceState(oldest, "", "/");
  expect(readRememberedScrollPosition(456)).toBe(456);
});

it("cancels obsolete layout waits before they can scroll or update a newer entry", () => {
  cleanups.push(connectScrollPersistence(vi.fn()));
  rememberScrollPosition(240);
  const delayedFirst = guardScrollRestoration();
  history.pushState({}, "", "/next");
  const current = guardScrollRestoration();
  rememberScrollPosition(600);
  expect(delayedFirst()).toBe(false);
  expect(current()).toBe(true);
  expect(readRememberedScrollPosition(0)).toBe(600);
  const latest = guardScrollRestoration();
  expect(current()).toBe(false);
  expect(latest()).toBe(true);
  window.dispatchEvent(new Event("wheel"));
  expect(latest()).toBe(false);
});

it("shares a pending page between speculative and active loads and retries failures", async () => {
  let resolve!: (value: string) => void;
  let reject!: (reason: Error) => void;
  const load = vi.fn(
    () =>
      new Promise<string>((yes, no) => {
        resolve = yes;
        reject = no;
      }),
  );
  const pages = createPageLoader(load, () => undefined);
  const speculative = pages.prefetchPage("/docs/button", "/");
  const navigation = pages.loadPage("/docs/button", "/");
  expect(pages.loadPage("/docs/button", "/")).toBe(navigation);
  expect(load).toHaveBeenCalledTimes(1);
  resolve("page");
  await expect(navigation).resolves.toBe("page");
  await speculative;
  const failed = pages.prefetchPage("/docs/input", "/");
  reject(new Error("offline"));
  await expect(failed).resolves.toBeUndefined();
  const retry = pages.loadPage("/docs/input", "/");
  expect(load).toHaveBeenCalledTimes(3);
  resolve("retried");
  await expect(retry).resolves.toBe("retried");
});

it("returns cached pages without creating a request", async () => {
  const load = vi.fn();
  const pages = createPageLoader(load, () => "cached");
  await expect(pages.loadPage("/docs/button", "/")).resolves.toBe("cached");
  expect(load).not.toHaveBeenCalled();
});

it("deduplicates routes and limits background concurrency without blocking active navigation", async () => {
  document.body.innerHTML =
    '<a href="/one">One</a><a href="/one#two">One again</a><a href="/two">Two</a><a href="/three">Three</a>';
  const resolutions: Array<(value: string) => void> = [];
  const load = vi.fn(
    (_route: string, _base: string) => new Promise<string>((resolve) => resolutions.push(resolve)),
  );
  const pages = createPageLoader(load, () => undefined);
  const stop = setupViewportPrefetch(route, (url) => pages.prefetchPage(url, "/"));
  cleanups.push(stop);
  visible();
  await vi.advanceTimersByTimeAsync(500);
  expect(load.mock.calls.map(([path]) => path)).toEqual(["/one", "/two"]);
  const navigation = pages.loadPage("/urgent", "/");
  expect(load).toHaveBeenCalledTimes(3);
  resolutions[2]("urgent");
  await navigation;
  resolutions[0]("one");
  await vi.advanceTimersByTimeAsync(50);
  expect(load.mock.calls.map(([path]) => path)).toEqual(["/one", "/two", "/urgent", "/three"]);
  stop();
  resolutions[1]("two");
  resolutions[3]("three");
  await vi.runAllTimersAsync();
  expect(load).toHaveBeenCalledTimes(4);
});

it("caps viewport fanout and cancels idle work when leaving the page", async () => {
  document.body.innerHTML = Array.from(
    { length: 30 },
    (_, index) => `<a href="/page-${index}">Page</a>`,
  ).join("");
  const prefetch = vi.fn();
  const stop = setupViewportPrefetch(route, prefetch);
  cleanups.push(stop);
  visible();
  await vi.runAllTimersAsync();
  expect(prefetch).toHaveBeenCalledTimes(12);
  stop();
  const stoppedPrefetch = vi.fn();
  const stopImmediately = setupViewportPrefetch(route, stoppedPrefetch);
  visible();
  stopImmediately();
  await vi.runAllTimersAsync();
  expect(stoppedPrefetch).not.toHaveBeenCalled();
});

it("does not scan syntax-token mutations and releases removed links", async () => {
  document.body.innerHTML = '<a href="/one">One</a><pre><code></code></pre>';
  cleanups.push(setupViewportPrefetch(route, vi.fn()));
  const scan = vi.spyOn(Element.prototype, "querySelectorAll");
  document.querySelector("code")!.innerHTML = "<span>token</span>".repeat(100);
  await Promise.resolve();
  expect(scan).not.toHaveBeenCalled();
  const link = document.querySelector("a")!;
  link.remove();
  await Promise.resolve();
  expect(unobserve).toHaveBeenCalledWith(link);
});

it("prefetches only sustained pointer intent and cancels on leave/unmount", async () => {
  document.body.innerHTML = '<a href="/one"><strong>One</strong></a><a href="/two">Two</a>';
  const [first, second] = [...document.querySelectorAll("a")];
  const prefetch = vi.fn();
  const stop = setupHoverPrefetch(route, prefetch);
  cleanups.push(stop);
  first.dispatchEvent(new MouseEvent("pointerover", { bubbles: true }));
  await vi.advanceTimersByTimeAsync(60);
  first.firstElementChild!.dispatchEvent(new MouseEvent("pointerover", { bubbles: true }));
  await vi.advanceTimersByTimeAsync(40);
  expect(prefetch).toHaveBeenCalledExactlyOnceWith("/one");
  second.dispatchEvent(new MouseEvent("pointerover", { bubbles: true }));
  second.dispatchEvent(new MouseEvent("pointerout", { bubbles: true }));
  await vi.advanceTimersByTimeAsync(150);
  expect(prefetch).toHaveBeenCalledTimes(1);
  second.dispatchEvent(new MouseEvent("pointerover", { bubbles: true }));
  stop();
  await vi.runAllTimersAsync();
  expect(prefetch).toHaveBeenCalledTimes(1);
});
