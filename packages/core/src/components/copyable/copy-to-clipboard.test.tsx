import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { copyTextToClipboard } from "./copy-to-clipboard";

describe("copyTextToClipboard", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("uses the clipboard API in the browser", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    const result = await copyTextToClipboard("exact-value");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.method).toBe("clipboard-api");
    }
    expect(writeText).toHaveBeenCalledWith("exact-value");
  });

  it("preserves multiline text", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    const multiline = "line-one\nline-two";
    await copyTextToClipboard(multiline);
    expect(writeText).toHaveBeenCalledWith(multiline);
  });

  it("falls back to execCommand when clipboard API fails", async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error("denied")),
      },
    });
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: execCommand,
    });

    const result = await copyTextToClipboard("fallback");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.method).toBe("exec-command");
    }
    expect(execCommand).toHaveBeenCalledWith("copy");
  });

  it("returns a failure result when no clipboard strategy works", async () => {
    Object.assign(navigator, { clipboard: undefined });
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: vi.fn().mockReturnValue(false),
    });

    const result = await copyTextToClipboard("blocked");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("unsupported");
    }
  });
});
