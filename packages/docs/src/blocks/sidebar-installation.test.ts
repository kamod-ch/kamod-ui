import { execFileSync } from "node:child_process";
/** Validate the exported consumer folder independently of repository import paths. */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";
import ts from "@typescript/typescript6";
import { strFromU8, unzipSync } from "fflate";
import { build } from "vite";
import { describe, expect, it } from "vitest";
import { sidebarBlockMetadata } from "../../../blocks/src/sidebar/metadata";
import {
  createSidebarInstallation,
  createSidebarInstallations,
  moduleReferences,
} from "../../scripts/lib/sidebar-downloads.mjs";

const installations = createSidebarInstallations();

describe("sidebar installation artifacts", () => {
  it("keeps the checked-in manifest aligned with the real dependency graph", () => {
    expect(installations.map(({ id }) => id)).toEqual(sidebarBlockMetadata.map(({ id }) => id));
    for (const installation of installations) {
      expect(sidebarBlockMetadata.find(({ id }) => id === installation.id)!.files).toEqual(
        installation.files,
      );
      expect(installation.files.some(({ label }) => label === "index.ts")).toBe(true);
      expect(
        installation.files.some(({ path }) =>
          /SidebarBlockShell|auth\/shared|sidebar-data/.test(path),
        ),
      ).toBe(false);
    }
  });

  for (const installation of installations) {
    it(`${installation.id}: ZIP and source viewer contain the same isolated, complete folder`, () => {
      const archive = unzipSync(installation.zip);
      expect(Object.keys(archive)).toEqual(
        installation.files.map(({ label }) => `${installation.id}/${label}`),
      );
      for (const { label } of installation.files) {
        const source = strFromU8(archive[`${installation.id}/${label}`]);
        expect(source).toBe(installation.sources[label]);
        if (!/\.tsx?$/.test(label)) continue;
        for (const reference of moduleReferences(label, source)) {
          if (!reference.value.startsWith(".")) {
            expect(reference.value).toMatch(/^(?:preact(?:\/|$)|@kamod-ch\/(?:ui|icons)(?:\/|$))/);
            continue;
          }
          const path = resolve("/installation", dirname(label), reference.value.split("?")[0]);
          const targets = [path, `${path}.ts`, `${path}.tsx`, `${path}/index.ts`];
          expect(
            installation.files.some((file) =>
              targets.includes(resolve("/installation", file.label)),
            ),
            `${label}: ${reference.value}`,
          ).toBe(true);
        }
      }
      expect(installation.sources["LICENSE.md"]).toBe(
        readFileSync(resolve(import.meta.dirname, "../../../../LICENSE.md"), "utf8"),
      );
    });
  }

  it("is deterministic and does not rewrite ordinary strings or comments", () => {
    expect(createSidebarInstallation("sidebar-05").zip).toEqual(
      createSidebarInstallation("sidebar-05").zip,
    );
    const source = `// import "./not-a-module"\nconst message = 'from "./example"';\nimport { Thing } from "./actual";\nexport type T = import("./types").T;`;
    expect(moduleReferences("sample.ts", source).map(({ value }) => value)).toEqual([
      "./actual",
      "./types",
    ]);
    expect(() => createSidebarInstallation("../sidebar-05")).toThrow("Invalid sidebar ID");
  });

  it("produces the same archive across build time zones", () => {
    const generator = new URL("../../scripts/lib/sidebar-downloads.mjs", import.meta.url).href;
    const script = `import { createSidebarInstallation } from ${JSON.stringify(generator)};
      import { createHash } from "node:crypto";
      console.log(createHash("sha256").update(createSidebarInstallation("sidebar-05").zip).digest("hex"));`;
    const hash = (TZ: string) =>
      execFileSync(process.execPath, ["--input-type=module", "-e", script], {
        env: { ...process.env, TZ },
        encoding: "utf8",
      });
    expect(hash("Europe/Vienna")).toBe(hash("America/New_York"));
  });

  it("typechecks and bundles every extracted entrypoint without repository source aliases", async () => {
    const directory = mkdtempSync(
      resolve(import.meta.dirname, "../../node_modules/.sidebar-install-test-"),
    );
    try {
      const inputs: string[] = [];
      for (const installation of installations) {
        for (const [path, bytes] of Object.entries(unzipSync(installation.zip))) {
          const filename = resolve(directory, path);
          mkdirSync(dirname(filename), { recursive: true });
          writeFileSync(filename, bytes);
        }
        inputs.push(resolve(directory, installation.id, "index.ts"));
      }
      const program = ts.createProgram(inputs, {
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
      const diagnostics = ts.getPreEmitDiagnostics(program);
      expect(
        ts.formatDiagnosticsWithColorAndContext(diagnostics, {
          getCanonicalFileName: (path) => path,
          getCurrentDirectory: () => directory,
          getNewLine: () => "\n",
        }),
      ).toBe("");
      await build({
        configFile: false,
        root: directory,
        logLevel: "silent",
        esbuild: { jsx: "automatic", jsxImportSource: "preact" },
        build: {
          write: false,
          minify: false,
          rollupOptions: {
            input: inputs,
            external: (id) => !id.startsWith(".") && !isAbsolute(id),
            output: { format: "es" },
          },
        },
      });
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  }, 30_000);
});
