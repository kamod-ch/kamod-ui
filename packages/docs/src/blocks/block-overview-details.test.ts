import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import uiPackage from "../../../core/package.json";
import { type BlockCategory, blockCategories } from "./block-categories";
import { getBlockOverviewDetails } from "./block-overview-details";

describe("block overview details", () => {
  it("uses the display name while preserving the shell's actual source folder and guide anchor", () => {
    const details = getBlockOverviewDetails(
      "application-shell",
      blockCategories["application-shell"].blocks[0],
    );
    expect(details.displayName).toBe("Application Shell 1");
    expect(details.sourceUrl).toMatch(/application-shell\/application-shell-1$/);
    expect(details.installationId).toBe("application-shell-installation");
  });

  it("links every card to an existing source folder and includes direct dependencies and UI peers", () => {
    for (const [category, { blocks }] of Object.entries(blockCategories)) {
      for (const block of blocks) {
        const details = getBlockOverviewDetails(category as BlockCategory, block);
        expect(
          existsSync(resolve(import.meta.dirname, "../../../blocks/src", category, block.id)),
        ).toBe(true);
        expect(details.dependencies).toEqual(
          expect.arrayContaining([
            ...block.dependencies,
            ...Object.keys(uiPackage.peerDependencies),
          ]),
        );
        expect(new Set(details.dependencies).size).toBe(details.dependencies.length);
      }
    }
  });
});
