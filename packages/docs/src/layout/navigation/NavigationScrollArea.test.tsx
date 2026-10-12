/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render, screen } from "@testing-library/preact";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { NavigationScrollArea, useNavigationGroup } from "./NavigationScrollArea";

const key = (mode = "desktop") => `kamod:navigation:/:${mode}`;
function Group({
  withLink = false,
  id = "components",
  current = true,
}: {
  withLink?: boolean;
  id?: string;
  current?: boolean;
}) {
  const { open, onOpenChange } = useNavigationGroup(id, current);
  return (
    <>
      <button
        data-current={current || undefined}
        data-navigation-group={id}
        aria-expanded={open}
        onClick={() => onOpenChange?.(!open)}
      >
        {id === "components" ? "Components" : "Packages"}
      </button>
      {withLink && open && (
        <a
          href={
            id === "components" ? "/docs/button/installation" : "/docs/hooks-package/installation"
          }
          class="site-navigation-link"
          aria-current={current ? "page" : undefined}
        >
          Button
        </a>
      )}
    </>
  );
}
function mount(mode: "desktop" | "mobile" = "desktop", withLink = false) {
  return render(
    <NavigationScrollArea mode={mode} pathname={location.pathname} class="scroll">
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

it("restores scroll and reopens the current desktop group, with independent mobile memory", () => {
  const first = mount();
  const node = first.container.querySelector(".scroll")!;
  fireEvent.wheel(node);
  node.scrollTop = 240;
  fireEvent.scroll(node);
  fireEvent.click(screen.getByRole("button", { name: "Components" }));
  first.unmount();
  const second = mount();
  expect(second.container.querySelector(".scroll")!.scrollTop).toBe(240);
  expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
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
    page: "/",
  });
  view.unmount();
  expect(disconnect).toHaveBeenCalledOnce();
  expect(remove).toHaveBeenCalledWith("pagehide", expect.any(Function));
  expect(remove).toHaveBeenCalledWith("pageshow", expect.any(Function));
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

function mockDestination(linkTop = 600) {
  vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockImplementation(function (
    this: HTMLElement,
  ) {
    return 700 + (parseFloat(this.style.getPropertyValue("--navigation-trailing-space")) || 0);
  });
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    const area = this.closest<HTMLElement>(".scroll");
    const top = this.tagName === "A" ? linkTop - (area?.scrollTop ?? 0) : 0;
    const height = this.tagName === "A" ? 32 : 300;
    return { top, bottom: top + height, height } as DOMRect;
  });
}

it.each([
  { direction: "below", linkTop: 600, savedTop: 60, expectedTop: 332 },
  { direction: "above", linkTop: 100, savedTop: 240, expectedTop: 100 },
  { direction: "inside", linkTop: 300, savedTop: 120, expectedTop: 120 },
])(
  "reveals a desktop destination $direction the viewport and reopens its saved collapsed group",
  async ({ linkTop, savedTop, expectedTop }) => {
    mockDestination(linkTop);
    sessionStorage.setItem(
      key(),
      JSON.stringify({ top: savedTop, groups: { components: false, packages: false } }),
    );
    const view = mount("desktop", true);
    const area = view.container.querySelector<HTMLElement>(".scroll")!;
    await vi.waitFor(() => expect(area.scrollTop).toBe(expectedTop));
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
    view.unmount();
    expect(JSON.parse(sessionStorage.getItem(key())!).groups).toEqual({
      components: true,
      packages: false,
    });
  },
);

it("reveals a first desktop destination inside the padded viewport without extra trailing space", () => {
  mockDestination();
  const view = mount("desktop", true);
  const area = view.container.querySelector<HTMLElement>(".scroll")!;
  area.style.padding = "10px 0 15px";
  // Font or disclosure layout may settle after the first synchronous restoration.
  act(() => resize([], {} as ResizeObserver));
  return vi.waitFor(() => {
    expect(area.scrollTop).toBe(347);
    expect(area.style.getPropertyValue("--navigation-trailing-space")).toBe("");
  });
});

it("does not follow desktop layout changes after the reader scrolls", async () => {
  mockDestination();
  const view = mount("desktop", true);
  const area = view.container.querySelector<HTMLElement>(".scroll")!;
  expect(area.scrollTop).toBe(332);
  fireEvent.wheel(area);
  area.scrollTop = 0;
  act(() => resize([], {} as ResizeObserver));
  await new Promise((resolve) => requestAnimationFrame(resolve));
  expect(area.scrollTop).toBe(0);
});

it("reveals cached SPA route changes without remounting the scroll area or losing outgoing choices", async () => {
  mockDestination();
  sessionStorage.setItem(
    key(),
    JSON.stringify({ top: 0, groups: { components: true, packages: false } }),
  );
  const navigation = (pathname: string, packagesCurrent = false) => (
    <NavigationScrollArea mode="desktop" pathname={pathname} class="scroll">
      <Group current={!packagesCurrent} withLink />
      <Group id="packages" current={packagesCurrent} withLink />
    </NavigationScrollArea>
  );
  const view = render(navigation("/docs/button/installation"));
  const area = view.container.querySelector<HTMLElement>(".scroll")!;
  fireEvent.wheel(area);
  area.scrollTop = 0;
  fireEvent.click(screen.getByRole("button", { name: "Components" }));
  const save = vi.spyOn(Storage.prototype, "setItem");
  view.rerender(navigation("/docs/hooks-package/installation", true));
  await vi.waitFor(() => expect(area.scrollTop).toBe(332));
  expect(view.container.querySelector(".scroll")).toBe(area);
  expect(screen.getByRole("button", { name: "Packages" })).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("button", { name: "Components" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  // The outgoing effect flushes its offset/disclosures before incoming restoration reads them.
  expect(JSON.parse(sessionStorage.getItem(key())!).top).toBe(0);
  expect(JSON.parse(sessionStorage.getItem(key())!).groups.components).toBe(false);
  expect(JSON.parse(save.mock.calls[0][1])).toMatchObject({
    page: "/docs/button/installation",
    top: 0,
    groups: { components: false, packages: false },
  });
  expect(JSON.parse(sessionStorage.getItem(key())!).page).toBe("/docs/hooks-package/installation");
  expect(disconnect).toHaveBeenCalledOnce();
});

it("treats trailing-slash-only route updates as the same destination", () => {
  mockDestination();
  const navigation = (pathname: string) => (
    <NavigationScrollArea mode="desktop" pathname={pathname} class="scroll">
      <Group withLink />
    </NavigationScrollArea>
  );
  const view = render(navigation("/docs/button/installation"));
  const area = view.container.querySelector<HTMLElement>(".scroll")!;
  fireEvent.wheel(area);
  area.scrollTop = 0;
  fireEvent.click(screen.getByRole("button"));
  view.rerender(navigation("/docs/button/installation///"));
  expect(area.scrollTop).toBe(0);
  expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
  expect(disconnect).not.toHaveBeenCalled();
});

it("reveals a desktop destination again on bfcache return but ignores ordinary pageshow", async () => {
  mockDestination();
  const view = mount("desktop", true);
  const area = view.container.querySelector<HTMLElement>(".scroll")!;
  fireEvent.wheel(area);
  area.scrollTop = 0;
  fireEvent.click(screen.getByRole("button"));
  fireEvent(window, new PageTransitionEvent("pageshow", { persisted: false }));
  expect(area.scrollTop).toBe(0);
  expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
  fireEvent(window, new PageTransitionEvent("pageshow", { persisted: true }));
  await vi.waitFor(() => expect(area.scrollTop).toBe(332));
  expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
});

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
