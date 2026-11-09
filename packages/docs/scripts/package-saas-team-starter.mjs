#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { strToU8, zipSync } from "fflate";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(__dirname, "..");
const starterRoot = path.join(docsRoot, "starters/saas-team-demo");
const demoSrc = path.join(docsRoot, "src/demo/saas-team");
const outZip = path.join(docsRoot, "public/starters/saas-team-demo.zip");

const walk = async (dir, base = dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full, base)));
    else files.push(path.relative(base, full));
  }
  return files;
};

const addDirectory = async (archive, fromDir, prefix) => {
  const files = await walk(fromDir);
  for (const file of files) {
    const source = await fs.readFile(path.join(fromDir, file));
    archive[`${prefix}/${file.replaceAll("\\", "/")}`] = source;
  }
};

await fs.mkdir(path.dirname(outZip), { recursive: true });
const archive = {};
await addDirectory(archive, starterRoot, "saas-team-demo");
await addDirectory(archive, demoSrc, "saas-team-demo/src/demo/saas-team");
const zip = zipSync(
  Object.fromEntries(Object.entries(archive).map(([name, data]) => [name, strToU8(data)])),
  { level: 6 },
);
await fs.writeFile(outZip, zip);
console.log(`Wrote ${outZip} (${Object.keys(archive).length} files)`);
