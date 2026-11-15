import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { kamodUiSourceEntries, kamodUiTsconfigPaths } from "../../.preactpress/ui-source-aliases";

describe("kamod ui workspace resolution", () => {
  it("points every package export and the docs alias at core source", () => {
    const tsconfig = JSON.parse(
      readFileSync(resolve(import.meta.dirname, "../../tsconfig.json"), "utf8"),
    ) as { compilerOptions: { paths: Record<string, string[]> } };
    const paths = kamodUiTsconfigPaths();
    expect(paths["@kamod-ch/ui"]).toEqual(["../core/src/index.ts"]);
    expect(paths["@kamod-ch/ui/button"]).toEqual(["../core/src/components/button/index.ts"]);
    expect(paths["@kamod-ch/ui/lib/signals"]).toEqual(["../core/src/lib/signals/index.ts"]);
    expect(paths["@kamod-ch/ui/theme.css"]).toEqual(["../core/src/theme.css"]);
    expect(paths["@/components/kamod-ui/*"]).toEqual(["../core/src/components/*/index.ts"]);
    for (const [key, value] of Object.entries(paths)) {
      expect(tsconfig.compilerOptions.paths[key], key).toEqual(value);
    }
    expect(kamodUiSourceEntries().some((entry) => entry.specifier === "@kamod-ch/ui/dialog")).toBe(
      true,
    );
  });
});
