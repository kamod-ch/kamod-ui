/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render, waitFor } from "@testing-library/preact";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { Code as CoreCode } from "./Code";
import { escapeCodeHtml } from "./code-markup";
import { codeSyntaxThemes } from "./code-themes";
import type { CodeHighlighter, CodeProps } from "./code-types";
import { readableCodeLines } from "./code-wrap";
import { useCodeHighlight } from "./use-code-highlight";

const highlightCode = vi.fn<CodeHighlighter>(() => '<span class="token">highlighted</span>');
const Code = (props: CodeProps) => <CoreCode highlighter={highlightCode} {...props} />;
vi.mock("./code-wrap", async (original) => {
  const module = await original<typeof import("./code-wrap")>();
  return { ...module, readableCodeLines: vi.fn(module.readableCodeLines) };
});
beforeEach(() => {
  // jsdom has no layout; these tests exercise controls on an overflowing source surface.
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(320);
  vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(800);
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it("keeps escaped source readable without loading a grammar engine when no adapter is supplied", () => {
  const observer = vi.fn();
  vi.stubGlobal("IntersectionObserver", observer);
  const code = 'const text = "<hello>";';
  const view = render(<CoreCode code={code} language="tsx" loadingContent={<p>Formatting</p>} />);
  expect(view.container.querySelector("pre code")?.textContent).toBe(code);
  expect(view.container.querySelector("script")).toBeNull();
  expect(view.queryByText("Formatting")).toBeNull();
  expect(observer).not.toHaveBeenCalled();
});

it("keeps off-screen code readable without highlighting, then highlights on approach", async () => {
  let notify: IntersectionObserverCallback;
  const disconnect = vi.fn();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        notify = callback;
      }
      observe() {}
      disconnect = disconnect;
    },
  );
  const code = 'const text = "<hello>";';
  const { container } = render(<Code code={code} language="tsx" />);
  expect(container.querySelector("code")?.textContent).toBe(code);
  expect(highlightCode).not.toHaveBeenCalled();
  act(() =>
    notify([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver),
  );
  await waitFor(() => expect(container.querySelector(".token")).not.toBeNull());
  expect(highlightCode).toHaveBeenCalledWith(code, "tsx");
  expect(disconnect).toHaveBeenCalled();
});

it("does not parse plain text or a rendered document", () => {
  render(<Code code="plain text" language="text" />);
  render(<Code code="# Heading" language="markdown" renderedContent={<p>Heading</p>} />);
  expect(highlightCode).not.toHaveBeenCalled();
});

it("shows an opted-in placeholder while preserving source and Copy, then reveals formatted code", async () => {
  let notify: IntersectionObserverCallback;
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        notify = callback;
      }
      observe() {}
      disconnect() {}
    },
  );
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal("navigator", { clipboard: { writeText } });
  const code = 'const value = "<literal>";';
  const view = render(<Code code={code} loadingContent={<p role="status">Formatting source</p>} />);
  const source = view.container.querySelector("pre")!;
  expect(view.getByText("Formatting source")).toBeVisible();
  expect(source).not.toBeVisible();
  expect(source).toHaveAttribute("tabindex", "-1");
  expect(source.textContent).toBe(code);
  fireEvent.click(view.getByRole("button", { name: "Copy code" }));
  await waitFor(() => expect(writeText).toHaveBeenCalledWith(code));
  act(() =>
    notify([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver),
  );
  await waitFor(() => expect(view.queryByText("Formatting source")).toBeNull());
  expect(source).toBeVisible();
  expect(source).toHaveAttribute("tabindex", "0");
  expect(source.querySelector(".token")).not.toBeNull();
});

it("releases an opted-in placeholder if syntax formatting fails", async () => {
  vi.stubGlobal("IntersectionObserver", undefined);
  vi.mocked(highlightCode).mockImplementationOnce(() => {
    throw new Error("Unavailable grammar");
  });
  const code = 'const source = "<script> & text";';
  const view = render(<Code code={code} loadingContent={<p>Formatting source</p>} />);
  await waitFor(() => expect(view.queryByText("Formatting source")).toBeNull());
  expect(view.container.querySelector("pre")).toBeVisible();
  expect(view.container.querySelector("code")?.textContent).toBe(code);
  expect(view.container.querySelector("script")).toBeNull();
});

it("does not show syntax placeholders for plain text, disabled coloring or custom documents", () => {
  const loadingContent = <p>Formatting source</p>;
  const view = render(
    <>
      <Code code="Plain text" inferLanguage={false} loadingContent={loadingContent} />
      <Code code="export const value = 1;" highlight={false} loadingContent={loadingContent} />
      <Code
        code="# Heading"
        renderedContent={<p>Ready document</p>}
        loadingContent={loadingContent}
      />
    </>,
  );
  expect(view.queryByText("Formatting source")).toBeNull();
  expect(view.getByText("Ready document")).toBeVisible();
  expect(highlightCode).not.toHaveBeenCalled();
});

it("can disable coloring without losing escaped source, inferred language or reading controls", async () => {
  const observer = vi.fn();
  vi.stubGlobal("IntersectionObserver", observer);
  const code = 'const source = "<script> & content";';
  const view = render(<Code code={code} highlight={false} />);
  await act(() => vi.dynamicImportSettled());
  expect(view.container.querySelector("pre code")?.textContent).toBe(code);
  expect(view.container.querySelector("pre")).toHaveAttribute("data-language", "javascript");
  expect(view.container.querySelector("script")).toBeNull();
  expect(view.getByRole("switch", { name: "Wrap code lines" })).toBeVisible();
  expect(observer).not.toHaveBeenCalled();
  expect(highlightCode).not.toHaveBeenCalled();
});

it("cancels deferred highlighting when coloring is disabled and can enable it again", async () => {
  vi.stubGlobal("IntersectionObserver", undefined);
  const code = "export const value = true;";
  const view = render(<Code code={code} />);
  view.rerender(<Code code={code} highlight={false} />);
  await act(() => vi.dynamicImportSettled());
  expect(highlightCode).not.toHaveBeenCalled();
  expect(view.container.querySelector("pre code")?.textContent).toBe(code);
  view.rerender(<Code code={code} />);
  await waitFor(() => expect(view.container.querySelector(".token")).not.toBeNull());
  expect(highlightCode).toHaveBeenCalledOnce();
  view.rerender(<Code code={code} highlight={false} />);
  expect(view.container.querySelector("pre .token")).toBeNull();
  expect(view.container.querySelector("pre code")?.textContent).toBe(code);
});

it("skips source formatting for a rendered document even when wrapping is enabled", () => {
  const view = render(
    <Code
      code={'const example = "<markup>";\n'.repeat(2000)}
      defaultWrapped
      renderedContent={<p>Prepared document</p>}
    />,
  );
  expect(view.getByText("Prepared document")).toBeVisible();
  expect(view.container.querySelector("pre")).toBeNull();
  expect(readableCodeLines).not.toHaveBeenCalled();
  expect(highlightCode).not.toHaveBeenCalled();
});

it("does not allocate escaped source for an inactive highlighting view", () => {
  function DocumentView() {
    const { html } = useCodeHighlight('<script>const x = "source";</script>', "tsx", false);
    return <output>{html}</output>;
  }
  const { container } = render(<DocumentView />);
  expect(container.querySelector("output")?.textContent).toBe("");
});

it("keeps copy feedback local without rerendering the toolbar or formatting the source", async () => {
  vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
  const toolbar = vi.fn((actions) => <header>Source{actions}</header>);
  const view = render(
    <Code code="literal output" inferLanguage={false} defaultWrapped renderToolbar={toolbar} />,
  );
  toolbar.mockClear();
  vi.mocked(readableCodeLines).mockClear();
  fireEvent.click(view.getByRole("button", { name: "Copy code" }));
  await waitFor(() =>
    expect(view.getByRole("status")).toHaveTextContent("Code copied to clipboard."),
  );
  expect(toolbar).not.toHaveBeenCalled();
  expect(readableCodeLines).not.toHaveBeenCalled();
});

it("cancels pending highlighting when a code block unmounts", async () => {
  vi.stubGlobal("IntersectionObserver", undefined);
  const view = render(<Code code="const answer = 42" language="tsx" />);
  view.unmount();
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 20));
  });
  expect(highlightCode).not.toHaveBeenCalled();
});

it("cancels pending highlighting when switching to a rendered document", async () => {
  vi.stubGlobal("IntersectionObserver", undefined);
  const code = "export const oldValue = true;";
  const view = render(<Code code={code} language="tsx" />);
  view.rerender(<Code code={code} language="tsx" renderedContent={<p>Prepared document</p>} />);
  await act(() => vi.dynamicImportSettled());
  expect(highlightCode).not.toHaveBeenCalled();
  expect(view.getByText("Prepared document")).toBeVisible();
});

it.each([
  ["pnpm add @kamod-ch/ui", "bash", "Install Packages·Terminal"],
  ["npm install @kamod-ch/ui", "bash", "Install Packages·Terminal"],
  ["yarn add @kamod-ch/ui", "bash", "Install Packages·Terminal"],
  ["pnpm build", "bash", "Run Command·Terminal"],
  ["export const value = 1;", "tsx", "Usage Pattern·TypeScript"],
  [".panel { display: grid; }", "css", "Style Rules·CSS"],
  ['{"value":1}', "json", "Structured Data·JSON"],
] as const)("labels unnamed snippets consistently: %s", (code, language, label) => {
  const { container } = render(<Code code={code} language={language} />);
  expect(container.querySelector(".docs-code-toolbar .docs-code-label")?.textContent).toBe(label);
  expect(container.querySelector("pre code")?.textContent).toBe(code);
});

it("preserves file and custom toolbar content without adding fallback labels", () => {
  const { container } = render(
    <>
      <Code code="const value = 1;" language="tsx" filePath="src/value.ts" />
      <Code code="Prompt" language="text" toolbarContent={<span>Setup Prompt</span>} />
      <Code
        code="const value = 1;"
        language="tsx"
        renderToolbar={(copy) => <div>Source Controls{copy}</div>}
      />
    </>,
  );
  expect(container.querySelector(".docs-code-label")).toBeNull();
  expect(container.querySelector(".docs-code-file-path")?.textContent).toBe("src/value.ts");
  expect(container.textContent).toContain("Setup Prompt");
  expect(container.textContent).toContain("Source Controls");
});

it("does not rerun the syntax highlighter when wrapping changes", async () => {
  vi.stubGlobal("IntersectionObserver", undefined);
  const view = render(<Code code="const answer = 42" language="tsx" />);
  await waitFor(() => expect(view.container.querySelector(".token")).not.toBeNull());
  expect(highlightCode).toHaveBeenCalledTimes(1);
  const toggle = view.getByRole("switch", { name: "Wrap code lines" });
  fireEvent.click(toggle);
  fireEvent.click(toggle);
  expect(highlightCode).toHaveBeenCalledTimes(1);
});

it.each([false, true])(
  "folds imports immediately with complete colored source and no repeated work (wrapped: %s)",
  async (wrapped) => {
    vi.mocked(highlightCode).mockImplementationOnce(
      (code) => `<span class="token keyword">${escapeCodeHtml(code)}</span>`,
    );
    const observers: IntersectionObserverCallback[] = [];
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(notify: IntersectionObserverCallback) {
          observers.push(notify);
        }
        observe() {}
        disconnect() {}
      },
    );
    const source =
      'import { Button } from "ui";\n\nexport const Save = () => <Button title="a & b">Save</Button>;';
    const body = 'export const Save = () => <Button title="a & b">Save</Button>;';
    const view = render(<Code code={source} language="tsx" defaultWrapped={wrapped} />);
    act(() =>
      observers[0](
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      ),
    );
    await waitFor(() => expect(view.container.querySelector("pre .token.keyword")).not.toBeNull());
    vi.mocked(readableCodeLines).mockClear();
    for (let index = 0; index < 8; index += 1) {
      fireEvent.click(
        view.getByRole("button", { name: index % 2 ? "Show imports" : "Hide imports" }),
      );
      expect(view.container.querySelector("pre code")?.textContent).toBe(index % 2 ? source : body);
      expect(view.container.querySelector("pre .token.keyword")).not.toBeNull();
    }
    await act(() => vi.dynamicImportSettled());
    expect(highlightCode).toHaveBeenCalledExactlyOnceWith(source, "tsx");
    expect(observers).toHaveLength(1);
    expect(readableCodeLines).not.toHaveBeenCalled();
  },
);

it("changes syntax palettes and typography without repeating highlighting", async () => {
  vi.stubGlobal("IntersectionObserver", undefined);
  const code = "export const answer = 42;";
  const view = render(<Code code={code} syntaxTheme="dusk" />);
  await waitFor(() => expect(view.container.querySelector(".token")).not.toBeNull());
  const token = view.container.querySelector(".token");
  for (const syntaxTheme of codeSyntaxThemes) {
    view.rerender(
      <Code code={code} syntaxTheme={syntaxTheme} style="--kamod-code-line-height: 1.8" />,
    );
    expect(view.container.querySelector(".kamod-code")).toHaveAttribute(
      "data-syntax-theme",
      syntaxTheme,
    );
    expect(view.container.querySelector(".token")).toBe(token);
  }
  expect(highlightCode).toHaveBeenCalledOnce();
});

it("infers unlabelled source and uses the inferred grammar in the visible label", async () => {
  vi.stubGlobal("IntersectionObserver", undefined);
  const source = "const enabled = true;";
  const { container } = render(<Code code={source} />);
  expect(container.querySelector("pre")).toHaveAttribute("data-language", "javascript");
  expect(container.querySelector(".docs-code-label")).toHaveTextContent("JavaScript");
  await waitFor(() => expect(highlightCode).toHaveBeenCalledWith(source, "javascript"));
});

it("uses file metadata for untyped snippets and resolves again when the source changes", async () => {
  vi.stubGlobal("IntersectionObserver", undefined);
  const view = render(
    <Code code="export const value = 1;" filePath="src/value.ts" language="text" />,
  );
  await waitFor(() =>
    expect(highlightCode).toHaveBeenCalledWith("export const value = 1;", "typescript"),
  );
  view.rerender(<Code code='{"value": 1}' language="text" />);
  await waitFor(() => expect(highlightCode).toHaveBeenLastCalledWith('{"value": 1}', "json"));
  expect(view.container.querySelector("pre")).toHaveAttribute("data-language", "json");
});

it("keeps intentionally literal views plain even when their content looks like code", () => {
  const source = "# Prompt\n\nconst answer = 42;";
  const { container } = render(<Code code={source} language="text" inferLanguage={false} />);
  expect(highlightCode).not.toHaveBeenCalled();
  expect(container.querySelector("pre")).toHaveAttribute("data-language", "text");
  expect(container.querySelector("pre code")).toHaveTextContent("# Prompt const answer = 42;");
});

it.each([
  [{ code: "const enabled = true;" }, true],
  [{ code: '<Button size="sm" />', language: "tsx" }, true],
  [{ code: ".panel { display: grid; }", language: "css" }, true],
  [{ code: '{"enabled":true}', language: "json" }, true],
  [{ code: "type Settings = { enabled: boolean };", language: "ts" }, true],
  [{ code: "MIT License", filePath: "LICENSE" }, true],
  [{ code: "# Setup", filePath: "README.md" }, true],
  [{ code: "literal output", filePath: "report.txt", inferLanguage: false }, true],
  [{ code: "A short setup prompt." }, true],
  [{ code: "# Setup\n\nUse the component below.", language: "markdown" }, true],
  [{ code: "plain output", filePath: "   " }, true],
  [{ code: "pnpm add @kamod-ch/ui", language: "bash", filePath: "Terminal" }, true],
  [{ code: "git status" }, true],
  [{ code: "git status", language: "text", filePath: "commands.txt", inferLanguage: false }, true],
  [{ code: "npm run build", language: "typescript", filePath: "build.ts" }, true],
  [{ code: "./deploy", filePath: "scripts/deploy.sh" }, true],
  [{ code: "./deploy", filePath: "scripts/deploy.ps1", language: "text" }, true],
  [{ code: "./deploy", filePath: "scripts/deploy.cmd" }, true],
  [{ code: "custom-tool deploy", language: "terminal", filePath: "deploy.txt" }, true],
  [{ code: "custom-tool deploy", language: "language-powershell", filePath: "deploy.txt" }, true],
  [{ code: "$ custom-tool deploy", filePath: "commands.txt" }, true],
  [{ code: "const enabled = true;", showWrapControl: false }, false],
] as const)("allows wrapping in every language: %j", (props, expected) => {
  const view = render(<Code {...props} />);
  expect(Boolean(view.queryByRole("switch", { name: "Wrap code lines" }))).toBe(expected);
  expect(Boolean(view.container.querySelector(".docs-code-actions"))).toBe(expected);
  expect(view.container.querySelector("pre code")?.textContent).toBe(props.code);
});

it("updates control eligibility with the source while retaining fixed wrapping and Copy", () => {
  const view = render(<Code code="const enabled = true;" defaultWrapped />);
  expect(view.getByRole("switch", { name: "Wrap code lines" })).toBeChecked();
  view.rerender(<Code code="git status" filePath="Terminal" defaultWrapped />);
  expect(view.getByRole("switch")).toBeChecked();
  expect(view.container.querySelector(".docs-code-actions")).not.toBeNull();
  expect(view.container.querySelector(".kamod-code")).toHaveClass("is-wrapped");
  expect(view.getByRole("button", { name: "Copy code" })).toBeVisible();
  view.rerender(<Code code="const enabled = true;" defaultWrapped />);
  expect(view.getByRole("switch", { name: "Wrap code lines" })).toBeChecked();
});
