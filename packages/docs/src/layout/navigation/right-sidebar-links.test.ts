/** @vitest-environment jsdom */
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { connectRightSidebarLinks } from "./right-sidebar-links";

let disconnect: () => void;
let node: HTMLElement;
let link: HTMLAnchorElement;
let navigate = vi.fn<() => void>();

beforeEach(() => {
  vi.useFakeTimers();
  history.replaceState(null, "", "/docs/example");
  document.body.innerHTML =
    '<a id="prose" href="#last">Read more</a><nav style="overflow-y:auto"><a href="#last">Last section</a></nav>';
  node = document.querySelector("nav")!;
  link = document.getElementById("prose") as HTMLAnchorElement;
  link.onclick = (event) => event.preventDefault();
  Object.defineProperty(node, "clientHeight", { value: 300 });
  vi.spyOn(node, "getBoundingClientRect").mockReturnValue({ top: 84 } as DOMRect);
  vi.spyOn(node.firstElementChild!, "getBoundingClientRect").mockImplementation(
    () => ({ top: 484 - node.scrollTop }) as DOMRect,
  );
  navigate = vi.fn();
  disconnect = connectRightSidebarLinks(node, navigate);
});
afterEach(() => {
  disconnect();
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.innerHTML = "";
  history.replaceState(null, "", "/");
});

it("aligns prose links and repeated fragments without scrolling the document", () => {
  const pageScroll = vi.spyOn(window, "scrollTo");
  link.click();
  vi.runAllTimers();
  expect(node.scrollTop).toBe(400);
  node.scrollTop = 120;
  link.click();
  vi.runAllTimers();
  expect(node.scrollTop).toBe(400);
  expect(navigate).toHaveBeenCalledTimes(2);
  expect(pageScroll).not.toHaveBeenCalled();
});

it("follows history fragment changes but ignores passive scroll tracking", () => {
  node.dispatchEvent(new Event("scroll"));
  expect(navigate).not.toHaveBeenCalled();
  history.replaceState(null, "", "#last");
  window.dispatchEvent(new HashChangeEvent("hashchange"));
  vi.runAllTimers();
  expect(node.scrollTop).toBe(400);
});

it.each([
  "/another#last",
  "?different=1#last",
  "https://example.com/#last",
  "#missing",
  "#%invalid",
])("ignores unrelated or invalid destinations: %s", (href) => {
  link.href = href;
  link.click();
  vi.runAllTimers();
  expect(navigate).not.toHaveBeenCalled();
});

it("leaves modified clicks and overflow-visible nested lists alone", () => {
  link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, ctrlKey: true }));
  vi.runAllTimers();
  expect(navigate).not.toHaveBeenCalled();
  node.style.overflowY = "visible";
  link.click();
  vi.runAllTimers();
  expect(navigate).not.toHaveBeenCalled();
});

it("cancels pending alignment and removes its listeners on cleanup", () => {
  link.click();
  disconnect();
  vi.runAllTimers();
  link.click();
  window.dispatchEvent(new HashChangeEvent("hashchange"));
  vi.runAllTimers();
  expect(navigate).not.toHaveBeenCalled();
});

it("reveals reading links in both directions without moving the page or overriding manual browsing", async () => {
  const target = node.firstElementChild as HTMLAnchorElement;
  const pageScroll = vi.spyOn(window, "scrollTo");
  vi.spyOn(target, "getBoundingClientRect").mockImplementation(
    () => ({ top: 484 - node.scrollTop, bottom: 524 - node.scrollTop }) as DOMRect,
  );
  vi.spyOn(window, "scrollY", "get").mockReturnValue(900);
  window.dispatchEvent(new Event("scroll"));
  target.setAttribute("aria-current", "location");
  await Promise.resolve();
  vi.runAllTimers();
  expect(node.scrollTop).toBe(196);
  expect(pageScroll).not.toHaveBeenCalled();

  node.scrollTop = 480;
  node.dispatchEvent(new Event("scroll"));
  vi.runAllTimers();
  expect(node.scrollTop).toBe(480);
  target.removeAttribute("aria-current");
  await Promise.resolve();
  vi.runAllTimers();
  target.setAttribute("aria-current", "location");
  await Promise.resolve();
  vi.runAllTimers();
  expect(node.scrollTop).toBe(384);
});

it("leaves initial active state and already-visible reading links in place", async () => {
  const target = node.firstElementChild as HTMLAnchorElement;
  target.setAttribute("aria-current", "location");
  await Promise.resolve();
  vi.runAllTimers();
  expect(node.scrollTop).toBe(0);
  target.removeAttribute("aria-current");
  await Promise.resolve();
  vi.runAllTimers();
  vi.spyOn(window, "scrollY", "get").mockReturnValue(900);
  vi.spyOn(target, "getBoundingClientRect").mockReturnValue({ top: 100, bottom: 140 } as DOMRect);
  window.dispatchEvent(new Event("scroll"));
  target.setAttribute("aria-current", "location");
  await Promise.resolve();
  vi.runAllTimers();
  expect(node.scrollTop).toBe(0);
  expect(navigate).not.toHaveBeenCalled();
});

it("uses the visible ancestor scrollport and leaves space below a wrapped active link", async () => {
  const parent = document.createElement("aside");
  parent.style.overflowY = "auto";
  node.before(parent);
  parent.append(node);
  Object.defineProperty(parent, "clientHeight", { value: 200 });
  vi.spyOn(parent, "getBoundingClientRect").mockReturnValue({ top: 84 } as DOMRect);
  const target = node.firstElementChild!;
  vi.spyOn(target, "getBoundingClientRect").mockImplementation(
    () => ({ top: 344 - node.scrollTop, bottom: 416 - node.scrollTop }) as DOMRect,
  );
  vi.spyOn(window, "scrollY", "get").mockReturnValue(900);
  window.dispatchEvent(new Event("scroll"));
  target.setAttribute("aria-current", "location");
  await Promise.resolve();
  vi.runAllTimers();
  const item = target.getBoundingClientRect();
  expect(item.top).toBeGreaterThanOrEqual(100);
  expect(item.bottom).toBe(228); // 56px above the ancestor's visible bottom.
});

it("prioritizes the whole active link over next-entry space in a short viewport", async () => {
  vi.spyOn(window, "innerHeight", "get").mockReturnValue(220);
  const target = node.firstElementChild!;
  vi.spyOn(target, "getBoundingClientRect").mockImplementation(
    () => ({ top: 300 - node.scrollTop, bottom: 400 - node.scrollTop }) as DOMRect,
  );
  vi.spyOn(window, "scrollY", "get").mockReturnValue(900);
  window.dispatchEvent(new Event("scroll"));
  target.setAttribute("aria-current", "location");
  await Promise.resolve();
  vi.runAllTimers();
  const item = target.getBoundingClientRect();
  expect(item.top).toBe(100);
  expect(item.bottom).toBe(200);
});

it("does not nudge a followed link away from the top when its active state catches up", async () => {
  const target = node.firstElementChild!;
  vi.spyOn(target, "getBoundingClientRect").mockImplementation(
    () => ({ top: 83.6, bottom: 123.6 }) as DOMRect,
  );
  vi.spyOn(window, "scrollY", "get").mockReturnValue(900);
  window.dispatchEvent(new Event("scroll"));
  target.setAttribute("aria-current", "location");
  await Promise.resolve();
  vi.runAllTimers();
  expect(node.scrollTop).toBe(0);
  expect(navigate).not.toHaveBeenCalled();
});

it("keeps followed destinations stable through intermediate headings until reading resumes", async () => {
  link.click();
  vi.runAllTimers();
  navigate.mockClear();
  const target = node.firstElementChild!;
  vi.spyOn(target, "getBoundingClientRect").mockImplementation(
    () => ({ top: 484 - node.scrollTop, bottom: 524 - node.scrollTop }) as DOMRect,
  );
  node.scrollTop = 0;
  vi.spyOn(window, "scrollY", "get").mockReturnValue(900);
  window.dispatchEvent(new Event("scroll"));
  target.setAttribute("aria-current", "location");
  await Promise.resolve();
  vi.runAllTimers();
  expect(navigate).not.toHaveBeenCalled();
  document.dispatchEvent(new Event("wheel"));
  target.removeAttribute("aria-current");
  await Promise.resolve();
  vi.runAllTimers();
  target.setAttribute("aria-current", "location");
  await Promise.resolve();
  vi.runAllTimers();
  expect(node.scrollTop).toBe(196);
});
