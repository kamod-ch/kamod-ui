import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { applicationShellBlockMetadata } from "../../../../blocks/src/application-shell/metadata";
import { applicationShellSourceFiles } from "../application-shell-source";
import { blockSourceDestination, sourceFromManifest } from "../source-manifest";

const root = resolve(import.meta.dirname, "../../../../blocks");
describe("complete application shell source bundles", () => {
  for (const block of applicationShellBlockMetadata) {
    it(`${block.id} resolves all copied relative imports and ships both routes`, () => {
      const destinations = new Set(
        block.files.map((file) => resolve("/copy", blockSourceDestination(block, file))),
      );
      for (const file of block.files) {
        const source = sourceFromManifest(block.files, file.label, applicationShellSourceFiles);
        expect(source).toBe(readFileSync(resolve(root, file.path), "utf8"));
        const destination = resolve("/copy", blockSourceDestination(block, file));
        for (const match of source.matchAll(/(?:from\s+|import\s*)["'](\.[^"']+)["']/g)) {
          const base = resolve(dirname(destination), match[1].split("?")[0]);
          expect(
            [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`].some((path) =>
              destinations.has(path),
            ),
            `${file.label} needs ${match[1]}`,
          ).toBe(true);
        }
      }
      for (const route of ["index", "preview"]) {
        expect(
          existsSync(
            resolve(
              import.meta.dirname,
              `../../../blocks/application-shell/${block.id}/${route}.md`,
            ),
          ),
        ).toBe(true);
      }
    });
  }
});
