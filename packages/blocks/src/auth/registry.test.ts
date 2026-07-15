import { describe, expect, it } from "vitest";
import { authBlocks, loginBlocks, signupBlocks } from "../index";

describe("auth blocks registry", () => {
  it("registers all login and signup blocks", () => {
    expect(loginBlocks).toHaveLength(5);
    expect(signupBlocks).toHaveLength(5);
    expect(authBlocks).toHaveLength(10);

    const ids = authBlocks.map((block) => block.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(
      expect.arrayContaining(["login-01", "login-02", "login-03", "login-04", "login-05"]),
    );
    expect(ids).toEqual(
      expect.arrayContaining(["signup-01", "signup-02", "signup-03", "signup-04", "signup-05"]),
    );

    for (const block of authBlocks) {
      expect(block.component).toBeTypeOf("function");
      expect(block.files.length).toBeGreaterThan(0);
      expect(block.files[0]?.kind).toBe("page");
    }
  });
});
