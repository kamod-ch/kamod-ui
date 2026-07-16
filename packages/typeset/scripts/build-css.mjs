import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { generateTypesetPresetsCss } from "../dist/presets.js";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
await mkdir(dist, { recursive: true });
await copyFile(resolve(root, "src/typeset.css"), resolve(dist, "typeset.css"));
await writeFile(
  resolve(dist, "presets.css"),
  `@layer components {\n${generateTypesetPresetsCss()} }\n`,
);
