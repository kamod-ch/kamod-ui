import { describe, expect, it } from "vitest";
import { catalogAuthBlocks, catalogAuthBlocksById } from "./catalog-registry";

describe("catalog auth blocks registry", () => {
  it("registers all 7 auth catalog blocks with unique ids", () => {
    expect(catalogAuthBlocks).toHaveLength(7);
    const ids = catalogAuthBlocks.map((block) => block.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([
      "auth-mfa",
      "auth-password-reset",
      "auth-sign-in",
      "auth-sign-up",
      "login-01",
      "login-02",
      "register-01",
    ]);

    for (const block of catalogAuthBlocks) {
      expect(block.component).toBeTypeOf("function");
      expect(block.category).toBe("auth");
      expect(block.source).toBe("uipkge");
      expect(block.installCommand).toBe(`@kamod-ch/blocks/auth/${block.id}`);
      expect(block.files.length).toBeGreaterThan(0);
      expect(catalogAuthBlocksById[block.id]).toBe(block);
    }
  });
});
