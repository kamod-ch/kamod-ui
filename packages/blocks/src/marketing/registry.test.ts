import { describe, expect, it } from "vitest";
import { marketingBlocks, marketingBlocksById } from "./registry";

describe("marketing blocks registry", () => {
  it("registers all 14 marketing blocks with unique ids", () => {
    expect(marketingBlocks).toHaveLength(14);
    const ids = marketingBlocks.map((block) => block.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([
      "bento-01",
      "contact-01",
      "contact-us",
      "cta-01",
      "faq-01",
      "features-01",
      "footer-01",
      "header-01",
      "hero-01",
      "logos-01",
      "logos-02",
      "logos-03",
      "pricing-01",
      "testimonials-01",
    ]);

    for (const block of marketingBlocks) {
      expect(block.component).toBeTypeOf("function");
      expect(block.category).toBe("marketing");
      expect(block.source).toBe("uipkge");
      expect(block.installCommand).toBe(`@kamod-ch/blocks/marketing/${block.id}`);
      expect(block.files.length).toBeGreaterThan(0);
      expect(marketingBlocksById[block.id]).toBe(block);
    }
  });
});
