/** Verify the displayed examples as consumers of the documented copied folder structure. */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import ts from "@typescript/typescript6";
import { strFromU8, unzipSync } from "fflate";
import { expect, it } from "vitest";
import { createShellThreeInstallation } from "../../../scripts/lib/shell-three-download.mjs";
import { blockCategories } from "../block-categories";
import { blockSourceDestination } from "../source-manifest";
import { type ShellVariantId, shellUsageCode } from "./application-shell-variant-guides";

it("typechecks every new shell usage example against its actual copied files without source aliases", () => {
  const directory = mkdtempSync(
    resolve(import.meta.dirname, "../../../node_modules/.shell-guide-test-"),
  );
  const inputs: string[] = [];
  try {
    for (const block of blockCategories["application-shell"].blocks.filter(
      (block) => block.id !== "application-shell-1",
    )) {
      const consumer = resolve(directory, block.id);
      if (block.id === "application-shell-3") {
        for (const [path, bytes] of Object.entries(unzipSync(createShellThreeInstallation().zip))) {
          const target = resolve(consumer, "src/components", path);
          mkdirSync(dirname(target), { recursive: true });
          writeFileSync(target, strFromU8(bytes));
        }
      } else
        for (const file of block.files) {
          const target = resolve(consumer, blockSourceDestination(block, file));
          mkdirSync(dirname(target), { recursive: true });
          writeFileSync(
            target,
            readFileSync(resolve(import.meta.dirname, "../../../../blocks", file.path)),
          );
        }
      const entry = resolve(consumer, "src/App.tsx");
      writeFileSync(entry, shellUsageCode(block.id as ShellVariantId));
      inputs.push(entry);
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
