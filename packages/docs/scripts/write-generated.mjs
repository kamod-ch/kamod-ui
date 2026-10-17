import fs from "node:fs/promises";
import { format } from "oxfmt";

/** Preserve mtimes so unchanged generated routes do not trigger full catalog and CSS rebuilds. */
export async function writeIfChanged(file, source) {
  try {
    if ((await fs.readFile(file, "utf8")) === source) return false;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  await fs.writeFile(file, source, "utf8");
  return true;
}

/** Format before comparing: writing raw JSON and then formatting would still emit two changes. */
export async function writeFormattedIfChanged(file, source) {
  const result = await format(file, source);
  if (result.errors.length) throw new Error(`Cannot format generated file: ${file}`);
  return writeIfChanged(file, result.code);
}
