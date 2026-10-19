/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render } from "@testing-library/preact";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { MarkdownDownloadButton } from "./MarkdownDownloadButton";

const createObjectURL = vi.fn((_blob: Blob) => "blob:prompt-download");
const revokeObjectURL = vi.fn();
beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("URL", { createObjectURL, revokeObjectURL });
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});
const advance = async (milliseconds: number) => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(milliseconds);
  });
};

it("downloads exact UTF-8 Markdown on demand and resets without replacing icons or duplicating files", async () => {
  const markdown = "  # A prompt — Ω\n\n```tsx\nconst example = 1;\n```\n";
  const view = render(
    <MarkdownDownloadButton markdown={markdown} fileName="example-setup-prompt.md" />,
  );
  const button = view.getByRole("button", { name: "Download Markdown" });
  const icons = [...button.querySelectorAll("svg")];
  expect(createObjectURL).not.toHaveBeenCalled();
  vi.mocked(HTMLAnchorElement.prototype.click).mockImplementation(function (
    this: HTMLAnchorElement,
  ) {
    expect(this.href).toBe("blob:prompt-download");
    expect(this.download).toBe("example-setup-prompt.md");
    expect(this.isConnected).toBe(true);
  });
  fireEvent.click(button);
  fireEvent.click(button);
  expect(createObjectURL).toHaveBeenCalledTimes(1);
  const blob = createObjectURL.mock.calls[0][0] as Blob;
  expect(blob.type).toBe("text/markdown;charset=utf-8");
  expect(blob.size).toBe(new TextEncoder().encode(markdown).length);
  expect(document.querySelector("a[download]")).toBeNull();
  expect(button).toHaveAttribute("data-download-state", "loading");
  expect(button).toHaveAttribute("aria-busy", "true");
  await advance(600);
  expect(button).toHaveAttribute("data-download-state", "complete");
  expect(view.getByRole("status")).toHaveTextContent(
    "Markdown file sent to your browser's downloads.",
  );
  fireEvent.click(button);
  expect(createObjectURL).toHaveBeenCalledTimes(1);
  expect(revokeObjectURL).not.toHaveBeenCalled();
  await advance(1500);
  expect(button).toHaveAttribute("data-download-state", "resetting");
  expect(revokeObjectURL).toHaveBeenCalledExactlyOnceWith("blob:prompt-download");
  await advance(200);
  expect(button).toHaveAttribute("data-download-state", "idle");
  expect(button).not.toHaveAttribute("aria-disabled");
  icons.forEach((icon, index) => expect(button.querySelectorAll("svg")[index]).toBe(icon));
  expect(view.getByRole("status").textContent).toBe("");
});

it.each(["replace", "unmount"])(
  "releases the URL and cancels all feedback on %s",
  async (action) => {
    const view = render(<MarkdownDownloadButton markdown="first" fileName="first.md" />);
    fireEvent.click(view.getByRole("button"));
    await advance(600);
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    if (action === "replace")
      view.rerender(<MarkdownDownloadButton markdown="second" fileName="second.md" />);
    else view.unmount();
    expect(revokeObjectURL).toHaveBeenCalledExactlyOnceWith("blob:prompt-download");
    expect(vi.getTimerCount()).toBe(0);
    if (action === "replace")
      expect(view.getByRole("button")).toHaveAttribute("data-download-state", "idle");
  },
);

it("cleans up failed handoffs and offers an accessible retry", () => {
  vi.mocked(HTMLAnchorElement.prototype.click).mockImplementationOnce(() => {
    throw new Error("blocked");
  });
  const view = render(<MarkdownDownloadButton markdown="# Prompt" fileName="prompt.md" />);
  fireEvent.click(view.getByRole("button"));
  const retry = view.getByRole("button", { name: "Retry downloading Markdown" });
  expect(retry).toHaveAttribute("aria-describedby", view.getByRole("status").id);
  expect(revokeObjectURL).toHaveBeenCalledTimes(1);
  expect(document.querySelector("a[download]")).toBeNull();
  expect(vi.getTimerCount()).toBe(0);
  fireEvent.click(retry);
  expect(retry).toHaveAttribute("data-download-state", "loading");
  expect(createObjectURL).toHaveBeenCalledTimes(2);
});
