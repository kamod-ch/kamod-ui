import type { CopyToClipboardResult } from "./copyable-types";

const isBrowser = () => typeof document !== "undefined";

export const copyTextToClipboard = async (text: string): Promise<CopyToClipboardResult> => {
  if (!isBrowser()) {
    return {
      ok: false,
      reason: "unsupported",
      message: "Clipboard is only available in the browser.",
    };
  }

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return { ok: true, method: "clipboard-api" };
    } catch {
      // Fall through to execCommand when permission is denied or the API fails.
    }
  }

  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    area.style.opacity = "0";
    document.body.append(area);
    area.focus();
    area.select();
    area.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    area.remove();
    if (ok) {
      return { ok: true, method: "exec-command" };
    }
  } catch {
    // Fall through to failure result.
  }

  return {
    ok: false,
    reason: navigator.clipboard ? "denied" : "unsupported",
    message: "Copy failed. Select the text and copy manually.",
  };
};
