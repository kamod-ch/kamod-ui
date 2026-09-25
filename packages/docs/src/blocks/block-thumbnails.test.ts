import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { blockCategories } from "./block-categories";
import thumbnails from "./generated/block-thumbnails.json";

describe("generated block thumbnails", () => {
  it("covers exactly the visible registry variants", () => {
    const keys = Object.entries(blockCategories).flatMap(([category, { blocks }]) =>
      blocks.map((block) => `${category}/${block.id}`),
    );
    expect(Object.keys(thumbnails).sort()).toEqual(keys.sort());
  });

  it("ships both responsive sizes and schemes as small, valid WebP files", () => {
    for (const variants of Object.values(thumbnails)) {
      expect(Object.keys(variants).sort()).toEqual(["dark", "light"]);
      for (const images of Object.values(variants)) {
        expect(images.map((image) => image.width)).toEqual([480, 960]);
        for (const image of images) {
          expect(image.width / image.height).toBe(8 / 5);
          expect(image.src).toMatch(/^\/block-previews\/[a-z0-9-]+\.webp$/);
          const path = resolve(import.meta.dirname, "../../public", image.src.slice(1));
          expect(existsSync(path), image.src).toBe(true);
          const data = readFileSync(path);
          expect(data.toString("ascii", 0, 4)).toBe("RIFF");
          expect(data.toString("ascii", 8, 12)).toBe("WEBP");
          // Catch accidentally shipping full-resolution or unoptimized captures.
          expect(data.length, image.src).toBeLessThan(100 * 1024);
        }
      }
    }
  });
});
