/** @vitest-environment jsdom */
import { act, cleanup, render } from "@testing-library/preact";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { BlockGuideContents } from "./BlockGuideContents";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  // Preact 11 schedules effect work with both RAF and a fallback timeout. Drain
  // that timeout before jsdom removes cancelAnimationFrame during teardown.
  vi.runAllTimers();
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

it("only the visible contents restores hashes and cleans up queued work on unmount", () => {
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
      <BlockGuideContents id="mobile-contents" sections={sections} mobile />
    </>,
  );
  document.getElementById("usage")!.scrollIntoView = scroll;
  const navigate = () => {
    history.replaceState(null, "", "#usage");
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };
  act(navigate);
  expect(scroll).toHaveBeenCalledTimes(1);
  expect(frames.size).toBe(1);
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
  expect(removeMedia).toHaveBeenCalledTimes(2);
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
  const title = "From a block preview to your application";
  const view = render(
    <>
      <h1 id="page-title">{title}</h1>
      <BlockGuideContents id="guide-contents" pageTitle={title} sections={[]} />
    </>,
  );
  const scroll = vi.fn();
  document.getElementById("page-title")!.scrollIntoView = scroll;
  expect(view.getByRole("link", { name: title }).getAttribute("href")).toBe("#page-title");
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
