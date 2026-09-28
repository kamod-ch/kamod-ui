/** Verify the displayed examples as consumers of the documented copied folder structure. */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import ts from "typescript";
import { expect, it } from "vitest";
import { blockCategories } from "../block-categories";
import { createVariantGuide } from "./VariantDocumentation";
import { integrationExample, variantImport } from "./variant-examples";

it("typechecks every auth usage example against its actual copied files without source aliases", () => {
  const directory = mkdtempSync(
    resolve(import.meta.dirname, "../../../node_modules/.auth-guide-test-"),
  );
  const inputs: string[] = [];
  try {
    for (const category of ["login", "signup"] as const) {
      for (const block of blockCategories[category].blocks) {
        const guide = createVariantGuide(category, block);
        for (const file of guide.files) {
          const target = resolve(
            directory,
            "src/components/blocks",
            file.path.replace(/^src\//, ""),
          );
          mkdirSync(dirname(target), { recursive: true });
          writeFileSync(
            target,
            readFileSync(resolve(import.meta.dirname, "../../../../blocks", file.path)),
          );
        }
        const entry = resolve(directory, `src/${block.id}.tsx`);
        writeFileSync(
          entry,
          `${variantImport(guide)}\n${integrationExample(guide)}\nexport const Page = () => <${guide.component} />;`,
        );
        inputs.push(entry);
      }
    }
    const assets = resolve(directory, "assets.d.ts");
    writeFileSync(assets, 'declare module "*.svg?url" { const url: string; export default url; }');
    const program = ts.createProgram([...inputs, assets], {
      noEmit: true,
      strict: true,
      skipLibCheck: true,
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      jsx: ts.JsxEmit.ReactJSX,
      jsxImportSource: "preact",
      types: [],
    });
    expect(
      ts.formatDiagnosticsWithColorAndContext(ts.getPreEmitDiagnostics(program), {
        getCanonicalFileName: (path) => path,
        getCurrentDirectory: () => directory,
        getNewLine: () => "\n",
      }),
    ).toBe("");
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}, 30_000);
