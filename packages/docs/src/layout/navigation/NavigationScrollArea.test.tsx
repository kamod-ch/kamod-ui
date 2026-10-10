/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render, screen } from "@testing-library/preact";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { NavigationScrollArea, useNavigationGroup } from "./NavigationScrollArea";

const key = (mode = "desktop") => `kamod:navigation:/:${mode}`;
function Group({ withLink = false }: { withLink?: boolean }) {
  const { open, onOpenChange } = useNavigationGroup("components", true);
  return (
    <>
      <button
        data-current="true"
        data-navigation-group="components"
        aria-expanded={open}
        onClick={() => onOpenChange?.(!open)}
      >
        Components
      </button>
      {withLink && open && (
        <a href="/docs/button/installation" class="site-navigation-link" aria-current="page">
          Button
        </a>
      )}
    </>
  );
}
function mount(mode: "desktop" | "mobile" = "desktop", withLink = false) {
  return render(
    <NavigationScrollArea mode={mode} class="scroll">
      <Group withLink={withLink} />
    </NavigationScrollArea>,
  );
}
let visible = true;
let resize: ResizeObserverCallback;
const disconnect = vi.fn();
beforeEach(() => {
  sessionStorage.clear();
  history.replaceState(null, "", "/");
  visible = true;
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockImplementation(() =>
    visible ? 300 : 0,
  );
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: ResizeObserverCallback) {
        resize = callback;
      }
      observe() {}
      disconnect = disconnect;
    },
  );
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  disconnect.mockClear();
});

it("restores scroll and expansion when remounted, with independent mobile memory", () => {
  const first = mount();
  const node = first.container.querySelector(".scroll")!;
  fireEvent.wheel(node);
  node.scrollTop = 240;
  fireEvent.scroll(node);
  fireEvent.click(screen.getByRole("button", { name: "Components" }));
  first.unmount();
  const second = mount();
  expect(second.container.querySelector(".scroll")!.scrollTop).toBe(240);
  expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
  second.unmount();
  const mobile = mount("mobile");
  expect(mobile.container.querySelector(".scroll")!.scrollTop).toBe(0);
  expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
});

it("flushes the latest position on pagehide and cleans up observers/listeners", () => {
  const remove = vi.spyOn(window, "removeEventListener");
  const view = mount();
  const node = view.container.querySelector(".scroll")!;
  fireEvent.keyDown(node, { key: "PageDown" });
  node.scrollTop = 140;
  fireEvent(window, new Event("pagehide"));
  expect(JSON.parse(sessionStorage.getItem(key())!)).toEqual({
    top: 140,
    groups: { components: true },
  });
  view.unmount();
  expect(disconnect).toHaveBeenCalledOnce();
  expect(remove).toHaveBeenCalledWith("pagehide", expect.any(Function));
});

it("does not overwrite a saved desktop offset while hidden at a mobile breakpoint", async () => {
  sessionStorage.setItem(key(), JSON.stringify({ top: 190, groups: {} }));
  visible = false;
  const view = mount();
  const node = view.container.querySelector(".scroll")!;
  fireEvent.scroll(node);
  expect(JSON.parse(sessionStorage.getItem(key())!).top).toBe(190);
  visible = true;
  act(() => resize([], {} as ResizeObserver));
  await vi.waitFor(() => expect(node.scrollTop).toBe(190));
});

it.each(["invalid json", '{"top":-5}', '{"top":"100"}'])(
  "ignores malformed memory: %s",
  (value) => {
    sessionStorage.setItem(key(), value);
    const view = mount();
    expect(view.container.querySelector(".scroll")!.scrollTop).toBe(0);
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  },
);

it("keeps group controls usable when storage is blocked", () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  mount();
  fireEvent.click(screen.getByRole("button"));
  expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
});

function mockDestination() {
  vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockImplementation(function (
    this: HTMLElement,
  ) {
    return 700 + (parseFloat(this.style.getPropertyValue("--navigation-trailing-space")) || 0);
  });
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    const area = this.closest<HTMLElement>(".scroll");
    return { top: this.tagName === "A" ? 600 - (area?.scrollTop ?? 0) : 0 } as DOMRect;
  });
}

it("opens a new mobile destination and aligns even its final link, then preserves manual scroll", async () => {
  mockDestination();
  history.replaceState(null, "", "/docs/button/installation");
  sessionStorage.setItem(
    key("mobile"),
    JSON.stringify({ page: "/docs/forms", top: 120, groups: { components: false } }),
  );
  const first = mount("mobile", true);
  const area = first.container.querySelector<HTMLElement>(".scroll")!;
  await vi.waitFor(() => expect(area.scrollTop).toBe(600));
  expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  expect(area.style.getPropertyValue("--navigation-trailing-space")).toBe("200px");
  fireEvent.wheel(area);
  area.scrollTop = 90;
  fireEvent.scroll(area);
  first.unmount();
  const second = mount("mobile", true);
  expect(second.container.querySelector(".scroll")!.scrollTop).toBe(90);
});

it("yields to user intent before deferred alignment and ignores modified link clicks", async () => {
  mockDestination();
  const view = mount("mobile", true);
  const area = view.container.querySelector<HTMLElement>(".scroll")!;
  fireEvent.wheel(area);
  area.scrollTop = 80;
  act(() => resize([], {} as ResizeObserver));
  await new Promise((resolve) => requestAnimationFrame(resolve));
  expect(area.scrollTop).toBe(80);
  const link = screen.getByRole("link");
  // Prevent jsdom navigation while still exercising the menu's capture listener.
  link.addEventListener("click", (event) => event.preventDefault());
  fireEvent.click(link, { ctrlKey: true });
  expect(JSON.parse(sessionStorage.getItem(key("mobile"))!).page).toBe("/");
  fireEvent.click(link);
  expect(JSON.parse(sessionStorage.getItem(key("mobile"))!).page).toBe("");
});
