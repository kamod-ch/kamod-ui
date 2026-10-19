/** @vitest-environment jsdom */
import { cleanup, fireEvent, render } from "@testing-library/preact";
import { afterEach, expect, it, vi } from "vitest";
import { BlockShowcasePreview } from "./BlockShowcasePreview";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const url = "/blocks/sidebar/sidebar-01/preview";
const appearance = { preset: "ocean", scheme: "dark" } as const;

function previewDocument(address: string, readyState = "complete") {
  const doc = document.implementation.createHTMLDocument();
  Object.defineProperties(doc, {
    URL: { value: new URL(address, document.baseURI).href },
    readyState: { value: readyState, configurable: true },
  });
  vi.spyOn(HTMLIFrameElement.prototype, "contentDocument", "get").mockReturnValue(doc);
  return doc;
}

function mount() {
  const onLoad = vi.fn();
  const result = render(
    <BlockShowcasePreview
      url={url}
      height={320}
      previewKey={0}
      viewport="desktop"
      appearance={appearance}
      onLoad={onLoad}
      onCancel={vi.fn()}
      refreshing={false}
    />,
  );
  return { ...result, onLoad };
}

it("settles an SSR frame that finished before hydration attached its load handler", () => {
  const doc = previewDocument(url);
  const { container, onLoad } = mount();
  expect(container.querySelector(".blocks-showcase-preview")).toHaveAttribute("aria-busy", "false");
  expect(container.querySelector(".showcase-loading")).toBeNull();
  expect(doc.documentElement.getAttribute("data-theme")).toBe("ocean");
  expect(doc.documentElement.classList.contains("dark")).toBe(true);
  expect(onLoad).toHaveBeenCalledWith(0);
});

it.each(["about:blank", "/blocks/sidebar/previous/preview"])(
  "ignores the completed %s document while the requested preview navigates",
  (address) => {
    previewDocument(address);
    const { container, onLoad } = mount();
    fireEvent.load(container.querySelector("iframe")!);
    expect(container.querySelector(".blocks-showcase-preview")).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(onLoad).not.toHaveBeenCalled();
  },
);

it("waits for a still-loading matching frame and settles on its later load event", () => {
  const doc = previewDocument(url, "loading");
  const { container, onLoad } = mount();
  expect(onLoad).not.toHaveBeenCalled();
  Object.defineProperty(doc, "readyState", { value: "complete" });
  fireEvent.load(container.querySelector("iframe")!);
  expect(container.querySelector(".showcase-loading")).toBeNull();
  expect(onLoad).toHaveBeenCalledWith(0);
});
