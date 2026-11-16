import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const themePath = join(dirname(fileURLToPath(import.meta.url)), "theme.css");
const theme = readFileSync(themePath, "utf8");

describe("theme.css Tailwind v4 entry", () => {
  it("scans the built package from the published stylesheet", () => {
    expect(theme).toContain('@source "../dist/**/*.js";');
  });

  it("defines the class-based dark variant", () => {
    expect(theme).toContain("@custom-variant dark (&:where(.dark, .dark *));");
  });
});
