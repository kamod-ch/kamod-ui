import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { describe, expect, it } from "vitest";
import { createShellThreeInstallation } from "../../../scripts/lib/shell-three-download.mjs";
import { blocksRoot } from "../../../scripts/lib/sidebar-downloads.mjs";

describe("Shell 3 prepared download", () => {
  it("ships unchanged production source and its license with no preview files", () => {
    const installation = createShellThreeInstallation();
    const entries = unzipSync(installation.zip);
    expect(Object.keys(entries)).toContain("application-shell/application-shell-3/index.ts");
    expect(Object.keys(entries)).toContain("application-shell/shared/shell-frame.tsx");
    expect(Object.keys(entries)).toContain("application-shell/application-shell-1/menu.tsx");
    expect(Object.keys(entries)).toContain("application-shell/LICENSE.md");
    expect(Object.keys(entries).some((name) => /preview|demo-data|assets/.test(name))).toBe(false);
    for (const [name, bytes] of Object.entries(entries)) {
      const original = name.endsWith("LICENSE.md")
        ? resolve(blocksRoot, "../../LICENSE.md")
        : resolve(blocksRoot, "src", name);
      expect(strFromU8(bytes)).toBe(readFileSync(original, "utf8"));
    }
  });

  it("produces identical archives for identical source", () => {
    expect(createShellThreeInstallation().zip).toEqual(createShellThreeInstallation().zip);
  });
});
