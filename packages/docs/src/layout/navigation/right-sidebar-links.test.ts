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
  Object.defineProperty(node, "clientHeight", { value: 300, configurable: true });
  vi.spyOn(node, "getBoundingClientRect").mockReturnValue({ top: 84 } as DOMRect);
  vi.spyOn(node.firstElementChild!, "getBoundingClientRect").mockImplementation(
    () => ({ top: 484 - node.scrollTop }) as DOMRect,
  );
  navigate = vi.fn();
  disconnect = connectRightSidebarLinks(node, navigate).disconnect;
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

it("aligns the section entry rather than a header shortcut with the same destination", () => {
  const shortcut = document.createElement("a");
  shortcut.href = "#last";
  shortcut.dataset.contentsAction = "";
  shortcut.textContent = "Jump to the current section";
  node.prepend(shortcut);
  vi.spyOn(shortcut, "getBoundingClientRect").mockReturnValue({ top: 84 } as DOMRect);
  link.click();
  vi.runAllTimers();
  expect(node.scrollTop).toBe(400);
});

it("follows history fragment changes but ignores passive scroll tracking", () => {
  node.dispatchEvent(new Event("scroll"));
  expect(navigate).not.toHaveBeenCalled();
  history.replaceState(null, "", "#last");
  window.dispatchEvent(new HashChangeEvent("hashchange"));
  vi.runAllTimers();
  expect(node.scrollTop).toBe(400);
});

it("selects an incoming encoded fragment on reload without replacing the reading destination", () => {
  disconnect();
  history.replaceState(null, "", "/docs/example#saved%20field");
  const destination = node.firstElementChild as HTMLAnchorElement;
  destination.href = "#saved%20field";
  destination.setAttribute("aria-current", "location");
  const shortcut = document.createElement("a");
  shortcut.href = destination.href;
  shortcut.dataset.contentsAction = "";
  node.prepend(shortcut);
  for (const href of [
    "/another#saved%20field",
    "?different=1#saved%20field",
    "https://example.com/docs/example#saved%20field",
  ]) {
    const unrelated = document.createElement("a");
    unrelated.href = href;
    node.append(unrelated);
  }
  vi.spyOn(window, "performance", "get").mockReturnValue({
    getEntriesByType: () => [{ type: "reload" }],
  } as unknown as Performance);
  disconnect = connectRightSidebarLinks(node, navigate).disconnect;
  expect(destination).toHaveAttribute("data-contents-selected");
  expect(destination).toHaveAttribute("aria-current", "location");
  expect(shortcut).not.toHaveAttribute("data-contents-selected");
  expect(node.querySelectorAll("[data-contents-selected]")).toHaveLength(1);
  expect(navigate).not.toHaveBeenCalled();
});

it.each(["", "#missing", "#%invalid"])(
  "clears the selected destination when the URL has no matching fragment: %s",
  (hash) => {
    const destination = node.firstElementChild!;
    history.replaceState(null, "", "/docs/example#last");
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    expect(destination).toHaveAttribute("data-contents-selected");
    history.replaceState(null, "", `/docs/example${hash}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    expect(destination).not.toHaveAttribute("data-contents-selected");
  },
);

it("selects only the actual URL, independently of reading and prevented prospective clicks", async () => {
  const destination = node.firstElementChild!;
  const next = document.createElement("a");
  next.href = "#next";
  node.append(next);
  history.replaceState(null, "", "#last");
  window.dispatchEvent(new HashChangeEvent("hashchange"));
  destination.removeAttribute("aria-current");
  next.setAttribute("aria-current", "location");
  await Promise.resolve();
  vi.runAllTimers();
  expect(destination).toHaveAttribute("data-contents-selected");
  expect(next).not.toHaveAttribute("data-contents-selected");
  link.href = "#next";
  link.click();
  vi.runAllTimers();
  expect(location.hash).toBe("#last");
  expect(destination).toHaveAttribute("data-contents-selected");
  expect(next).not.toHaveAttribute("data-contents-selected");
  // A router can write the fragment after the click without a native hashchange.
  link.click();
  history.replaceState(null, "", "#next");
  vi.runAllTimers();
  expect(next).toHaveAttribute("data-contents-selected");
  expect(destination).not.toHaveAttribute("data-contents-selected");
  link.href = "/docs/example";
  link.click();
  history.replaceState(null, "", "/docs/example");
  vi.runAllTimers();
  expect(node.querySelector("[data-contents-selected]")).toBeNull();
});

it("cancels pending selection work and stops observing URL changes on cleanup", () => {
  history.replaceState(null, "", "#last");
  window.dispatchEvent(new HashChangeEvent("hashchange"));
  const destination = node.firstElementChild!;
  link.click();
  disconnect();
  history.replaceState(null, "", "/docs/example");
  window.dispatchEvent(new HashChangeEvent("hashchange"));
  vi.runAllTimers();
  expect(destination).toHaveAttribute("data-contents-selected");
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

it("reveals the restored active section on reload instead of aligning an old fragment", () => {
  disconnect();
  history.replaceState(null, "", "#last");
  vi.spyOn(window, "performance", "get").mockReturnValue({
    getEntriesByType: () => [{ type: "reload" }],
  } as unknown as Performance);
  const target = node.firstElementChild as HTMLAnchorElement;
  target.setAttribute("aria-current", "location");
  vi.spyOn(target, "getBoundingClientRect").mockImplementation(
    () => ({ top: 484 - node.scrollTop, bottom: 524 - node.scrollTop }) as DOMRect,
  );
  const connection = connectRightSidebarLinks(node, navigate);
  disconnect = connection.disconnect;
  connection.revealDestination();
  vi.runAllTimers();
  expect(node.scrollTop).toBe(156);

  document.dispatchEvent(new Event("wheel"));
  node.scrollTop = 0;
  connection.revealDestination();
  expect(node.scrollTop).toBe(0);
  // Back/Forward cache restoration explicitly begins a new destination reveal.
  connection.revealDestination(true);
  expect(node.scrollTop).toBe(156);
});

it("preserves a saved offset when the initial active link is fully visible", () => {
  disconnect();
  const target = node.firstElementChild as HTMLAnchorElement;
  target.setAttribute("aria-current", "location");
  vi.spyOn(target, "getBoundingClientRect").mockReturnValue({ top: 100, bottom: 140 } as DOMRect);
  node.scrollTop = 120;
  const connection = connectRightSidebarLinks(node, navigate);
  disconnect = connection.disconnect;
  connection.revealDestination();
  expect(node.scrollTop).toBe(120);
  expect(navigate).not.toHaveBeenCalled();
});

it("checks late active headings against the saved offset rather than an intermediate reveal", async () => {
  disconnect();
  const first = node.firstElementChild as HTMLAnchorElement;
  first.setAttribute("aria-current", "location");
  vi.spyOn(first, "getBoundingClientRect").mockImplementation(
    () => ({ top: 484 - node.scrollTop, bottom: 524 - node.scrollTop }) as DOMRect,
  );
  const next = document.createElement("a");
  next.href = "#next";
  node.append(next);
  vi.spyOn(next, "getBoundingClientRect").mockImplementation(
    () => ({ top: 260 - node.scrollTop, bottom: 300 - node.scrollTop }) as DOMRect,
  );
  const connection = connectRightSidebarLinks(node, navigate, 120);
  disconnect = connection.disconnect;
  connection.revealDestination();
  expect(node.scrollTop).toBe(156);
  first.removeAttribute("aria-current");
  next.setAttribute("aria-current", "location");
  await Promise.resolve();
  vi.runAllTimers();
  expect(node.scrollTop).toBe(120);
});

it("waits for reload restoration and its heading tracker before revealing a destination", () => {
  disconnect();
  history.replaceState({ ppScrollY: 900 }, "");
  vi.spyOn(window, "performance", "get").mockReturnValue({
    getEntriesByType: () => [{ type: "reload" }],
  } as unknown as Performance);
  vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(5000);
  const target = node.firstElementChild as HTMLAnchorElement;
  target.setAttribute("aria-current", "location");
  const bounds = vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
    top: -50,
    bottom: -10,
  } as DOMRect);
  node.scrollTop = 120;
  const connection = connectRightSidebarLinks(node, navigate);
  disconnect = connection.disconnect;
  connection.revealDestination();
  expect(node.scrollTop).toBe(120);
  expect(navigate).not.toHaveBeenCalled();
  vi.spyOn(window, "scrollY", "get").mockReturnValue(900);
  window.dispatchEvent(new Event("scroll"));
  // The tracker updates during the first frame; reveal follows it on the next frame.
  requestAnimationFrame(() => bounds.mockReturnValue({ top: 100, bottom: 140 } as DOMRect));
  vi.runAllTimers();
  expect(node.scrollTop).toBe(120);
  expect(navigate).not.toHaveBeenCalled();
});

it("follows restored reading when hydration captured an intermediate history position", () => {
  disconnect();
  history.replaceState({ ppScrollY: 6900 }, "");
  vi.spyOn(window, "performance", "get").mockReturnValue({
    getEntriesByType: () => [{ type: "reload" }],
  } as unknown as Performance);
  vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(30000);
  let articleTop = 0;
  vi.spyOn(window, "scrollY", "get").mockImplementation(() => articleTop);
  const target = node.firstElementChild as HTMLAnchorElement;
  target.setAttribute("aria-current", "location");
  vi.spyOn(target, "getBoundingClientRect").mockImplementation(
    () => ({ top: 900 - node.scrollTop, bottom: 940 - node.scrollTop }) as DOMRect,
  );
  node.scrollTop = 120;
  const connection = connectRightSidebarLinks(node, navigate);
  disconnect = connection.disconnect;
  connection.revealDestination();
  expect(node.scrollTop).toBe(120);
  expect(navigate).not.toHaveBeenCalled();
  // The real reload restoration moves farther than the temporary saved position.
  // Its heading tracker is authoritative even before the debounced history write.
  articleTop = 16000;
  window.dispatchEvent(new Event("scroll"));
  vi.runAllTimers();
  expect(history.state.ppScrollY).toBe(6900);
  expect(node.scrollTop).toBe(572);
  expect(navigate).toHaveBeenCalledOnce();
});

it("reveals already-restored reading when its listener mounts after the article scroll", () => {
  disconnect();
  history.replaceState({ ppScrollY: 6900 }, "");
  vi.spyOn(window, "performance", "get").mockReturnValue({
    getEntriesByType: () => [{ type: "reload" }],
  } as unknown as Performance);
  vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(30000);
  vi.spyOn(window, "scrollY", "get").mockReturnValue(16000);
  const target = node.firstElementChild as HTMLAnchorElement;
  target.setAttribute("aria-current", "location");
  vi.spyOn(target, "getBoundingClientRect").mockImplementation(
    () => ({ top: 900 - node.scrollTop, bottom: 940 - node.scrollTop }) as DOMRect,
  );
  node.scrollTop = 120;
  const connection = connectRightSidebarLinks(node, navigate);
  disconnect = connection.disconnect;
  connection.revealDestination();
  expect(history.state.ppScrollY).toBe(6900);
  expect(node.scrollTop).toBe(572);
  expect(navigate).toHaveBeenCalledOnce();
});

it("reveals an unchanged active link after page-ready makes the pane visible", async () => {
  disconnect();
  const target = node.firstElementChild as HTMLAnchorElement;
  target.setAttribute("aria-current", "location");
  vi.spyOn(target, "getBoundingClientRect").mockImplementation(
    () => ({ top: 1500 - node.scrollTop, bottom: 1540 - node.scrollTop }) as DOMRect,
  );
  vi.spyOn(node, "getBoundingClientRect").mockReturnValue({ top: 1500 } as DOMRect);
  node.style.visibility = "hidden";
  node.scrollTop = 120;
  const pageScroll = vi.spyOn(window, "scrollTo");
  const connection = connectRightSidebarLinks(node, navigate);
  disconnect = connection.disconnect;
  connection.revealDestination();
  expect(node.scrollTop).toBe(120);
  expect(navigate).not.toHaveBeenCalled();
  node.style.visibility = "visible";
  document.documentElement.classList.add("pp-ready");
  await Promise.resolve();
  vi.runAllTimers();
  expect(node.scrollTop).toBe(0);
  expect(navigate).toHaveBeenCalledOnce();
  expect(pageScroll).not.toHaveBeenCalled();
  // Page chrome no longer participates after the first visible reveal.
  node.scrollTop = 120;
  document.documentElement.classList.add("dark");
  await Promise.resolve();
  vi.runAllTimers();
  expect(node.scrollTop).toBe(120);
  document.documentElement.classList.remove("pp-ready", "dark");
});

it("retries an initial fragment when its scroll container becomes visible", () => {
  disconnect();
  history.replaceState(null, "", "#last");
  Object.defineProperty(node, "clientHeight", { value: 0, configurable: true });
  const connection = connectRightSidebarLinks(node, navigate);
  disconnect = connection.disconnect;
  vi.runAllTimers();
  expect(node.scrollTop).toBe(0);
  Object.defineProperty(node, "clientHeight", { value: 300, configurable: true });
  connection.revealDestination();
  expect(node.scrollTop).toBe(400);
});

it("prepares a contents pane below the viewport without scrolling the article", () => {
  disconnect();
  const target = node.firstElementChild as HTMLAnchorElement;
  target.setAttribute("aria-current", "location");
  node.scrollTop = 120;
  vi.spyOn(node, "getBoundingClientRect").mockReturnValue({ top: 1500 } as DOMRect);
  vi.spyOn(target, "getBoundingClientRect").mockImplementation(
    () => ({ top: 1500 - node.scrollTop, bottom: 1540 - node.scrollTop }) as DOMRect,
  );
  const pageScroll = vi.spyOn(window, "scrollTo");
  const connection = connectRightSidebarLinks(node, navigate);
  disconnect = connection.disconnect;
  connection.revealDestination();
  expect(node.scrollTop).toBe(0);
  expect(pageScroll).not.toHaveBeenCalled();
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

it("reveals an initial active destination, then leaves visible reading links in place", async () => {
  const target = node.firstElementChild as HTMLAnchorElement;
  vi.spyOn(target, "getBoundingClientRect").mockImplementation(
    () => ({ top: 484 - node.scrollTop, bottom: 524 - node.scrollTop }) as DOMRect,
  );
  target.setAttribute("aria-current", "location");
  await Promise.resolve();
  vi.runAllTimers();
  expect(node.scrollTop).toBe(156);
  navigate.mockClear();
  document.dispatchEvent(new Event("wheel"));
  node.scrollTop = 0;
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
