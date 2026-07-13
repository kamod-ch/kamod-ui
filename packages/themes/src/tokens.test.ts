import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { THEME_PRESETS } from "./index";

describe("brand token CSS", () => {
  it("contains a light and dark selector for every exported brand", () => {
    const brandsDir = join(process.cwd(), "src/brands");
    const cssByFile = new Map(
      readdirSync(brandsDir)
        .filter((file) => file.endsWith(".css"))
        .map((file) => [file, readFileSync(join(brandsDir, file), "utf8")]),
    );

    for (const preset of THEME_PRESETS) {
      const css = cssByFile.get(`${preset.id}.css`) ?? "";
      expect(css, `${preset.id} light selector`).toContain(`data-theme="${preset.id}"`);
      expect(css, `${preset.id} dark selector`).toContain(`.dark[data-theme="${preset.id}"]`);
    }
  });
});
