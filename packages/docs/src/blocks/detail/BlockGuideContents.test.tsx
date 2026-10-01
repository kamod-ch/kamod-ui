/** @vitest-environment jsdom */
import { act, cleanup, render } from "@testing-library/preact";
import { afterEach, expect, it, vi } from "vitest";
import { BlockGuideContents } from "./BlockGuideContents";

afterEach(() => {
  cleanup();
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
