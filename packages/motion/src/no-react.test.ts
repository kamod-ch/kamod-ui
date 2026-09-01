import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = dirname(fileURLToPath(import.meta.url));

function collectSourceFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(fullPath));
      continue;
    }
    if (
      /\.(ts|tsx)$/.test(entry.name) &&
      !entry.name.endsWith(".test.ts") &&
      !entry.name.endsWith(".test.tsx")
    ) {
      files.push(fullPath);
    }
  }
  return files;
}

const forbiddenImport = /\bfrom\s+["'](?:react(?:-dom(?:\/client)?)?|motion\/react)["']/;

describe("no React imports", () => {
  it("source files do not import react, react-dom, or motion/react", () => {
    const files = collectSourceFiles(root);
    const violations: string[] = [];

    for (const file of files) {
      const source = readFileSync(file, "utf8");
      if (forbiddenImport.test(source)) {
        violations.push(file.slice(root.length + 1));
      }
    }

    expect(violations).toEqual([]);
  });
});
