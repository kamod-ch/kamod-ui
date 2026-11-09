import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
// @ts-expect-error — route section helper is a checked-in .mjs script without package exports
import { collectSectionIds } from "../../scripts/docs-route-section-ids.mjs";

const pagesDir = resolve(import.meta.dirname, "pages");

describe("docs route section ids", () => {
  it("does not treat checkbox table row ids as section routes", () => {
    const source = readFileSync(resolve(pagesDir, "checkbox-doc.tsx"), "utf8");
    const ids = collectSectionIds(source, "checkbox-doc.tsx");
    expect(ids).toContain("checkbox-table");
    for (const personId of ["1", "2", "3", "4"]) {
      expect(ids, `demo person id ${personId}`).not.toContain(personId);
    }
  });

  it("keeps formisch guide sections from the page structure", () => {
    const source = readFileSync(resolve(pagesDir, "formisch-doc.tsx"), "utf8");
    const ids = collectSectionIds(source, "formisch-doc.tsx");
    expect(ids).toEqual(expect.arrayContaining(["demo", "approach"]));
  });

  it("merges icons-next-steps and ui-motion example section ids", () => {
    const icons = collectSectionIds(
      readFileSync(resolve(pagesDir, "icons-package-doc.tsx"), "utf8"),
      "icons-package-doc.tsx",
    );
    expect(icons).toContain("icons-next-steps");

    const motion = collectSectionIds(
      readFileSync(resolve(pagesDir, "ui-motion-doc.tsx"), "utf8"),
      "ui-motion-doc.tsx",
    );
    expect(motion).toEqual(expect.arrayContaining(["dialog", "reduced-motion"]));
  });
});
