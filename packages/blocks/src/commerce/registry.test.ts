import { describe, expect, it } from "vitest";
import { commerceBlocks, commerceBlocksById } from "./registry";

describe("commerce blocks registry", () => {
  it("registers three commerce blocks with unique ids", () => {
    expect(commerceBlocks).toHaveLength(3);
    expect(commerceBlocks.map((block) => block.id)).toEqual([
      "payment-form",
      "saved-cards-list",
      "checkout-flow",
    ]);
    for (const block of commerceBlocks) {
      expect(block.component).toBeTypeOf("function");
      expect(block.category).toBe("commerce");
      expect(commerceBlocksById[block.id]).toBe(block);
    }
  });
});
