import { act, fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import * as copyModule from "../copyable/copy-to-clipboard";
import { CopyField } from "./CopyField";

describe("CopyField", () => {
  it("copies the full original value when display is truncated", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(
      <CopyField
        id="token"
        label="API token"
        value="sk-live-0123456789abcdefghijklmnopqrstuvwxyz"
        maxDisplayLength={20}
        truncate="middle"
        copyLabel="Copy token"
        copiedLabel="Token copied"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Copy token" }));
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("sk-live-0123456789abcdefghijklmnopqrstuvwxyz");
    });
    expect(screen.getByRole("button", { name: "Token copied" })).toBeInTheDocument();
  });

  it("selects the field for manual copy when clipboard fails", async () => {
    vi.spyOn(copyModule, "copyTextToClipboard").mockResolvedValue({
      ok: false,
      reason: "unsupported",
      message: "Clipboard unavailable",
    });
    const select = vi.spyOn(HTMLInputElement.prototype, "select");

    render(
      <CopyField id="manual-copy" value="https://example.com/path?query=1" copyLabel="Copy URL" />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Copy URL" }));
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Clipboard unavailable");
    });
    expect(select).toHaveBeenCalled();
  });
});
