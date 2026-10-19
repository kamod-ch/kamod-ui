import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { expect, it } from "vitest";
import type { CodeReferenceHelpSection } from "../types";
import { packageProfileNames, savedPackageProfile } from "./package-profiles";
import { savedPackageRoots } from "./packages";

const expectedRepositories: Record<string, string> = {
  "@kamod-ch/ui": "kamod-ui",
  "@kamod-ch/hooks": "kamod-hooks",
  "@kamod-ch/preactpress": "preactpress",
  "@kamod-ch/signals": "kamod-signals",
  "@kamod-ch/icons": "kamod-icons",
};

it("uses the same saved root package and repository for package subpaths", () => {
  expect([...packageProfileNames].sort()).toEqual(Object.keys(expectedRepositories).sort());
  expect([...packageProfileNames].sort()).toEqual([...savedPackageRoots].sort());
  for (const [name, repository] of Object.entries(expectedRepositories)) {
    const profile = savedPackageProfile(name)!;
    expect(profile.name).toBe(name);
    expect(profile.source?.href).toBe(`https://github.com/kamod-ch/${repository}`);
    expect(savedPackageProfile(`${name}/nested/entry-point`)).toBe(profile);
    expect(profile.name).not.toContain("nested");
  }
  expect(savedPackageProfile("@kamod-ch/not-reviewed")).toBeUndefined();
  expect(savedPackageProfile("constructor")).toBeUndefined();
  expect(savedPackageProfile("@kamod-ch/ui-lookalike/button")).toBeUndefined();
});

it("keeps README provenance and useful, independently readable package chapters", () => {
  for (const name of packageProfileNames) {
    const profile = savedPackageProfile(name)!;
    expect(profile.snapshot.checkedAt, name).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(profile.snapshot.readmes.length, name).toBeGreaterThan(0);
    for (const readme of profile.snapshot.readmes) {
      expect(readme.href, name).toMatch(/^https:\/\/github\.com\/kamod-ch\/.+\/README\.md$/);
      expect(readme.sha, name).toMatch(/^[a-f0-9]{40}$/);
    }
    expect(profile.sections.length, name).toBeGreaterThanOrEqual(3);
    expect(new Set(profile.sections.map(({ title }) => title)).size, name).toBe(
      profile.sections.length,
    );
    for (const section of profile.sections) {
      expect(section.description?.length, `${name}: ${section.title}`).toBeGreaterThan(70);
      expect(section.source?.href, name).toMatch(/^https:\/\/github\.com\/kamod-ch\//);
      expect(
        section.code || section.excerpts?.some(({ code }) => code) || section.rows?.length,
        name,
      ).toBeTruthy();
    }
    expect(profile.related?.length, name).toBeGreaterThanOrEqual(3);
  }
});

function snippets(section: CodeReferenceHelpSection): string[] {
  return [section.code?.value, ...(section.excerpts?.map(({ code }) => code?.value) ?? [])].filter(
    (value): value is string => value !== undefined,
  );
}

it("only demonstrates package import paths exported by the installed dependencies", () => {
  const require = createRequire(import.meta.url);
  const docs = resolve(import.meta.dirname, "../../..");
  const manifests = new Map<string, Record<string, unknown>>();
  for (const name of packageProfileNames) {
    const values = savedPackageProfile(name)!.sections.flatMap(snippets);
    for (const code of values) {
      const imports = [
        ...code.matchAll(/(?:from\s+|@import\s+)["'](@[\w-]+\/[\w-]+)([^"']*)["']/g),
      ];
      for (const [, importedPackage, subpath] of imports) {
        let manifest = manifests.get(importedPackage);
        if (!manifest) {
          // Resolve package roots through the docs workspace, including workspace symlinks.
          const path = resolve(docs, "node_modules", importedPackage, "package.json");
          try {
            manifest = JSON.parse(readFileSync(path, "utf8"));
          } catch {
            const entry = require.resolve(importedPackage);
            manifest = JSON.parse(readFileSync(resolve(dirname(entry), "../package.json"), "utf8"));
          }
          manifests.set(importedPackage, manifest!);
        }
        if (manifest!.exports) {
          expect(
            Object.keys(manifest!.exports as object),
            `${name}: ${importedPackage}${subpath}`,
          ).toContain(subpath ? `.${subpath}` : ".");
        }
      }
    }
  }
});
