/** Prefer the asynchronous API; retain the legacy fallback without leaking temporary DOM. */
export async function writeClipboard(value: string): Promise<void> {
  let failure: unknown = new Error(
    "Clipboard access is unavailable. Select and copy the source manually.",
  );
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }
  } catch (error) {
    failure = error;
  }
  if (typeof document === "undefined" || typeof document.execCommand !== "function") throw failure;
  const focused = document.activeElement;
  const selection = document.getSelection();
  const ranges = selection
    ? Array.from({ length: selection.rangeCount }, (_, i) => selection.getRangeAt(i).cloneRange())
    : [];
  const area = document.createElement("textarea");
  area.value = value;
  area.readOnly = true;
  area.style.cssText = "position:fixed;opacity:0;pointer-events:none";
  try {
    document.body.append(area);
    area.select();
    if (!document.execCommand("copy")) throw failure;
  } finally {
    area.remove();
    if (focused instanceof HTMLElement) focused.focus({ preventScroll: true });
    selection?.removeAllRanges();
    ranges.forEach((range) => selection?.addRange(range));
  }
}
