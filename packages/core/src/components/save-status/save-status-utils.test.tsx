import { describe, expect, it } from "vitest";
import { formatSaveStatusDateTime, resolveSaveStatusDisplay } from "./save-status-utils";

describe("save-status utils", () => {
  it("keeps dirty visible when unsaved changes exist despite saved status", () => {
    expect(resolveSaveStatusDisplay("saved", true)).toBe("dirty");
    expect(resolveSaveStatusDisplay("pristine", true)).toBe("dirty");
  });

  it("formats timestamps with fixed locale and timezone for SSR stability", () => {
    const formatted = formatSaveStatusDateTime("2026-08-14T10:15:00.000Z", {
      locale: "en-US",
      timeZone: "UTC",
      dateStyle: "medium",
      timeStyle: "short",
    });
    expect(formatted).toContain("2026");
    expect(formatted).toContain("10:15");
  });
});
