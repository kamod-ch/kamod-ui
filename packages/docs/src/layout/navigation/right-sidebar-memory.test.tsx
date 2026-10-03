/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render } from "@testing-library/preact";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { useRightSidebarPageMemory, useRightSidebarScroll } from "./right-sidebar-memory";

const key = "kamod:right-sidebar:/";
const saved = () => JSON.parse(sessionStorage.getItem(key)!);
let visible = true;
let resize: ResizeObserverCallback;
const disconnect = vi.fn();
function Page({ path, sidebar = true }: { path: string; sidebar?: boolean }) {
  useRightSidebarPageMemory(path);
  const ref = useRightSidebarScroll<HTMLDivElement>("contents", sidebar);
  return sidebar ? (
    <div ref={ref} data-testid="contents">
      <div>Sections</div>
    </div>
  ) : (
    <main>Another page</main>
  );
}
function mount(path = "/blocks/styles", sidebar = true) {
  history.replaceState(null, "", path);
  return render(<Page path={path} sidebar={sidebar} />);
}
function scroll(node: HTMLElement, top: number) {
  fireEvent.wheel(node);
  node.scrollTop = top;
  fireEvent.scroll(node);
}
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
  history.replaceState(null, "", "/");
});

it("restores a same-page remount, ignoring hashes and trailing slashes", () => {
  const first = mount();
  scroll(first.getByTestId("contents"), 210);
  first.unmount();
  const second = mount("/blocks/styles/#usage");
  expect(second.getByTestId("contents").scrollTop).toBe(210);
});

it("forgets the previous page even when the intervening page has no sidebar", () => {
  const view = mount();
  scroll(view.getByTestId("contents"), 230);
  fireEvent(window, new Event("pagehide"));
  history.replaceState(null, "", "/blocks/sidebar");
  view.rerender(<Page path="/blocks/sidebar" sidebar={false} />);
  expect(saved()).toEqual({ page: "/blocks/sidebar", offsets: {} });
  history.replaceState(null, "", "/blocks/styles");
  view.rerender(<Page path="/blocks/styles" />);
  expect(view.getByTestId("contents").scrollTop).toBe(0);
});

it("flushes on pagehide and clears a stale DOM restored by Back/Forward", () => {
  const view = mount();
  const node = view.getByTestId("contents");
  scroll(node, 180);
  fireEvent(window, new Event("pagehide"));
  expect(saved().offsets.contents).toBe(180);
  sessionStorage.setItem(
    key,
    JSON.stringify({ page: "/blocks/theming", offsets: { contents: 320 } }),
  );
  fireEvent(window, new PageTransitionEvent("pageshow", { persisted: true }));
  expect(node.scrollTop).toBe(0);
  expect(saved().page).toBe("/blocks/styles");
});

it("waits for a hidden sidebar to become visible and releases observers on unmount", async () => {
  sessionStorage.setItem(
    key,
    JSON.stringify({ page: "/blocks/styles", offsets: { contents: 190 } }),
  );
  visible = false;
  const view = mount();
  fireEvent(window, new Event("pagehide"));
  expect(saved().offsets.contents).toBe(190);
  visible = true;
  act(() => resize([], {} as ResizeObserver));
  await vi.waitFor(() => expect(view.getByTestId("contents").scrollTop).toBe(190));
  const remove = vi.spyOn(window, "removeEventListener");
  view.unmount();
  expect(disconnect).toHaveBeenCalledOnce();
  expect(remove).toHaveBeenCalledWith("pagehide", expect.any(Function));
  expect(remove).toHaveBeenCalledWith("pageshow", expect.any(Function));
});

it.each([
  "invalid",
  '{"page":"/blocks/styles","offsets":{"contents":-1}}',
  '{"page":"/blocks/styles","offsets":{"contents":"200"}}',
])("ignores invalid memory: %s", (value) => {
  sessionStorage.setItem(key, value);
  const view = mount();
  expect(view.getByTestId("contents").scrollTop).toBe(0);
});

it("keeps scrolling usable when session storage is unavailable", () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  const view = mount();
  scroll(view.getByTestId("contents"), 90);
  fireEvent(window, new Event("pagehide"));
  expect(view.getByTestId("contents").scrollTop).toBe(90);
});

it("ignores embedded previews that share the parent tab's session storage", () => {
  const parent = { page: "/blocks/styles", offsets: { contents: 180 } };
  sessionStorage.setItem(key, JSON.stringify(parent));
  vi.spyOn(window, "self", "get").mockReturnValue({} as Window & typeof globalThis);
  const view = mount("/component-preview");
  scroll(view.getByTestId("contents"), 90);
  fireEvent(window, new Event("pagehide"));
  expect(saved()).toEqual(parent);
});

it("does not undo an early user scroll when the initial pageshow arrives", () => {
  const view = mount();
  const node = view.getByTestId("contents");
  scroll(node, 180);
  fireEvent(window, new PageTransitionEvent("pageshow", { persisted: false }));
  expect(node.scrollTop).toBe(180);
  fireEvent(window, new Event("pagehide"));
  expect(saved().offsets.contents).toBe(180);
});
