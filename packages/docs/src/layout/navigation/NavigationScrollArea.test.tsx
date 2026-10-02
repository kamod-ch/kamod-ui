/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render, screen } from "@testing-library/preact";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { NavigationScrollArea, useNavigationGroup } from "./NavigationScrollArea";

const key = (mode = "desktop") => `kamod:navigation:/:${mode}`;
function Group() {
  const { open, onOpenChange } = useNavigationGroup("components", true);
  return (
    <button
      data-navigation-group="components"
      aria-expanded={open}
      onClick={() => onOpenChange?.(!open)}
    >
      Components
    </button>
  );
}
function mount(mode: "desktop" | "mobile" = "desktop") {
  return render(
    <NavigationScrollArea mode={mode} class="scroll">
      <Group />
    </NavigationScrollArea>,
  );
}
let visible = true;
let resize: ResizeObserverCallback;
const disconnect = vi.fn();
beforeEach(() => {
  sessionStorage.clear();
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
