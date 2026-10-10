/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render, waitFor } from "@testing-library/preact";
import { afterEach, expect, it, vi } from "vitest";
import { CopyButton } from "./CopyButton";
import { writeClipboard } from "./write-clipboard";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it("copies exact text, announces success, and resets the shared feedback", async () => {
  vi.useFakeTimers();
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal("navigator", { clipboard: { writeText } });
  const onCopy = vi.fn();
  const view = render(
    <CopyButton value={"  source\n"} label="Copy source" subject="source" onCopy={onCopy} />,
  );
  await act(async () => {
    fireEvent.click(view.getByRole("button", { name: "Copy source" }));
    await vi.advanceTimersByTimeAsync(0);
  });
  expect(writeText).toHaveBeenCalledExactlyOnceWith("  source\n");
  expect(onCopy).toHaveBeenCalledExactlyOnceWith("  source\n");
  expect(view.getByRole("button", { name: "Source copied" })).toHaveAttribute(
    "data-copy-state",
    "copied",
  );
  expect(view.getByRole("status")).toHaveTextContent("Source copied to clipboard.");
  act(() => {
    vi.advanceTimersByTime(1500);
  });
  expect(view.getByRole("button", { name: "Copy source" })).toHaveAttribute(
    "data-copy-state",
    "idle",
  );
  expect(view.getByRole("status").textContent).toBe("");
});

it("prevents duplicate writes while a composed control is still pending", async () => {
  let finish!: () => void;
  const writeText = vi.fn(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
  );
  vi.stubGlobal("navigator", { clipboard: { writeText } });
  const view = render(
    <CopyButton
      value="once"
      renderControl={({ copy, defaultControl }) => (
        <div
          onDblClick={() => {
            void copy();
            void copy();
          }}
        >
          {defaultControl}
        </div>
      )}
    />,
  );
  fireEvent.dblClick(view.container.firstElementChild!);
  expect(writeText).toHaveBeenCalledTimes(1);
  expect(view.getByRole("button")).toHaveAttribute("aria-disabled", "true");
  await act(async () => finish());
  await waitFor(() => expect(view.getByRole("button")).not.toBeDisabled());
});

it("retains accessible feedback for icon-only actions and retries failures", async () => {
  const writeText = vi.fn().mockRejectedValueOnce(new Error("denied")).mockResolvedValue(undefined);
  vi.stubGlobal("navigator", { clipboard: { writeText } });
  const view = render(
    <CopyButton value="123" aria-label="Copy payment ID" subject="payment ID" iconOnly />,
  );
  fireEvent.click(view.getByRole("button", { name: "Copy payment ID" }));
  const retry = await view.findByRole("button", { name: "Retry copying payment ID" });
  expect(retry).toHaveAttribute("aria-describedby", view.getByRole("status").id);
  expect(retry.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  fireEvent.click(retry);
  await waitFor(() =>
    expect(view.getByRole("status")).toHaveTextContent("Payment ID copied to clipboard."),
  );
});

it.each(["replace", "unmount"])("ignores a pending write after %s", async (action) => {
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
  const view = render(<CopyButton value="first" onCopy={onCopy} />);
  fireEvent.click(view.getByRole("button"));
  if (action === "replace") view.rerender(<CopyButton value="second" onCopy={onCopy} />);
  else view.unmount();
  await act(async () => finish());
  expect(onCopy).not.toHaveBeenCalled();
});

it("cleans the legacy fallback and restores focus even when copying throws", async () => {
  vi.stubGlobal("navigator", {});
  const view = render(<input aria-label="Draft" defaultValue="keep editing" />);
  const input = view.getByRole("textbox");
  input.focus();
  Object.defineProperty(document, "execCommand", {
    configurable: true,
    value: vi.fn(() => {
      throw new Error("blocked");
    }),
  });
  try {
    await expect(writeClipboard("text")).rejects.toThrow("blocked");
    expect(document.querySelector("textarea")).toBeNull();
    expect(document.activeElement).toBe(input);
  } finally {
    delete (document as Partial<Document>).execCommand;
  }
});

it("clears the reset timer when an action unmounts", async () => {
  vi.useFakeTimers();
  vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
  const view = render(<CopyButton value="text" />);
  await act(async () => {
    fireEvent.click(view.getByRole("button"));
    await vi.advanceTimersByTimeAsync(0);
  });
  expect(vi.getTimerCount()).toBeGreaterThan(0);
  view.unmount();
  expect(vi.getTimerCount()).toBe(0);
});
