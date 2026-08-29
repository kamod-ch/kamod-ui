import { describe, expect, it } from "vitest";
import { isSelectKey, moveFocusedDateKey } from "./keyboard";

describe("event-calendar keyboard", () => {
  it("moves by day, week, and month", () => {
    expect(moveFocusedDateKey("2026-08-14", "ArrowLeft", 1)).toBe("2026-08-13");
    expect(moveFocusedDateKey("2026-08-14", "ArrowRight", 1)).toBe("2026-08-15");
    expect(moveFocusedDateKey("2026-08-14", "ArrowUp", 1)).toBe("2026-08-07");
    expect(moveFocusedDateKey("2026-08-14", "ArrowDown", 1)).toBe("2026-08-21");
    expect(moveFocusedDateKey("2026-08-14", "Home", 1)).toBe("2026-08-10");
    expect(moveFocusedDateKey("2026-08-14", "End", 1)).toBe("2026-08-16");
    expect(moveFocusedDateKey("2026-08-14", "PageUp", 1)).toBe("2026-07-14");
    expect(moveFocusedDateKey("2026-08-14", "PageDown", 1)).toBe("2026-09-14");
    expect(moveFocusedDateKey("2026-08-14", "Tab", 1)).toBeNull();
  });

  it("treats Enter and Space as select keys", () => {
    expect(isSelectKey("Enter")).toBe(true);
    expect(isSelectKey(" ")).toBe(true);
    expect(isSelectKey("a")).toBe(false);
  });
});
