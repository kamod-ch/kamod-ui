import { act, cleanup, fireEvent, render, waitFor } from "@testing-library/preact";
import { renderToString } from "preact-render-to-string";
import { afterEach, expect, it, vi } from "vitest";
import { CodeWrapControl } from "./code-controls";
import { Code, CodeFileHeader } from "./index";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

const source =
  'import {\n  Button,\n} from "ui";\n\nexport const Save = () => <Button>Save</Button>;';

it("activates the wrap switch exactly once from every part of its label", () => {
  const onChange = vi.fn();
  const view = render(<CodeWrapControl wrapped={false} codeId="example" onChange={onChange} />);
  for (const selector of [
    "label",
    ".docs-code-wrap-icon",
    ".docs-code-wrap-state",
    ".docs-code-control-end-icon",
    '[role="switch"]',
    '[data-slot="switch-thumb"]',
  ]) {
    onChange.mockClear();
    fireEvent.click(view.container.querySelector(selector)!);
    expect(onChange, selector).toHaveBeenCalledExactlyOnceWith(true);
  }
});

it("server-renders escaped source without executing embedded markup", () => {
  const unsafe = '<script>alert("unsafe")</script>\n<img src=x onerror=alert(1)>';
  const html = renderToString(<Code code={unsafe} defaultWrapped inferLanguage={false} />);
  const host = document.createElement("div");
  host.innerHTML = html;
  expect(host.querySelector("pre code")?.textContent).toBe(unsafe);
  expect(host.querySelector("script, img")).toBeNull();
  expect(host.querySelector("pre")?.tabIndex).toBe(0);
  expect(host.querySelector("[role=status]")?.textContent).toBe("");
});

it("highlights the replacement source when an earlier lazy highlight is still pending", async () => {
  const observers: {
    notify: IntersectionObserverCallback;
    disconnect: ReturnType<typeof vi.fn>;
  }[] = [];
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      disconnect = vi.fn();
      constructor(notify: IntersectionObserverCallback) {
        observers.push({ notify, disconnect: this.disconnect });
      }
      observe() {}
    },
  );
  const before = "export const oldValue = true;";
  const after = "export const nextValue = false;";
  const view = render(<Code code={before} language="tsx" />);
  const approach = (index: number) =>
    observers[index].notify(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  act(() => approach(0));
  view.rerender(<Code code={after} language="typescript" />);
  expect(view.container.querySelector("pre")?.textContent).toBe(after);
  expect(observers[0].disconnect).toHaveBeenCalled();
  act(() => approach(1));
  await act(async () => {
    await vi.dynamicImportSettled();
  });
  await waitFor(() => expect(view.container.querySelector("pre .token.keyword")).not.toBeNull());
  expect(view.container.querySelector("pre")?.textContent).toBe(after);
  expect(view.container.querySelector("pre")).toHaveAttribute("data-language", "typescript");
  expect(view.container.querySelector("pre")?.textContent).not.toContain("oldValue");
});

it("folds multiline imports but copies the full original source", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal("navigator", { clipboard: { writeText } });
  const onCopy = vi.fn();
  const view = render(
    <Code code={source} language="tsx" defaultImportsCollapsed onCopy={onCopy} />,
  );
  const toggle = view.getByRole("button", { name: "Show imports" });
  expect(toggle).toHaveAttribute("aria-expanded", "false");
  expect(view.container.querySelector("pre")?.textContent).toBe(
    "export const Save = () => <Button>Save</Button>;",
  );
  fireEvent.click(view.getByRole("button", { name: "Copy code" }));
  await waitFor(() => expect(onCopy).toHaveBeenCalledWith(source));
  expect(writeText).toHaveBeenCalledWith(source);
  expect(view.getByRole("status")).toHaveTextContent("Code copied to clipboard.");
  fireEvent.click(toggle);
  expect(view.container.querySelector("pre")?.textContent).toBe(source);
});

it("reports clipboard rejection, then supports retry without a false success", async () => {
  const error = new Error("permission denied");
  const writeText = vi.fn().mockRejectedValueOnce(error).mockResolvedValueOnce(undefined);
  vi.stubGlobal("navigator", { clipboard: { writeText } });
  const onCopy = vi.fn();
  const onCopyError = vi.fn();
  const view = render(<Code code="hello" onCopy={onCopy} onCopyError={onCopyError} />);
  fireEvent.click(view.getByRole("button", { name: "Copy code" }));
  await waitFor(() => expect(onCopyError).toHaveBeenCalledWith(error));
  expect(onCopy).not.toHaveBeenCalled();
  expect(view.getByRole("status")).toHaveTextContent("Could not copy code.");
  fireEvent.click(view.getByRole("button", { name: "Retry copying code" }));
  await waitFor(() => expect(onCopy).toHaveBeenCalledWith("hello"));
});

it("announces unavailable clipboard access and leaves source selectable", async () => {
  vi.stubGlobal("navigator", {});
  const view = render(<Code code="select this text" />);
  fireEvent.click(view.getByRole("button", { name: "Copy code" }));
  await waitFor(() => expect(view.getByRole("status")).toHaveTextContent("select and copy"));
  expect(view.container.querySelector("pre")?.textContent).toBe("select this text");
});

it.each(["replace", "unmount"])("ignores a stale copy completion after %s", async (action) => {
  let finish!: () => void;
  vi.stubGlobal("navigator", {
    clipboard: {
      writeText: () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    },
  });
  const onCopy = vi.fn();
  const view = render(<Code code="first" onCopy={onCopy} />);
  fireEvent.click(view.getByRole("button", { name: "Copy code" }));
  if (action === "replace") view.rerender(<Code code="second" onCopy={onCopy} />);
  else view.unmount();
  await act(async () => finish());
  expect(onCopy).not.toHaveBeenCalled();
  if (action === "replace") expect(view.getByRole("status")).toHaveTextContent("");
});

it.each(["replace", "unmount"])("ignores a stale clipboard rejection after %s", async (action) => {
  let reject!: (error: Error) => void;
  vi.stubGlobal("navigator", {
    clipboard: {
      writeText: () =>
        new Promise<void>((_resolve, rejectCopy) => {
          reject = rejectCopy;
        }),
    },
  });
  const onCopyError = vi.fn();
  const view = render(<Code code="first" onCopyError={onCopyError} />);
  fireEvent.click(view.getByRole("button", { name: "Copy code" }));
  if (action === "replace") view.rerender(<Code code="second" onCopyError={onCopyError} />);
  else view.unmount();
  await act(async () => reject(new Error("Late clipboard rejection")));
  expect(onCopyError).not.toHaveBeenCalled();
  if (action === "replace") {
    expect(view.getByRole("status")).toHaveTextContent("");
    expect(view.getByRole("button", { name: "Copy code" })).not.toBeDisabled();
  }
});

it("cancels copied-feedback timers on unmount", async () => {
  vi.useFakeTimers();
  vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
  const view = render(<Code code="plain text" />);
  await act(async () => {
    fireEvent.click(view.getByRole("button", { name: "Copy code" }));
    await vi.advanceTimersByTimeAsync(0);
  });
  expect(view.getByRole("status")).toHaveTextContent("Code copied to clipboard.");
  expect(vi.getTimerCount()).toBeGreaterThan(0);
  view.unmount();
  expect(vi.getTimerCount()).toBe(0);
});

it("clears copied feedback and its timer when the source is replaced", async () => {
  vi.useFakeTimers();
  vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
  const view = render(<Code code="first source" />);
  await act(async () => {
    fireEvent.click(view.getByRole("button", { name: "Copy code" }));
    await vi.advanceTimersByTimeAsync(0);
  });
  expect(view.getByRole("status")).toHaveTextContent("Code copied to clipboard.");
  expect(vi.getTimerCount()).toBeGreaterThan(0);
  view.rerender(<Code code="second source" />);
  expect(view.getByRole("status")).toHaveTextContent("");
  expect(view.getByRole("button", { name: "Copy code" })).not.toBeDisabled();
  expect(vi.getTimerCount()).toBe(0);
});

it("cancels a pending copy when the copy action is removed", async () => {
  let finish!: () => void;
  vi.stubGlobal("navigator", {
    clipboard: {
      writeText: () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    },
  });
  const onCopy = vi.fn();
  const view = render(<Code code="source" onCopy={onCopy} />);
  fireEvent.click(view.getByRole("button", { name: "Copy code" }));
  view.rerender(<Code code="source" onCopy={onCopy} showCopy={false} />);
  await act(async () => finish());
  expect(onCopy).not.toHaveBeenCalled();
  expect(view.queryByRole("status")).toBeNull();
  expect(view.queryByRole("button", { name: "Copy code" })).toBeNull();
});

it("restores the configured folding default when changing sources", () => {
  const view = render(<Code code={source} defaultImportsCollapsed />);
  fireEvent.click(view.getByRole("button", { name: "Show imports" }));
  const next = source.replace("Save", "Next");
  view.rerender(<Code code={next} defaultImportsCollapsed />);
  expect(view.getByRole("button", { name: "Show imports" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  view.rerender(<Code code={source} defaultImportsCollapsed />);
  expect(view.getByRole("button", { name: "Show imports" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
});

it("supports fixed display preferences, surface variants and custom root attributes", () => {
  const view = render(
    <Code
      code={source}
      class="custom-root"
      preClassName="custom-source"
      variant="outline"
      aria-label="A source example"
      defaultWrapped
      showWrapControl={false}
      showImportControl={false}
      showCopy={false}
    />,
  );
  const root = view.container.querySelector('[data-slot="code"]');
  expect(root).toHaveClass("custom-root", "is-wrapped");
  expect(root).toHaveAttribute("data-variant", "outline");
  expect(root).toHaveAttribute("aria-label", "A source example");
  expect(view.container.querySelector("pre")).toHaveClass("custom-source");
  expect(view.queryByRole("button")).toBeNull();
  expect(view.queryByRole("switch")).toBeNull();
  expect(view.queryByRole("status")).toBeNull();
});

it("allows document rendering and custom toolbar/path presentation without changing copying", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal("navigator", { clipboard: { writeText } });
  const view = render(
    <Code
      code="# Heading"
      renderedContent={
        <article>
          <h3>Heading</h3>
        </article>
      }
      renderToolbar={(actions) => <header>Document{actions}</header>}
    />,
  );
  expect(view.getByRole("heading")).toHaveTextContent("Heading");
  expect(view.queryByRole("switch")).toBeNull();
  expect(view.container.querySelector("pre")).toBeNull();
  fireEvent.click(view.getByRole("button", { name: "Copy code" }));
  await waitFor(() => expect(writeText).toHaveBeenCalledWith("# Heading"));
  view.rerender(
    <Code
      code="export const x = 1;"
      filePath="source.ts"
      renderFilePath={(path) => <a href="#source">{path}</a>}
    />,
  );
  expect(view.getByRole("link")).toHaveTextContent("source.ts");
  expect(view.container.querySelector("pre")).toHaveAttribute("data-language", "typescript");
});

it("provides exact file metadata and a file-type description", () => {
  const view = render(<CodeFileHeader path="src/example.tsx" lineCount={12} />);
  expect(view.getByRole("img", { name: "TypeScript JSX (.tsx)" })).toHaveAttribute("tabindex", "0");
  expect(view.container.querySelector("code")?.textContent).toBe("src/example.tsx");
  expect(view.container.textContent).toContain("12 lines");
});
