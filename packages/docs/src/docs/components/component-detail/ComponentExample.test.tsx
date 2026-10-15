/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DocPageModule } from "../../types";
import { ComponentExample } from "./ComponentExample";

const doc: DocPageModule = {
  slug: "button",
  title: "Button",
  usageLabel: "Actions for your app.",
  command: "pnpm add @kamod-ch/ui",
  sections: [],
  renderMain: () => null,
};
let resize: ResizeObserverCallback;
const disconnect = vi.fn();
beforeEach(() => {
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
  vi.useRealTimers();
  vi.unstubAllGlobals();
  disconnect.mockClear();
});

function example() {
  return render(
    <ComponentExample
      doc={doc}
      index={0}
      codeSnippet="const example = 1;"
      filePath="src/Example.tsx"
    />,
  );
}
function width(value: number) {
  act(() =>
    resize([{ contentRect: { width: value } } as ResizeObserverEntry], {} as ResizeObserver),
  );
}

describe("component example controls", () => {
  it("shows preview feedback before visibility arrives while keeping the frame request lazy", () => {
    vi.useFakeTimers();
    vi.stubGlobal("requestIdleCallback", undefined);
    let reveal!: IntersectionObserverCallback;
    const stop = vi.fn();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: IntersectionObserverCallback) {
          reveal = callback;
        }
        observe() {}
        unobserve() {}
        disconnect = stop;
      },
    );
    const { container, unmount } = example();
    const surface = container.querySelector(".showcase-preview-surface")!;
    const frame = surface.querySelector("iframe")!;
    expect(surface).toHaveAttribute("data-deferred");
    expect(surface.querySelector('[role="status"]')).toHaveTextContent("Setting the scene");
    expect(frame).toHaveAttribute("src", "about:blank");
    act(() =>
      reveal(
        [{ target: frame, isIntersecting: true } as unknown as IntersectionObserverEntry],
        {} as IntersectionObserver,
      ),
    );
    expect(frame).toHaveAttribute("src", "about:blank");
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(surface).not.toHaveAttribute("data-deferred");
    expect(frame.getAttribute("src")).toContain("component=button&example=0");
    expect(surface.querySelector('[role="status"]')).toHaveTextContent("Setting the scene");
    unmount();
    expect(stop).toHaveBeenCalled();
  });

  it("disables ineffective widths, retains a narrow preference and resets only the example", async () => {
    const { container, unmount } = example();
    const narrow = screen.getByRole("button", { name: "Narrow container" });
    width(360);
    expect(narrow).toHaveProperty("disabled", true);
    const caption = container.querySelector(".component-example-caption-mode");
    expect(caption).toHaveTextContent("Full width");
    act(() =>
      resize(
        [
          { contentRect: { width: 0 } } as ResizeObserverEntry,
          { contentRect: { width: 500 } } as ResizeObserverEntry,
        ],
        {} as ResizeObserver,
      ),
    );
    fireEvent.click(narrow);
    expect(caption).toHaveTextContent("Narrow view");
    expect(container.querySelector(".component-example-frame-wrap")).toHaveAttribute(
      "data-narrow",
      "true",
    );
    const firstFrame = container.querySelector("iframe");
    fireEvent.click(screen.getByRole("button", { name: "Reset example" }));
    expect(container.querySelector("iframe")).not.toBe(firstFrame);
    expect(container.querySelector(".component-example-frame-wrap")).toHaveAttribute(
      "data-narrow",
      "true",
    );
    width(320);
    expect(narrow).toHaveProperty("disabled", true);
    expect(caption).toHaveTextContent("Full width");
    expect(container.querySelector(".component-example-frame-wrap")).not.toHaveAttribute(
      "data-narrow",
    );
    width(500);
    expect(caption).toHaveTextContent("Narrow view");
    expect(container.querySelector(".component-example-frame-wrap")).toHaveAttribute(
      "data-narrow",
      "true",
    );
    fireEvent.click(screen.getByRole("tab", { name: "Code", exact: true }));
    await waitFor(() =>
      expect(container.querySelector("pre code")?.textContent).toBe("const example = 1;"),
    );
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Reset example" })).toBeEnabled(),
    );
    fireEvent.click(screen.getByRole("button", { name: "Reset example" }));
    expect(screen.getByRole("tab", { name: "Preview", exact: true })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it("changes only the frame appearance and includes the actual example in both prompt modes", async () => {
    const { container } = example();
    const pageTheme = document.documentElement.outerHTML.split("<head>")[0];
    fireEvent.click(screen.getByRole("button", { name: "Dark preview" }));
    expect(screen.getByRole("button", { name: "Dark preview" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(document.documentElement.outerHTML.split("<head>")[0]).toBe(pageTheme);
    fireEvent.click(screen.getByRole("tab", { name: "Prompt", exact: true }));
    await waitFor(() =>
      expect(container.querySelector("pre code")?.textContent).toContain("const example = 1;"),
    );
    await waitFor(() =>
      expect(container.querySelector("pre code")?.textContent).toContain("Set up and integrate"),
    );
    expect(screen.getByRole("button", { name: "Code (Markdown)", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    fireEvent.click(screen.getByRole("button", { name: "Tailor Example" }));
    expect(container.querySelector("pre code")?.textContent).toContain("[describe the outcome]");
    expect(container.querySelector("pre code")?.textContent).toContain("const example = 1;");
  });
});

it("uses the block refresh phases and only completes after the replacement frame loads", () => {
  vi.useFakeTimers();
  const { container } = example();
  const control = screen.getByRole("button", { name: "Reset example" });
  fireEvent.click(control);
  const frame = container.querySelector("iframe")!;
  expect(control).toHaveAttribute("data-refresh-state", "loading");
  expect(control).toBeDisabled();
  fireEvent.click(control);
  expect(container.querySelector("iframe")).toBe(frame);
  // A blank iframe load is not successful completion of an example reset.
  fireEvent.load(frame);
  expect(control).toHaveAttribute("data-refresh-state", "loading");
  act(() => {
    vi.advanceTimersByTime(50);
  });
  const preview = document.implementation.createHTMLDocument("Example");
  preview.body.innerHTML = '<main id="component-preview-root">Example</main>';
  Object.defineProperty(frame, "contentDocument", { value: preview });
  fireEvent.load(frame);
  expect(control).toHaveAttribute("data-refresh-state", "loading");
  // A lightweight document can load before its selected example's module is ready.
  act(() => {
    preview.dispatchEvent(new Event("kamod:preview-ready"));
  });
  expect(control).toHaveAttribute("data-refresh-state", "complete");
  expect(screen.getByRole("status")).toHaveTextContent("Example reset.");
  act(() => {
    vi.advanceTimersByTime(1100);
  });
  expect(control).toHaveAttribute("data-refresh-state", "resetting");
  expect(control).toBeDisabled();
  act(() => {
    vi.advanceTimersByTime(200);
  });
  expect(control).toHaveAttribute("data-refresh-state", "idle");
  expect(control).toBeEnabled();
  fireEvent.click(control);
  act(() => {
    vi.advanceTimersByTime(50);
  });
  fireEvent.error(container.querySelector("iframe")!);
  expect(control).toHaveAttribute("data-refresh-state", "resetting");
});
