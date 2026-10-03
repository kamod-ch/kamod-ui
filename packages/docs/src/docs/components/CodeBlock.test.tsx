/** @vitest-environment jsdom */
import { act, cleanup, render, waitFor } from "@testing-library/preact";
import { afterEach, expect, it, vi } from "vitest";
import { CodeBlock } from "./CodeBlock";
import { highlightCode } from "./highlight-code";

vi.mock("./highlight-code", () => ({
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
