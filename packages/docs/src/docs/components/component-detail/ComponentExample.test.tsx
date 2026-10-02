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
  it("disables ineffective widths, retains a narrow preference and resets only the example", async () => {
    const { container, unmount } = example();
    const narrow = screen.getByRole("button", { name: "Narrow container" });
    width(360);
    expect(narrow).toHaveProperty("disabled", true);
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
    expect(container.querySelector(".component-example-frame-wrap")).not.toHaveAttribute(
      "data-narrow",
    );
    width(500);
    expect(container.querySelector(".component-example-frame-wrap")).toHaveAttribute(
      "data-narrow",
      "true",
    );
    fireEvent.click(screen.getByRole("tab", { name: "Code", exact: true }));
    expect(container.querySelector("pre code")?.textContent).toBe("const example = 1;");
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

  it("changes only the frame appearance and includes the actual example in both prompt modes", () => {
    const { container } = example();
    const pageTheme = document.documentElement.outerHTML.split("<head>")[0];
    fireEvent.click(screen.getByRole("button", { name: "Dark preview" }));
    expect(screen.getByRole("button", { name: "Dark preview" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(document.documentElement.outerHTML.split("<head>")[0]).toBe(pageTheme);
    fireEvent.click(screen.getByRole("tab", { name: "Prompt", exact: true }));
    expect(container.querySelector("pre code")?.textContent).toContain("const example = 1;");
    expect(container.querySelector("pre code")?.textContent).toContain("Set up and integrate");
    fireEvent.click(screen.getByRole("button", { name: "Adapt example" }));
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
  const preview = document.implementation.createHTMLDocument("Example");
  preview.body.innerHTML = '<main id="component-preview-root">Example</main>';
  Object.defineProperty(frame, "contentDocument", { value: preview });
  fireEvent.load(frame);
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
  fireEvent.error(container.querySelector("iframe")!);
  expect(control).toHaveAttribute("data-refresh-state", "resetting");
});
