/** @vitest-environment jsdom */
import { cleanup, render, waitFor } from "@testing-library/preact";
import renderToString from "preact-render-to-string";
import { afterEach, expect, it, vi } from "vitest";
import PromptMarkdown from "./PromptMarkdown";
import { renderPromptMarkdown } from "./prompt-markdown";

vi.mock("./prompt-markdown", () => ({
  renderPromptMarkdown: vi.fn((prompt: string) => `<p>${prompt}</p>`),
}));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
const pendingContent = <p role="status">Formatting your prompt</p>;

it("renders pending feedback before the client formats an uncached prompt", () => {
  const html = renderToString(
    <PromptMarkdown prompt="First paint" pendingContent={pendingContent} />,
  );
  expect(html).toContain("Formatting your prompt");
  expect(html).not.toContain("blocks-prompt-rendered");
  expect(renderPromptMarkdown).not.toHaveBeenCalled();
});

it("reuses the latest formatted prompt across display switches without parsing it again", async () => {
  const view = render(<PromptMarkdown prompt="Cached brief" pendingContent={pendingContent} />);
  await waitFor(() => expect(view.getByRole("region")).toHaveTextContent("Cached brief"));
  expect(renderPromptMarkdown).toHaveBeenCalledOnce();
  view.unmount();
  const next = render(<PromptMarkdown prompt="Cached brief" pendingContent={pendingContent} />);
  expect(next.getByRole("region")).toHaveTextContent("Cached brief");
  expect(next.queryByRole("status")).toBeNull();
  expect(renderPromptMarkdown).toHaveBeenCalledOnce();
});

it("binds the rendered document to its prompt and keeps a different brief pending", async () => {
  const view = render(<PromptMarkdown prompt="Initial brief" pendingContent={pendingContent} />);
  await waitFor(() => expect(view.getByRole("region")).toHaveTextContent("Initial brief"));
  const html = renderToString(
    <PromptMarkdown prompt="Changed brief" pendingContent={pendingContent} />,
  );
  expect(html).toContain("Formatting your prompt");
  expect(html).not.toContain("Initial brief");
  view.rerender(<PromptMarkdown prompt="Changed brief" pendingContent={pendingContent} />);
  await waitFor(() => expect(view.getByRole("region")).toHaveTextContent("Changed brief"));
  expect(view.getByRole("region")).not.toHaveTextContent("Initial brief");
  expect(renderPromptMarkdown).toHaveBeenCalledTimes(2);
});
