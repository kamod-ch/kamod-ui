import { describe, expect, it } from "vitest";
import {
  mergeTagIntoList,
  normalizeTagValue,
  splitPastedTagValues,
  validateTagCandidate,
} from "./tag-input-utils";

describe("tag-input utils", () => {
  it("normalizes whitespace at edges and internally", () => {
    expect(normalizeTagValue("  hello   world  ")).toBe("hello world");
  });

  it("rejects duplicate tags by default", () => {
    const tags = [{ id: "1", value: "alpha" }];
    const result = mergeTagIntoList(tags, "Alpha", "reject");
    expect(result.rejected).toBe(true);
    expect(result.tags).toHaveLength(1);
  });

  it("replaces duplicate tags when policy is replace", () => {
    const tags = [
      { id: "1", value: "alpha" },
      { id: "2", value: "beta" },
    ];
    const result = mergeTagIntoList(tags, "alpha", "replace");
    expect(result.rejected).toBeUndefined();
    expect(result.tags.map((tag) => tag.value)).toEqual(["beta", "alpha"]);
  });

  it("validates max length and max tags", () => {
    expect(validateTagCandidate("abcd", [], { maxTagLength: 3 })).toMatch(/at most 3/);
    expect(validateTagCandidate("ok", [{ id: "1", value: "a" }], { maxTags: 1 })).toMatch(
      /Maximum of 1/,
    );
  });

  it("splits pasted values on newlines and configured separators", () => {
    expect(splitPastedTagValues("a,b\nc", [",", "Enter"])).toEqual(["a", "b", "c"]);
    expect(splitPastedTagValues("a,b", ["Enter"])).toEqual(["a,b"]);
  });
});
