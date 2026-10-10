import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "@typescript/typescript6";
import { expect, it } from "vitest";
import { parseGuide } from "../../blocks/guides/guide-markdown";
import { themeRuntimeReference } from "./theme-runtime-reference";
import { renderThemeRuntimeTable } from "./theme-runtime-table";

it("links each API shortcut to a real explanation with an icon and trailing arrow", () => {
  const [section] = parseGuide(themeRuntimeReference, renderThemeRuntimeTable);
  const ids = new Set(
    section.parts.filter((part) => part.kind === "heading").map((part) => part.id),
  );
  const table = section.parts.find(
    (part) => part.kind === "html" && part.html.includes("theme-runtime-table"),
  );
  if (table?.kind !== "html") throw new Error("Missing runtime API table");
  const links = [
    ...table.html.matchAll(/class="docs-inline-code-link" href="#([^"]+)">([\s\S]*?)<\/a>/g),
  ];
  expect(links).toHaveLength(9);
  for (const [, id, markup] of links) {
    expect(ids.has(id)).toBe(true);
    expect(markup).toContain('class="docs-reference-icon"');
    expect(markup).toContain('class="docs-reference-arrow"');
  }
});

it("typechecks the copyable runtime examples against the actual theme package", () => {
  const [section] = parseGuide(themeRuntimeReference);
  const directory = mkdtempSync(
    resolve(import.meta.dirname, "../../../node_modules/.theme-guide-test-"),
  );
  try {
    const files = section.parts.flatMap((part, index) => {
      if (part.kind !== "code" || part.language !== "tsx") return [];
      const file = resolve(directory, `example-${index}.tsx`);
      writeFileSync(file, part.code);
      return [file];
    });
    expect(files.length).toBeGreaterThan(5);
    const program = ts.createProgram(files, {
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
