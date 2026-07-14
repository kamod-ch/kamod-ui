import { describe, expect, it } from "vitest";
import { sanitizeJsonPayload, sanitizeOpenUILang } from "./sanitize";

describe("sanitizeOpenUILang", () => {
  it("strips markdown fences", () => {
    const raw = '```lang\nroot = Stack([a], "md")\n```';
    expect(sanitizeOpenUILang(raw)).toBe('root = Stack([a], "md")');
  });

  it("trims plain lang", () => {
    expect(sanitizeOpenUILang("  root = Card([])\n")).toBe("root = Card([])");
  });
});

describe("sanitizeJsonPayload", () => {
  it("extracts the first JSON object", () => {
    const raw = 'Sure.\n```json\n{ "layout": "stack", "blocks": [] }\n```\n';
    expect(JSON.parse(sanitizeJsonPayload(raw))).toEqual({ layout: "stack", blocks: [] });
  });
});
