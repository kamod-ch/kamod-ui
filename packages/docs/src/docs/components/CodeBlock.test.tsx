/** @vitest-environment jsdom */

import { highlightCode } from "@kamod-ch/ui/code/highlight";
import { act, cleanup, render, waitFor } from "@testing-library/preact";
import { afterEach, expect, it, vi } from "vitest";
import { CodeBlock } from "./CodeBlock";

vi.mock("@kamod-ch/ui/code/highlight", () => ({
  highlightCode: vi.fn(() => '<span class="token">highlighted</span>'),
}));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
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
  const { container } = render(<CodeBlock code={code} language="tsx" />);
  expect(container.querySelector("pre code")?.textContent).toBe(code);
  expect(highlightCode).not.toHaveBeenCalled();
  act(() =>
    notify([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver),
  );
  await waitFor(() => expect(container.querySelector(".token")).not.toBeNull());
  expect(highlightCode).toHaveBeenCalledWith(code, "tsx");
  expect(disconnect).toHaveBeenCalled();
});

it("does not parse plain text or a rendered document", () => {
  render(<CodeBlock code="plain text" language="text" />);
  render(<CodeBlock code="# Heading" language="markdown" renderedContent={<p>Heading</p>} />);
  expect(highlightCode).not.toHaveBeenCalled();
});

it("cancels pending highlighting when a code block unmounts", async () => {
  vi.stubGlobal("IntersectionObserver", undefined);
  const view = render(<CodeBlock code="const answer = 42" language="tsx" />);
  view.unmount();
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 20));
  });
  expect(highlightCode).not.toHaveBeenCalled();
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
  const { container } = render(<CodeBlock code={code} language={language} />);
  expect(container.querySelector(".docs-code-toolbar .docs-code-label")?.textContent).toBe(label);
  expect(container.querySelector("pre code")?.textContent).toBe(code);
});

it("preserves file and custom toolbar content without adding fallback labels", () => {
  const { container } = render(
    <>
      <CodeBlock code="const value = 1;" language="tsx" filePath="src/value.ts" />
      <CodeBlock code="Prompt" language="text" toolbarContent={<span>Setup Prompt</span>} />
      <CodeBlock
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
  const { fireEvent } = await import("@testing-library/preact");
  vi.stubGlobal("IntersectionObserver", undefined);
  const view = render(<CodeBlock code="const answer = 42" language="tsx" />);
  await waitFor(() => expect(view.container.querySelector(".token")).not.toBeNull());
  expect(highlightCode).toHaveBeenCalledTimes(1);
  const toggle = view.getByRole("switch", { name: "Wrap code lines" });
  fireEvent.click(toggle);
  fireEvent.click(toggle);
  expect(highlightCode).toHaveBeenCalledTimes(1);
});

it("infers unlabelled source and uses the inferred grammar in the visible label", async () => {
  vi.stubGlobal("IntersectionObserver", undefined);
  const source = "const enabled = true;";
  const { container } = render(<CodeBlock code={source} />);
  expect(container.querySelector("pre")).toHaveAttribute("data-language", "javascript");
  expect(container.querySelector(".docs-code-label")).toHaveTextContent("JavaScript");
  await waitFor(() => expect(highlightCode).toHaveBeenCalledWith(source, "javascript"));
});

it("uses file metadata for untyped snippets and resolves again when the source changes", async () => {
  vi.stubGlobal("IntersectionObserver", undefined);
  const view = render(
    <CodeBlock code="export const value = 1;" filePath="src/value.ts" language="text" />,
  );
  await waitFor(() =>
    expect(highlightCode).toHaveBeenCalledWith("export const value = 1;", "typescript"),
  );
  view.rerender(<CodeBlock code='{"value": 1}' language="text" />);
  await waitFor(() => expect(highlightCode).toHaveBeenLastCalledWith('{"value": 1}', "json"));
  expect(view.container.querySelector("pre")).toHaveAttribute("data-language", "json");
});

it("keeps intentionally literal views plain even when their content looks like code", () => {
  const source = "# Prompt\n\nconst answer = 42;";
  const { container } = render(<CodeBlock code={source} language="text" inferLanguage={false} />);
  expect(highlightCode).not.toHaveBeenCalled();
  expect(container.querySelector("pre")).toHaveAttribute("data-language", "text");
  expect(container.querySelector("pre code")).toHaveTextContent("# Prompt const answer = 42;");
});

it("links resolved languages in unnamed headers without inventing a filename", () => {
  const view = render(<CodeBlock code="export const value = 1;" language="ts" />);
  const link = view.getByRole("link", { name: "TypeScript" });
  expect(link).toHaveAttribute("href", "https://www.typescriptlang.org/");
  expect(link.closest("code")).not.toBeNull();
  expect(link.querySelectorAll("svg")).toHaveLength(2);
  expect(view.container.querySelector(".docs-code-file-path")).toBeNull();
  view.rerender(<CodeBlock code='{"value":1}' />);
  expect(view.getByRole("link", { name: "JSON" })).toHaveAttribute(
    "href",
    "/docs/code/installation#code-language-list",
  );
  expect(view.container.querySelector("pre")).toHaveAttribute("data-language", "json");
});
