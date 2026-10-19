/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render } from "@testing-library/preact";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { BlockGuideContents } from "./BlockGuideContents";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  // Preact 11 schedules effect work with both RAF and a fallback timeout. Drain
  // that timeout before jsdom removes cancelAnimationFrame during teardown.
  act(() => {
    vi.runAllTimers();
  });
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  history.replaceState(null, "", "/");
});

function mountInitialFragment(
  type = "navigate",
  fromDifferentPage = false,
  hash = "#usage",
  entry?: PerformanceNavigationTiming,
  path = "/docs/guide",
) {
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
  history.replaceState({ ppScrollY: 1200 }, "", `${path}${hash}`);
  const navigation = entry ?? {
    type,
    name: new URL(fromDifferentPage ? "/previous" : path, location.href).href,
  };
  vi.stubGlobal("performance", {
    now: () => 0,
    getEntriesByType: () => [navigation],
  });
  const view = render(
    <>
      <h2 id="usage">Usage</h2>
      <BlockGuideContents id="guide-contents" sections={[{ id: "usage", label: "Usage" }]} />
    </>,
  );
  const scroll = vi.fn();
  document.getElementById("usage")!.scrollIntoView = scroll;
  document.getElementById("usage")!.getClientRects = () =>
    [new DOMRect(0, 500, 100, 20)] as unknown as DOMRectList;
  return { view, scroll };
}

it("restores an initial fragment once its lazy guide headings have mounted", () => {
  const { scroll } = mountInitialFragment();
  expect(scroll).not.toHaveBeenCalled();
  act(() => {
    vi.advanceTimersByTime(40);
  });
  expect(scroll).toHaveBeenCalledExactlyOnceWith({ block: "start", behavior: "instant" });
  act(() => {
    vi.advanceTimersByTime(100);
  });
  expect(scroll).toHaveBeenCalledOnce();
});

it("restores initial #top after the guide mounts without requiring an element named top", () => {
  const scrollTop = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  const { scroll } = mountInitialFragment("navigate", false, "#top");
  expect(document.getElementById("top")).toBeNull();
  act(() => {
    vi.advanceTimersByTime(40);
  });
  expect(scrollTop).toHaveBeenCalledExactlyOnceWith({ top: 0, behavior: "instant" });
  expect(scroll).not.toHaveBeenCalled();
});

it("follows a real subsection fragment even when it is not listed in the contents metadata", () => {
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
  history.replaceState(null, "", "/docs/guide#usage-details");
  const view = render(
    <>
      <h2 id="usage">Usage</h2>
      <h4 id="usage-details">Details</h4>
      <BlockGuideContents id="guide-contents" sections={[{ id: "usage", label: "Usage" }]} />
    </>,
  );
  const target = document.getElementById("usage-details")!;
  target.getClientRects = () => [new DOMRect(0, 500, 100, 20)] as unknown as DOMRectList;
  const scroll = vi.fn();
  target.scrollIntoView = scroll;
  expect(view.queryByRole("link", { name: "Details", exact: true })).toBeNull();
  act(() => {
    vi.advanceTimersByTime(40);
  });
  expect(scroll).toHaveBeenCalledExactlyOnceWith({ block: "start", behavior: "instant" });
});

it("follows the revealed heading when hydration replaces the original SSR node", () => {
  const { scroll: originalScroll } = mountInitialFragment();
  const replacement = document.createElement("h2");
  replacement.id = "usage";
  replacement.textContent = "Revealed usage";
  replacement.getClientRects = () => [new DOMRect(0, 500, 100, 20)] as unknown as DOMRectList;
  const revealedScroll = vi.fn();
  replacement.scrollIntoView = revealedScroll;
  document.getElementById("usage")!.replaceWith(replacement);
  act(() => {
    vi.advanceTimersByTime(40);
  });
  expect(revealedScroll).toHaveBeenCalledExactlyOnceWith({ block: "start", behavior: "instant" });
  expect(originalScroll).not.toHaveBeenCalled();
});

it.each(["reload", "back_forward"])(
  "preserves the saved reading position on %s instead of re-following an old fragment",
  (type) => {
    const { scroll } = mountInitialFragment(type);
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(scroll).not.toHaveBeenCalled();
  },
);

it("still follows a new SPA document after an earlier page was reloaded", () => {
  const { scroll } = mountInitialFragment("reload", true);
  act(() => {
    vi.advanceTimersByTime(40);
  });
  expect(scroll).toHaveBeenCalledOnce();
});

it("treats reload A followed by SPA B and a fresh return to A as separate anchor requests", () => {
  const entry = {
    type: "reload",
    name: new URL("/docs/guide", location.href).href,
  } as unknown as PerformanceNavigationTiming;
  const reloaded = mountInitialFragment("reload", false, "#usage", entry);
  act(() => {
    vi.advanceTimersByTime(40);
  });
  expect(reloaded.scroll).not.toHaveBeenCalled();
  reloaded.view.unmount();
  const second = mountInitialFragment("reload", false, "#usage", entry, "/docs/other");
  act(() => {
    vi.advanceTimersByTime(40);
  });
  expect(second.scroll).toHaveBeenCalledOnce();
  second.view.unmount();
  const returned = mountInitialFragment("reload", false, "#usage", entry);
  act(() => {
    vi.advanceTimersByTime(40);
  });
  expect(returned.scroll).toHaveBeenCalledOnce();
});

it("consumes an old reload entry even when the first contents mount belongs to another route", () => {
  const entry = {
    type: "reload",
    name: new URL("/docs/guide", location.href).href,
  } as unknown as PerformanceNavigationTiming;
  const second = mountInitialFragment("reload", false, "#usage", entry, "/docs/other");
  act(() => {
    vi.advanceTimersByTime(40);
  });
  expect(second.scroll).toHaveBeenCalledOnce();
  second.view.unmount();
  const returned = mountInitialFragment("reload", false, "#usage", entry);
  act(() => {
    vi.advanceTimersByTime(40);
  });
  expect(returned.scroll).toHaveBeenCalledOnce();
});

it("refreshes detached heading nodes for both active reading and later hash navigation", () => {
  vi.stubGlobal("matchMedia", () => ({
    matches: true,
    addEventListener() {},
    removeEventListener() {},
  }));
  vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(10000);
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    return new DOMRect(0, this.id === "usage" ? 0 : 1500, 100, 20);
  });
  const view = render(
    <>
      <h2 id="usage">Usage</h2>
      <h2 id="later">Later</h2>
      <BlockGuideContents
        id="guide-contents"
        sections={[
          { id: "usage", label: "Usage" },
          { id: "later", label: "Later" },
        ]}
      />
    </>,
  );
  expect(view.getByRole("link", { name: "Usage", exact: true })).toHaveAttribute(
    "aria-current",
    "location",
  );
  const original = document.getElementById("usage")!;
  const originalScroll = vi.fn();
  original.scrollIntoView = originalScroll;
  const replacement = document.createElement("h2");
  replacement.id = "usage";
  replacement.getBoundingClientRect = () => new DOMRect(0, 700, 100, 20);
  const revealedScroll = vi.fn();
  replacement.scrollIntoView = revealedScroll;
  original.replaceWith(replacement);
  fireEvent(window, new Event("scroll"));
  act(() => {
    vi.advanceTimersByTime(40);
  });
  expect(view.getByRole("link", { name: "Overview", exact: true })).toHaveAttribute(
    "aria-current",
    "location",
  );
  act(() => {
    history.replaceState(null, "", "#usage");
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });
  expect(revealedScroll).toHaveBeenCalledExactlyOnceWith({ block: "start", behavior: "instant" });
  expect(originalScroll).not.toHaveBeenCalled();
});

it("initializes reading after a visibility-only page reveal without scrolling the article", () => {
  vi.stubGlobal("matchMedia", () => ({
    matches: true,
    addEventListener() {},
    removeEventListener() {},
  }));
  const mutations: MutationCallback[] = [];
  vi.stubGlobal(
    "MutationObserver",
    class {
      constructor(callback: MutationCallback) {
        mutations.push(callback);
      }
      observe() {}
      disconnect() {}
    },
  );
  vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(10000);
  vi.spyOn(HTMLElement.prototype, "getClientRects").mockReturnValue([
    new DOMRect(0, 0, 100, 20),
  ] as unknown as DOMRectList);
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    return new DOMRect(0, this.id === "later" ? 1000 : 0, 100, 20);
  });
  const scroll = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  const view = render(
    <>
      <h2 id="usage" style={{ visibility: "hidden" }}>
        Usage
      </h2>
      <h2 id="later" style={{ visibility: "hidden" }}>
        Later
      </h2>
      <BlockGuideContents
        id="guide-contents"
        sections={[
          { id: "usage", label: "Usage" },
          { id: "later", label: "Later" },
        ]}
      />
    </>,
  );
  act(() => {
    vi.advanceTimersByTime(40);
  });
  expect(view.getByRole("link", { name: "Overview", exact: true })).toHaveAttribute(
    "aria-current",
    "location",
  );
  act(() => {
    document.getElementById("usage")!.style.visibility = "visible";
    document.getElementById("later")!.style.visibility = "visible";
    for (const notify of mutations) notify([], {} as MutationObserver);
    vi.advanceTimersByTime(40);
  });
  expect(view.getByRole("link", { name: "Usage", exact: true })).toHaveAttribute(
    "aria-current",
    "location",
  );
  expect(scroll).not.toHaveBeenCalled();
});

it.each(["wheel", "touchstart", "pointerdown", "keydown"])(
  "yields pending initial fragment navigation to %s intent",
  (event) => {
    const { scroll } = mountInitialFragment();
    fireEvent(window, new Event(event));
    act(() => {
      vi.advanceTimersByTime(40);
    });
    expect(scroll).not.toHaveBeenCalled();
  },
);

it("cannot scroll a changed route or an unmounted guide from a pending initial fragment", () => {
  const first = mountInitialFragment();
  history.replaceState(null, "", "/docs/other#usage");
  act(() => {
    vi.advanceTimersByTime(40);
  });
  expect(first.scroll).not.toHaveBeenCalled();
  first.view.unmount();
  const second = mountInitialFragment();
  second.view.unmount();
  act(() => {
    vi.advanceTimersByTime(40);
  });
  expect(second.scroll).not.toHaveBeenCalled();
});

it("preserves mobile history restoration for block details with only a desktop contents list", () => {
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  render(
    <>
      <h2 id="usage">Usage</h2>
      <BlockGuideContents
        id="block-contents"
        block={{ id: "example", title: "Example block" }}
        sections={[{ id: "usage", label: "Usage" }]}
      />
    </>,
  );
  const scroll = vi.fn();
  document.getElementById("usage")!.scrollIntoView = scroll;
  act(() => {
    history.replaceState(null, "", "#usage");
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });
  expect(scroll).toHaveBeenCalledOnce();
});

it("restores hashes at desktop and mobile widths and cleans up queued work on unmount", () => {
  let desktop = true;
  const media = new EventTarget();
  const removeMedia = vi.spyOn(media, "removeEventListener");
  vi.stubGlobal("matchMedia", () => ({
    get matches() {
      return desktop;
    },
    addEventListener: media.addEventListener.bind(media),
    removeEventListener: media.removeEventListener.bind(media),
  }));
  const scroll = vi.fn();
  const frames = new Map<number, FrameRequestCallback>();
  let sequence = 0;
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    frames.set(++sequence, callback);
    return sequence;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => frames.delete(id));
  const removeWindow = vi.spyOn(window, "removeEventListener");
  const sections = [{ id: "usage", label: "Usage" }];
  const view = render(
    <>
      <h2 id="usage">Usage</h2>
      <BlockGuideContents id="desktop-contents" sections={sections} />
    </>,
  );
  document.getElementById("usage")!.scrollIntoView = scroll;
  const navigate = () => {
    history.replaceState(null, "", "#usage");
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };
  act(navigate);
  expect(scroll).toHaveBeenCalledTimes(1);
  // Heading navigation and contents-link alignment each schedule one frame.
  expect(frames.size).toBe(2);
  act(() => {
    desktop = false;
    media.dispatchEvent(new Event("change"));
    navigate();
  });
  expect(scroll).toHaveBeenCalledTimes(2);
  act(() => {
    view.unmount();
  });
  expect(frames.size).toBe(0);
  expect(removeMedia).toHaveBeenCalledTimes(1);
  for (const event of ["scroll", "resize", "hashchange"]) {
    expect(removeWindow).toHaveBeenCalledWith(event, expect.any(Function));
  }
});

it.each([undefined, { id: "example", title: "Example Block" }])(
  "links a page's main title and restores its heading target with block %o",
  (block) => {
    vi.stubGlobal("matchMedia", () => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    const title = "From a Block Preview to Your Application";
    const view = render(
      <>
        <h1 id="page-title">{title}</h1>
        <BlockGuideContents id="guide-contents" block={block} pageTitle={title} sections={[]} />
      </>,
    );
    const scroll = vi.fn();
    document.getElementById("page-title")!.scrollIntoView = scroll;
    expect(
      view
        .getByRole("link", { name: "From a Block Preview to Your Application" })
        .getAttribute("href"),
    ).toBe("#page-title");
    act(() => {
      history.replaceState(null, "", "#page-title");
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    expect(scroll).toHaveBeenCalledOnce();
  },
);

it("reuses anchor style offsets while scrolling and refreshes them after resizing", () => {
  vi.stubGlobal("matchMedia", () => ({
    matches: true,
    addEventListener() {},
    removeEventListener() {},
  }));
  const styles = vi.spyOn(window, "getComputedStyle");
  let scheduled: FrameRequestCallback | undefined;
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    scheduled = callback;
    return 1;
  });
  render(
    <>
      <h2 id="usage">Usage</h2>
      <BlockGuideContents id="contents" sections={[{ id: "usage", label: "Usage" }]} />
    </>,
  );
  const initial = styles.mock.calls.length;
  const dispatch = (event: string) =>
    act(() => {
      window.dispatchEvent(new Event(event));
      scheduled?.(0);
    });
  dispatch("scroll");
  dispatch("scroll");
  expect(styles).toHaveBeenCalledTimes(initial);
  dispatch("resize");
  expect(styles.mock.calls.length).toBeGreaterThan(initial);
});

it("counts only main links and links the heading to the current document without its hash", () => {
  vi.stubGlobal("matchMedia", () => ({
    matches: true,
    addEventListener() {},
    removeEventListener() {},
  }));
  history.replaceState(null, "", "/docs/forms#usage");
  const view = render(
    <BlockGuideContents
      id="contents"
      overviewChildren={[{ id: "preview", label: "Preview" }]}
      sections={[
        { id: "usage", label: "Usage", children: [{ id: "details", label: "Details" }] },
        { id: "reference", label: "Reference" },
      ]}
    />,
  );
  expect(view.getByLabelText("3 main page sections")).toHaveTextContent("3 Sections");
  const headingLink = view.getByRole("link", { name: "On This Page" }) as HTMLAnchorElement;
  expect(new URL(headingLink.href).pathname).toBe("/docs/forms");
  expect(new URL(headingLink.href).hash).toBe("");
});

it("renders and tracks fourth-level links, including hash restoration", () => {
  vi.stubGlobal("matchMedia", () => ({
    matches: true,
    addEventListener() {},
    removeEventListener() {},
  }));
  vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(10000);
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    return new DOMRect(0, this.id === "later" ? 1000 : 0, 100, 20);
  });
  const view = render(
    <>
      <h2 id="setup">Setup</h2>
      <h3 id="validation">Validation</h3>
      <h4 id="rules">Rules</h4>
      <h5 id="retry">Retry</h5>
      <h3 id="later">Later</h3>
      <BlockGuideContents
        id="contents"
        sections={[
          {
            id: "setup",
            label: "Setup",
            children: [
              {
                id: "validation",
                label: "Validation",
                children: [
                  {
                    id: "rules",
                    label: "Rules",
                    step: 1,
                    children: [{ id: "retry", label: "Retry" }],
                  },
                ],
              },
              { id: "later", label: "Later" },
            ],
          },
        ]}
      />
    </>,
  );
  const retry = view.getByRole("link", { name: "Retry" });
  expect(retry).toHaveAttribute("data-contents-depth", "4");
  expect(retry).toHaveAttribute("aria-current", "location");
  expect(retry.closest("ul")?.parentElement?.querySelector(":scope > a")).toHaveAttribute(
    "href",
    "#rules",
  );
  expect(view.getByRole("link", { name: "1. Rules" })).toHaveAttribute("data-contents-depth", "3");
  expect(view.getByLabelText("2 main page sections")).toHaveTextContent("2 Sections");
  const scroll = vi.fn();
  document.getElementById("retry")!.scrollIntoView = scroll;
  act(() => {
    history.replaceState(null, "", "#retry");
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });
  expect(scroll).toHaveBeenCalledOnce();
});

it("places Live Preview alongside the main guide links and includes it in the total", () => {
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  const { container } = render(
    <BlockGuideContents
      id="preview-contents"
      block={{ id: "example", title: "Example block" }}
      sections={[{ id: "usage", label: "Usage" }]}
    />,
  );
  const links = container.querySelectorAll("nav > ul > li > a");
  expect(Array.from(links, (link) => link.textContent)).toEqual([
    "Overview",
    "Live Preview",
    "Usage",
  ]);
  expect(links[1]).toHaveAttribute("href", "#example");
  expect(container.querySelector(".page-contents-count")).toHaveTextContent("3");
});

it("bounds heading measurements on long guides while following layout changes", () => {
  vi.stubGlobal("matchMedia", () => ({
    matches: true,
    addEventListener() {},
    removeEventListener() {},
  }));
  vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(40000);
  let top = 0;
  let shift = 0;
  vi.spyOn(window, "scrollY", "get").mockImplementation(() => top);
  const rect = vi
    .spyOn(HTMLElement.prototype, "getBoundingClientRect")
    .mockImplementation(function (this: HTMLElement) {
      const index = Number(this.id.replace("section-", ""));
      return new DOMRect(0, 200 + index * 400 + shift - top, 100, 20);
    });
  const sections = Array.from({ length: 128 }, (_, index) => ({
    id: `section-${index}`,
    label: `Section ${index}`,
  }));
  const view = render(
    <>
      {sections.map(({ id, label }) => (
        <h2 key={id} id={id}>
          {label}
        </h2>
      ))}
      <BlockGuideContents id="contents" sections={sections} />
    </>,
  );
  const scroll = () =>
    act(() => {
      window.dispatchEvent(new Event("scroll"));
      vi.advanceTimersByTime(20);
    });
  rect.mockClear();
  top = 20000;
  scroll();
  expect(view.getByRole("link", { name: "Section 49", exact: true })).toHaveAttribute(
    "aria-current",
    "location",
  );
  expect(rect.mock.calls.length).toBeLessThanOrEqual(8);
  // A newly loaded preview above the headings shifts layout without a window resize.
  shift = 800;
  scroll();
  expect(view.getByRole("link", { name: "Section 47", exact: true })).toHaveAttribute(
    "aria-current",
    "location",
  );
});
