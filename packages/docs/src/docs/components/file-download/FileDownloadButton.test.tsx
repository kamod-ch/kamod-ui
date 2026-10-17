/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render } from "@testing-library/preact";
import renderToString from "preact-render-to-string";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { FileDownloadButton } from "./FileDownloadButton";

const createObjectURL = vi.fn((_blob: Blob) => "blob:code-download");
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

it("hands off exact original UTF-8 bytes, filename and MIME synchronously from activation", async () => {
  vi.useRealTimers();
  const source = '\uFEFF  const greeting = "Ω — 🪨";\r\n\t// keep spacing\r\n\u0000\n';
  const view = render(
    <FileDownloadButton
      source={source}
      fileName="greeting.ts"
      mimeType="text/typescript;charset=utf-8"
    />,
  );
  vi.mocked(HTMLAnchorElement.prototype.click).mockImplementation(function (
    this: HTMLAnchorElement,
  ) {
    expect(this.download).toBe("greeting.ts");
    expect(this.href).toBe("blob:code-download");
    expect(this.isConnected).toBe(true);
  });
  fireEvent.click(view.getByRole("button", { name: "Download code" }));
  expect(createObjectURL).toHaveBeenCalledOnce();
  const blob = createObjectURL.mock.calls[0][0];
  expect(blob.type).toBe("text/typescript;charset=utf-8");
  expect(document.querySelector("a[download]")).toBeNull();
  view.unmount();
  const bytes = await new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(blob);
  });
  expect(Array.from(new Uint8Array(bytes))).toEqual(Array.from(new TextEncoder().encode(source)));
  expect(revokeObjectURL).toHaveBeenCalledExactlyOnceWith("blob:code-download");
});

it("shares the existing feedback timings and persistent icons while suppressing repeated downloads", async () => {
  const view = render(<FileDownloadButton source="first" fileName="first.txt" />);
  const button = view.getByRole("button", { name: "Download code" });
  const icons = [...button.querySelectorAll("svg")];
  expect(button).toHaveAttribute("data-slot", "code-download");
  expect(button).toHaveClass("docs-file-download");
  expect(createObjectURL).not.toHaveBeenCalled();
  fireEvent.click(button);
  fireEvent.click(button);
  expect(createObjectURL).toHaveBeenCalledOnce();
  expect(createObjectURL.mock.calls[0][0].type).toBe("text/plain;charset=utf-8");
  expect(button).toHaveAttribute("data-download-state", "loading");
  expect(button).toHaveAttribute("aria-busy", "true");
  expect(button.querySelector(".docs-file-download-spinner")).not.toBeNull();
  await advance(600);
  expect(button).toHaveAttribute("data-download-state", "complete");
  expect(view.getByRole("status")).toHaveTextContent("code file sent to your browser's downloads.");
  fireEvent.click(button);
  expect(createObjectURL).toHaveBeenCalledOnce();
  expect(revokeObjectURL).not.toHaveBeenCalled();
  await advance(1500);
  expect(button).toHaveAttribute("data-download-state", "resetting");
  expect(revokeObjectURL).toHaveBeenCalledExactlyOnceWith("blob:code-download");
  await advance(200);
  expect(button).toHaveAttribute("data-download-state", "idle");
  expect(button).not.toHaveAttribute("aria-disabled");
  expect(view.getByRole("status").textContent).toBe("");
  icons.forEach((icon, index) => expect(button.querySelectorAll("svg")[index]).toBe(icon));
});

it.each([
  { source: "new source" },
  { fileName: "new-name.ts" },
  { mimeType: "text/javascript;charset=utf-8" },
])(
  "cancels stale feedback and releases a pending URL when file identity changes: %j",
  async (change) => {
    const initial = {
      source: "initial",
      fileName: "initial.ts",
      mimeType: "text/typescript;charset=utf-8",
    };
    const view = render(<FileDownloadButton {...initial} />);
    fireEvent.click(view.getByRole("button"));
    await advance(250);
    expect(vi.getTimerCount()).toBe(1);
    view.rerender(<FileDownloadButton {...initial} {...change} />);
    expect(revokeObjectURL).toHaveBeenCalledExactlyOnceWith("blob:code-download");
    expect(vi.getTimerCount()).toBe(0);
    expect(view.getByRole("button")).toHaveAttribute("data-download-state", "idle");
    await advance(2400);
    expect(view.getByRole("button")).toHaveAttribute("data-download-state", "idle");
    fireEvent.click(view.getByRole("button"));
    expect(createObjectURL).toHaveBeenCalledTimes(2);
    expect(createObjectURL.mock.calls[1][0].type).toBe(change.mimeType ?? initial.mimeType);
  },
);

it("cancels the loading timer and revokes its URL immediately on unmount", () => {
  const view = render(<FileDownloadButton source="content" fileName="snippet.txt" />);
  fireEvent.click(view.getByRole("button"));
  expect(vi.getTimerCount()).toBe(1);
  view.unmount();
  expect(vi.getTimerCount()).toBe(0);
  expect(revokeObjectURL).toHaveBeenCalledExactlyOnceWith("blob:code-download");
});

it.each(["allocation", "handoff"])("cleans a failed %s and offers an accessible retry", (stage) => {
  if (stage === "allocation")
    createObjectURL.mockImplementationOnce(() => {
      throw new Error("unsupported");
    });
  else
    vi.mocked(HTMLAnchorElement.prototype.click).mockImplementationOnce(() => {
      throw new Error("blocked");
    });
  const view = render(<FileDownloadButton source="content" fileName="snippet.txt" />);
  fireEvent.click(view.getByRole("button"));
  const retry = view.getByRole("button", { name: "Retry downloading code" });
  expect(retry).toHaveAttribute("aria-describedby", view.getByRole("status").id);
  expect(view.getByRole("status")).toHaveTextContent("copy the code instead");
  expect(document.querySelector("a[download]")).toBeNull();
  expect(vi.getTimerCount()).toBe(0);
  expect(revokeObjectURL).toHaveBeenCalledTimes(stage === "allocation" ? 0 : 1);
  fireEvent.click(retry);
  expect(retry).toHaveAttribute("data-download-state", "loading");
  expect(createObjectURL).toHaveBeenCalledTimes(2);
});

it("renders server markup without creating a file or scheduling browser work", () => {
  const html = renderToString(<FileDownloadButton source="source" fileName="snippet.txt" />);
  expect(html).toContain('data-slot="code-download"');
  expect(html).toContain('aria-label="Download code"');
  expect(createObjectURL).not.toHaveBeenCalled();
  expect(vi.getTimerCount()).toBe(0);
});
