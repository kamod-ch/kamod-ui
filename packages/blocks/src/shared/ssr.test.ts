import { describe, expect, it, vi } from "vitest";
import { canUseDOM, isEditableTarget, onClient, prefersReducedMotion } from "./ssr";

describe("ssr helpers", () => {
  it("sees a DOM in the jsdom test environment", () => {
    expect(canUseDOM()).toBe(true);
    expect(onClient(() => "browser", "server")).toBe("browser");
  });

  it("returns the fallback when the client reader throws", () => {
    expect(
      onClient(() => {
        throw new Error("blocked");
      }, "fallback"),
    ).toBe("fallback");
  });

  it("treats form controls and contenteditable as editable targets", () => {
    const input = document.createElement("input");
    const textarea = document.createElement("textarea");
    const select = document.createElement("select");
    const div = document.createElement("div");
    const editable = document.createElement("div");
    editable.setAttribute("contenteditable", "true");
    expect(isEditableTarget(input)).toBe(true);
    expect(isEditableTarget(textarea)).toBe(true);
    expect(isEditableTarget(select)).toBe(true);
    expect(isEditableTarget(div)).toBe(false);
    expect(isEditableTarget(editable)).toBe(true);
    expect(isEditableTarget(null)).toBe(false);
  });

  it("reads prefers-reduced-motion from matchMedia when available", () => {
    const matchMedia = vi.fn().mockReturnValue({ matches: true });
    const original = window.matchMedia;
    Object.defineProperty(window, "matchMedia", { configurable: true, value: matchMedia });
    expect(prefersReducedMotion()).toBe(true);
    expect(matchMedia).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)");
    Object.defineProperty(window, "matchMedia", { configurable: true, value: original });
  });
});
