/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  recordShown,
  STAR_INVITATION_COOLDOWN_MS,
  STAR_INVITATION_STORAGE_KEY,
  shouldShowInvitation,
} from "./storage";

describe("star invitation storage", () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("allows the first display and enforces the cooldown", () => {
    const now = 1_700_000_000_000;
    expect(shouldShowInvitation(now, null)).toBe(true);
    recordShown(now);
    expect(localStorage.getItem(STAR_INVITATION_STORAGE_KEY)).toBe(String(now));
    expect(shouldShowInvitation(now + 1_000, now)).toBe(false);
    expect(shouldShowInvitation(now + STAR_INVITATION_COOLDOWN_MS, now)).toBe(true);
  });

  it("treats future timestamps as eligible and ignores corrupt values", () => {
    expect(shouldShowInvitation(1000, 5000)).toBe(true);
    expect(shouldShowInvitation(1000, Number.NaN)).toBe(true);
  });

  it("fails open to session-only when storage writes are blocked", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(recordShown()).toBe(false);
  });
});
