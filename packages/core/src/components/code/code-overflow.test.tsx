import { act, cleanup, fireEvent, render } from "@testing-library/preact";
import { renderToString } from "preact-render-to-string";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { Code } from "./Code";

let width: number;
let observers: { notify: () => void; disconnect: ReturnType<typeof vi.fn> }[];
const longSource = `const message = "${"long source ".repeat(8)}";`;
const wrapName = { name: "Wrap code lines" };

beforeEach(() => {
  width = 320;
  observers = [];
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(() => width);
  vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockImplementation(function (
    this: HTMLElement,
  ) {
    const sourceWidth = Math.max(
      ...(this.textContent ?? "").split("\n").map((line) => line.length * 8),
    );
    // Wrapped geometry fits the pane. Only intrinsic measurement recovers the original line width.
    if (this.hasAttribute("data-code-measure")) return sourceWidth;
    return this.closest(".is-wrapped") ? width : Math.max(width, sourceWidth);
  });
  vi.stubGlobal(
    "ResizeObserver",
    class {
      disconnect = vi.fn();
      constructor(callback: ResizeObserverCallback) {
        observers.push({
          notify: () => callback([], this as unknown as ResizeObserver),
          disconnect: this.disconnect,
        });
      }
      observe() {}
    },
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function resize(next: number) {
  width = next;
  act(() => observers.forEach((observer) => observer.notify()));
}

it("shows default and custom wrap controls only for visible overflowing source", () => {
  const custom = vi.fn(({ defaultControl }) => defaultControl);
  const view = render(
    <Code code="const value = 1;" highlight={false} renderWrapControl={custom} />,
  );
  expect(view.queryByRole("switch", wrapName)).toBeNull();
  expect(custom).not.toHaveBeenCalled();
  expect(view.getByRole("button", { name: "Copy code" })).toBeVisible();
  view.rerender(<Code code={longSource} highlight={false} renderWrapControl={custom} />);
  expect(view.getByRole("switch", wrapName)).not.toBeChecked();
  expect(custom).toHaveBeenCalled();
  view.rerender(<Code code="const value = 1;" highlight={false} renderWrapControl={custom} />);
  expect(view.queryByRole("switch", wrapName)).toBeNull();
  expect(view.container.querySelector(".docs-code-actions")).toBeNull();
});

it("retains wrapping and its control, then hides only the control when the pane becomes wide", () => {
  const change = vi.fn();
  const view = render(<Code code={longSource} highlight={false} onWrappedChange={change} />);
  fireEvent.click(view.getByRole("switch", wrapName));
  expect(view.getByRole("switch", wrapName)).toBeChecked();
  expect(view.container.querySelector("pre code")?.textContent).toBe(longSource);
  expect(view.container.querySelector("[data-code-measure]")).toBeNull();
  const observerCount = observers.length;
  const attributes = vi.spyOn(view.container.querySelector("pre code")!, "setAttribute");
  resize(1600);
  expect(view.queryByRole("switch", wrapName)).toBeNull();
  expect(view.container.querySelector('[data-slot="code"]')).toHaveClass("is-wrapped");
  resize(200);
  expect(view.getByRole("switch", wrapName)).toBeChecked();
  expect(change).toHaveBeenCalledExactlyOnceWith(true);
  expect(observers).toHaveLength(observerCount);
  expect(attributes).not.toHaveBeenCalledWith("data-code-measure", "");
});

it("keeps both controls for long hidden imports, preserving a controlled preference", () => {
  const source = `import { value } from "${"long-package-name/".repeat(8)}";\n\nconst count = 1;`;
  const change = vi.fn();
  const view = render(<Code code={source} wrapped highlight={false} onWrappedChange={change} />);
  expect(view.getByRole("switch", wrapName)).toBeChecked();
  fireEvent.click(view.getByRole("button", { name: "Hide imports" }));
  expect(view.getByRole("switch", wrapName)).toBeChecked();
  expect(view.container.querySelector("pre code")?.textContent).toBe("const count = 1;");
  fireEvent.click(view.getByRole("button", { name: "Show imports" }));
  expect(view.getByRole("switch", wrapName)).toBeChecked();
  expect(view.container.querySelector("pre code")?.textContent).toBe(source);
  expect(change).not.toHaveBeenCalled();
});

it("hides both controls when the whole source fits and restores them together after resizing", () => {
  const source = 'import { value } from "ui";\n\nconst count = value;';
  const view = render(<Code code={source} highlight={false} />);
  expect(view.queryByRole("switch", wrapName)).toBeNull();
  expect(view.queryByRole("button", { name: /imports$/ })).toBeNull();
  expect(view.container.querySelector('[data-slot="code-imports"]')).toBeNull();
  resize(160);
  expect(view.getByRole("switch", wrapName)).toBeVisible();
  fireEvent.click(view.getByRole("button", { name: "Hide imports" }));
  expect(view.getByRole("button", { name: "Show imports" })).toBeVisible();
  expect(view.getByRole("switch", wrapName)).toBeVisible();
  resize(800);
  expect(view.queryByRole("switch", wrapName)).toBeNull();
  expect(view.queryByRole("button", { name: /imports$/ })).toBeNull();
  resize(160);
  expect(view.getByRole("switch", wrapName)).toBeVisible();
  expect(view.getByRole("button", { name: "Show imports" })).toBeVisible();
});

it("measures initially folded imports once without retaining a probe or replacing source nodes", () => {
  const source = `import { value } from "${"long-package/".repeat(8)}";\n\nconst count = 1;`;
  const view = render(<Code code={source} defaultImportsCollapsed highlight={false} />);
  const code = view.container.querySelector("pre code")!;
  expect(view.getByRole("button", { name: "Show imports" })).toBeVisible();
  expect(view.getByRole("switch", wrapName)).toBeVisible();
  expect(code.textContent).toBe("const count = 1;");
  expect(view.container.querySelector("[data-code-probe], [data-code-measure]")).toBeNull();
  const clone = vi.spyOn(code, "cloneNode");
  resize(1600);
  expect(view.queryByRole("switch", wrapName)).toBeNull();
  resize(320);
  expect(view.getByRole("button", { name: "Show imports" })).toBeVisible();
  expect(clone).not.toHaveBeenCalled();
  expect(view.container.querySelector("pre code")).toBe(code);
});

it("accounts for padding and ignores pixel rounding at the edge", () => {
  const view = render(<Code code={"/".repeat(40)} filePath="test.ts" highlight={false} />);
  expect(view.queryByRole("switch", wrapName)).toBeNull();
  view.container.querySelector("pre")!.style.padding = "16px";
  resize(320);
  expect(view.getByRole("switch", wrapName)).toBeVisible();
  view.container.querySelector("pre")!.style.padding = "0";
  resize(319);
  expect(view.queryByRole("switch", wrapName)).toBeNull();
  resize(318);
  expect(view.getByRole("switch", wrapName)).toBeVisible();
});

it("waits for a hidden pane to have width and disconnects on unmount", () => {
  width = 0;
  const view = render(<Code code={longSource} defaultWrapped highlight={false} />);
  expect(view.queryByRole("switch", wrapName)).toBeNull();
  resize(320);
  expect(view.getByRole("switch", wrapName)).toBeChecked();
  view.unmount();
  expect(observers[0].disconnect).toHaveBeenCalledOnce();
  resize(1600);
});

it("keeps fitting source fixed-wrapped without showing a redundant control", () => {
  const view = render(<Code code="const value = 1;" defaultWrapped highlight={false} />);
  expect(view.queryByRole("switch", wrapName)).toBeNull();
  resize(200);
  expect(view.queryByRole("switch", wrapName)).toBeNull();
  resize(80);
  expect(view.getByRole("switch", wrapName)).toBeChecked();
  expect(view.container.querySelector("pre code")?.textContent).toBe("const value = 1;");
});

it("preserves the source height during intrinsic sizing and restores authored inline styles", () => {
  const view = render(<Code code={longSource} defaultWrapped highlight={false} />);
  const code = view.container.querySelector<HTMLElement>("pre code")!;
  code.style.height = "150px";
  code.style.setProperty("min-height", "2rem", "important");
  const original = code.style.cssText;
  const set = vi.spyOn(code.style, "setProperty");
  view.rerender(<Code code={longSource} defaultWrapped highlight={false} syntaxTheme="dusk" />);
  expect(set).toHaveBeenCalledWith("min-height", "150px", "important");
  expect(code.style.cssText).toBe(original);
  expect(view.container.querySelector("[data-code-measure]")).toBeNull();
});

it("does not observe commands, rendered documents or disabled controls, including during SSR", () => {
  const view = render(
    <Code code={longSource} showWrapControl={false} defaultWrapped highlight={false} />,
  );
  expect(observers).toHaveLength(0);
  view.rerender(<Code code="pnpm add a-very-long-package-name" language="bash" />);
  view.rerender(<Code code={longSource} renderedContent={<p>Prepared document</p>} />);
  expect(observers).toHaveLength(0);
  const html = renderToString(<Code code={longSource} defaultWrapped />);
  expect(html).not.toContain('data-slot="code-wrap-control"');
  expect(html).toContain("is-wrapped");
  expect(observers).toHaveLength(0);
});

it("responds to resizing without ResizeObserver and removes its fallback listener", () => {
  vi.stubGlobal("ResizeObserver", undefined);
  const view = render(<Code code={longSource} highlight={false} />);
  expect(view.getByRole("switch", wrapName)).toBeVisible();
  width = 1600;
  fireEvent(window, new Event("resize"));
  expect(view.queryByRole("switch", wrapName)).toBeNull();
  const remove = vi.spyOn(window, "removeEventListener");
  view.unmount();
  expect(remove).toHaveBeenCalledWith("resize", expect.any(Function));
});
