/** @vitest-environment jsdom */
import { act, cleanup, render } from "@testing-library/preact";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { BlockGuideContents } from "./BlockGuideContents";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  act(() => {
    vi.runOnlyPendingTimers();
  });
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  history.replaceState(null, "", "/");
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

it("links a special page’s main title and restores its heading target", () => {
  vi.stubGlobal("matchMedia", () => ({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  const title = "From a Block Preview to Your Application";
  const view = render(
    <>
      <h1 id="page-title">{title}</h1>
      <BlockGuideContents id="guide-contents" pageTitle={title} sections={[]} />
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
});

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
  expect(view.getByLabelText("3 main links").textContent).toBe("3");
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
  expect(view.getByLabelText("2 main links")).toHaveTextContent("2");
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
