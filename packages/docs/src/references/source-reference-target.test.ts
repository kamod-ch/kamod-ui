/** @vitest-environment jsdom */
import { afterEach, expect, it, vi } from "vitest";
import { connectTooltips } from "../layout/tooltips/connect-tooltips";
import { sourceReferenceHelp } from "./source-reference-target";

afterEach(() => {
  document.body.replaceChildren();
  vi.useRealTimers();
});

function source() {
  const link = document.createElement("a");
  link.className = "kamod-code-reference";
  link.href = "/docs/direction/installation#api-reference";
  link.dataset.codeModule = "@kamod-ch/ui/direction";
  link.dataset.codeImported = "DirectionProvider";
  link.dataset.codeLocal = "LocaleProvider";
  link.textContent = "LocaleProvider";
  document.body.append(link);
  return link;
}
function hover(link: HTMLElement) {
  const event = new Event("pointerover", { bubbles: true });
  Object.defineProperty(event, "pointerType", { value: "mouse" });
  link.dispatchEvent(event);
}

it("retains original module/export context for aliases without reading source or styling", () => {
  const link = source();
  expect(sourceReferenceHelp(link)).toEqual({
    label: "LocaleProvider",
    href: "/docs/direction/installation#api-reference",
    module: "@kamod-ch/ui/direction",
    imported: "DirectionProvider",
    local: "LocaleProvider",
    filePath: undefined,
  });
  expect(sourceReferenceHelp(document.createElement("code"))).toBeUndefined();
});

it("requires a deliberate 800ms hover, cancels flybys and clears changed source", async () => {
  vi.useFakeTimers();
  const link = source();
  const change = vi.fn();
  const stop = connectTooltips(document, change);
  try {
    hover(link);
    vi.advanceTimersByTime(300);
    link.dispatchEvent(new Event("pointerout", { bubbles: true }));
    vi.advanceTimersByTime(1000);
    expect(change.mock.calls.some(([hint]) => hint?.source)).toBe(false);
    hover(link);
    vi.advanceTimersByTime(799);
    expect(change.mock.calls.some(([hint]) => hint?.source)).toBe(false);
    vi.advanceTimersByTime(1);
    expect(change).toHaveBeenLastCalledWith(
      expect.objectContaining({ source: sourceReferenceHelp(link) }),
    );
    link.textContent = "Updated source";
    await Promise.resolve();
    expect(change).toHaveBeenLastCalledWith(null);
  } finally {
    stop();
  }
});

it("opens on keyboard focus, preserves native link activation and cancels pending work on teardown", () => {
  vi.useFakeTimers();
  const link = source();
  const change = vi.fn();
  const stop = connectTooltips(document, change);
  link.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
  expect(change).toHaveBeenLastCalledWith(
    expect.objectContaining({ source: sourceReferenceHelp(link) }),
  );
  const enter = new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true });
  link.dispatchEvent(enter);
  expect(enter.defaultPrevented).toBe(false);
  link.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  hover(link);
  stop();
  change.mockClear();
  vi.advanceTimersByTime(1000);
  expect(change).not.toHaveBeenCalled();
});
