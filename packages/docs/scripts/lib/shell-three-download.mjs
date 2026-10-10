/** Experimental Shell 3 download: collect its real import graph without changing source. */
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { strToU8, zipSync } from "fflate";
import { blocksRoot, moduleReferences } from "./sidebar-downloads.mjs";

export function createShellThreeInstallation() {
  const root = resolve(blocksRoot, "src/application-shell");
  const sources = {};
  function visit(filename) {
    const label = `application-shell/${relative(root, filename).replaceAll("\\", "/")}`;
    if (label in sources) return;
    const source = readFileSync(filename, "utf8");
    sources[label] = source;
    for (const { value } of moduleReferences(filename, source)) {
      if (!value.startsWith(".")) continue;
      const base = resolve(dirname(filename), value.split("?")[0]);
      const target = [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`].find(
        (path) => existsSync(path) && statSync(path).isFile(),
      );
      if (!target || !target.startsWith(`${root}/`)) {
        throw new Error(`Unresolvable shell import: ${filename} → ${value}`);
      }
      visit(target);
    }
  }
  visit(resolve(root, "application-shell-3/index.ts"));
  sources["application-shell/LICENSE.md"] = readFileSync(
    resolve(blocksRoot, "../../LICENSE.md"),
    "utf8",
  );
  const archive = Object.fromEntries(
    Object.entries(sources)
      .sort(([a], [b]) => a.localeCompare(b, "en"))
      .map(([label, source]) => [label, [strToU8(source), { mtime: new Date(2000, 0, 1) }]]),
  );
  return { id: "application-shell-3", sources, zip: zipSync(archive, { level: 6 }) };
}
