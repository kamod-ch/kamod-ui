import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import ts from "typescript";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createSidebarInstallations } from "../../../scripts/lib/sidebar-downloads.mjs";
import { getAuthBlockSource } from "../auth-source";
import { blockCategories } from "../block-categories";
import { getSidebarBlockSource } from "../sidebar-source";
import { blockSourceDestination } from "../source-manifest";
import { sidebarGuideProfiles } from "./sidebar-guide-profiles";
import { getVariantApi } from "./variant-api";

const installations = createSidebarInstallations();
beforeAll(() =>
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => {
      const installation = installations.find((entry) => url.endsWith(`/${entry.id}.json`));
      return new Response(JSON.stringify(installation?.sources ?? {}), {
        status: installation ? 200 : 404,
      });
    }),
  ),
);
afterAll(() => vi.unstubAllGlobals());

const sourceRoot = resolve(import.meta.dirname, "../../../../blocks");
for (const category of ["sidebar", "login", "signup"] as const) {
  describe(`${category} copyable guides`, () => {
    for (const block of blockCategories[category].blocks) {
      it(`${block.id} includes every relative import and returns the exact listed source`, async () => {
        const paths = new Set(block.files.map((file) => resolve(sourceRoot, file.path)));
        for (const file of block.files) {
          const filename = resolve(sourceRoot, file.path);
          const source = readFileSync(filename, "utf8");
          const loaded =
            category === "sidebar"
              ? await getSidebarBlockSource(
                  block.id as Parameters<typeof getSidebarBlockSource>[0],
                  file.label,
                )
              : getAuthBlockSource(
                  block.id as Parameters<typeof getAuthBlockSource>[0],
                  file.label,
                );
          expect(loaded, file.path).toBe(
            category === "sidebar"
              ? installations.find((entry) => entry.id === block.id)!.sources[file.label]
              : source,
          );
          if (!/\.tsx?$/.test(file.path)) continue;
          for (const match of source.matchAll(/(?:from\s+|import\s*)["'](\.[^"']+)["']/g)) {
            const base = resolve(dirname(filename), match[1].split("?")[0]);
            const imported = [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`].find(
              existsSync,
            );
            expect(imported, `${file.path}: ${match[1]} resolves`).toBeDefined();
            expect(paths.has(imported!), `${file.path}: copy list includes ${match[1]}`).toBe(true);
          }
        }
      });
      it(`${block.id} documents its actual typed contract`, () => {
        const api = getVariantApi(category, block.id);
        expect(api.length).toBeGreaterThanOrEqual(category === "sidebar" ? 1 : 3);
        for (const entry of api) {
          const file = block.files.find(
            (file) => blockSourceDestination({ category, id: block.id }, file) === entry.filePath,
          );
          expect(
            file,
            `${entry.name}: installation path identifies an included file`,
          ).toBeDefined();
          expect(readFileSync(resolve(sourceRoot, file!.path), "utf8")).toContain(
            `export type ${entry.name} =`,
          );
          expect(entry.source).toContain(`export type ${entry.name} =`);
          expect(entry.source).not.toContain("export const");
          // Independently check the lightweight docs extractor against TypeScript's AST.
          const parsed = ts.createSourceFile(
            "reference.ts",
            entry.source,
            ts.ScriptTarget.Latest,
            true,
          );
          const declaration = parsed.statements.find(ts.isTypeAliasDeclaration)!;
          const types = ts.isIntersectionTypeNode(declaration.type)
            ? declaration.type.types
            : [declaration.type];
          const expected = types.flatMap((type) =>
            ts.isTypeLiteralNode(type)
              ? type.members.filter(ts.isPropertySignature).map((field) => ({
                  name: field.name.getText(parsed),
                  required: !field.questionToken,
                  type: field.type!.getText(parsed).replace(/\s+/g, " ").trim(),
                }))
              : [],
          );
          expect(
            entry.fields.map(({ name, required, type }) => ({ name, required, type })),
            entry.name,
          ).toEqual(expected);

          for (const field of entry.fields) expect(field.description.length).toBeGreaterThan(15);
        }
        if (category !== "sidebar") {
          expect(api[0].fields.every((field) => !field.required)).toBe(true);
          expect(api[1].fields.map((field) => field.name)).toEqual(
            category === "signup"
              ? ["name", "email", "password"]
              : block.id === "login-05"
                ? ["email"]
                : ["email", "password"],
          );
          expect(api[1].fields.every((field) => field.required)).toBe(true);
        } else
          expect(sidebarGuideProfiles[block.id as keyof typeof sidebarGuideProfiles]).toBeDefined();
      });
    }
  });
}
it("rejects unknown files instead of silently copying the page source", async () => {
  expect(() => getAuthBlockSource("login-01", "missing.tsx")).toThrow("Block source not found");
  await expect(getSidebarBlockSource("sidebar-01", "missing.tsx")).rejects.toThrow(
    "Block source not found",
  );
});
