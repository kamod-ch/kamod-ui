import { describe, expect, it } from "vitest";
import { actionSchema } from "./action";
import { checkChildrenLimit, resolveSecurityPolicy } from "./limits";

describe("security limits", () => {
  it("resolves defaults", () => {
    const policy = resolveSecurityPolicy();
    expect(policy.maxTreeDepth).toBe(12);
    expect(policy.maxChildrenPerNode).toBe(50);
    expect(policy.maxTotalNodes).toBe(300);
  });

  it("detects oversized children arrays", () => {
    const policy = resolveSecurityPolicy({ maxChildrenPerNode: 2 });
    expect(checkChildrenLimit([1, 2, 3], policy)?.code).toBe("max_children");
    expect(checkChildrenLimit([1, 2], policy)).toBeNull();
  });
});

describe("action schema", () => {
  it("accepts navigate and event actions", () => {
    expect(actionSchema.parse({ type: "navigate", target: "/home" }).type).toBe("navigate");
    expect(actionSchema.parse({ type: "event", name: "save", payload: { ok: true } }).type).toBe(
      "event",
    );
  });

  it("rejects oversized names", () => {
    expect(() => actionSchema.parse({ type: "event", name: "x".repeat(200) })).toThrow();
  });
});
