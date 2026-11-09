#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const pkg = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "../../core/package.json"), "utf8"),
);
const keys = Object.keys(pkg.exports)
  .filter((key) => key.startsWith("./"))
  .map((key) => key.slice(2))
  .sort();

const out = `/** Generated from packages/core/package.json exports — run: pnpm docs:exports */
export const kamodUiExportSubpaths = ${JSON.stringify(keys, null, 2)} as const;
export const kamodUiComponentSlugs = kamodUiExportSubpaths.filter((entry) => !entry.includes("/"));
`;

writeFileSync(resolve(import.meta.dirname, "../src/docs/doc-ui-export-slugs.ts"), out);
console.log(`doc-ui-export-slugs: ${keys.length} subpaths`);
