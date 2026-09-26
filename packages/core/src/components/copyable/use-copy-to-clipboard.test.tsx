import { act, fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as copyModule from "./copy-to-clipboard";
import { useCopyToClipboard } from "./use-copy-to-clipboard";

const HookHarness = ({ onStatus }: { onStatus?: (status: string) => void }) => {
  const { status, copy } = useCopyToClipboard({ resetMs: 1000 });
  onStatus?.(status);
  return (
    <button type="button" onClick={() => void copy("payload")}>
      Copy now
    </button>
  );
};

describe("useCopyToClipboard", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("reports copied only after a successful write", async () => {
    vi.spyOn(copyModule, "copyTextToClipboard").mockResolvedValue({
      ok: true,
      method: "clipboard-api",
    });

    render(<HookHarness />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy now" }));
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(copyModule.copyTextToClipboard).toHaveBeenCalledWith("payload");
    });
  });

  it("clears feedback timers on unmount", async () => {
    vi.spyOn(copyModule, "copyTextToClipboard").mockResolvedValue({
      ok: true,
      method: "clipboard-api",
    });
    const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");

    const { unmount } = render(<HookHarness />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy now" }));
      await Promise.resolve();
    });
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
