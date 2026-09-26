import { describe, expect, it } from "vitest";
import { truncateCopyFieldValue } from "./copy-field-utils";

describe("truncateCopyFieldValue", () => {
  it("truncates in the middle for long ids", () => {
    expect(truncateCopyFieldValue("abcdefghijklmnop", 10, "middle")).toBe("abcde…mnop");
  });

  it("returns the original value when below the limit", () => {
    expect(truncateCopyFieldValue("short", 20, "middle")).toBe("short");
  });
});
