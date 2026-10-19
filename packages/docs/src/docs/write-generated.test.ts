import { mkdtemp, readFile, rm, stat, utimes } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, expect, it } from "vitest";
import { writeFormattedIfChanged, writeIfChanged } from "../../scripts/write-generated.mjs";

const directories: string[] = [];
afterEach(async () => {
  await Promise.all(directories.splice(0).map((path) => rm(path, { recursive: true })));
});

it("does not touch an unchanged route and still writes a real content change", async () => {
  const directory = await mkdtemp(join(tmpdir(), "kamod-generated-"));
  directories.push(directory);
  const file = join(directory, "route.md");
  expect(await writeIfChanged(file, "First route\n")).toBe(true);
  const fixed = new Date("2000-01-01T00:00:00Z");
  await utimes(file, fixed, fixed);
  expect(await writeIfChanged(file, "First route\n")).toBe(false);
  expect((await stat(file)).mtimeMs).toBe(fixed.getTime());
  expect(await writeIfChanged(file, "Updated route\n")).toBe(true);
  expect(await readFile(file, "utf8")).toBe("Updated route\n");
});

it("compares formatted output before writing a generated TypeScript manifest", async () => {
  const directory = await mkdtemp(join(tmpdir(), "kamod-generated-"));
  directories.push(directory);
  const file = join(directory, "manifest.ts");
  const source = 'export const entries=[{slug:"button",sections:["installation"]}] as const;';
  expect(await writeFormattedIfChanged(file, source)).toBe(true);
  expect(await readFile(file, "utf8")).toContain('slug: "button"');
  const fixed = new Date("2000-01-01T00:00:00Z");
  await utimes(file, fixed, fixed);
  expect(await writeFormattedIfChanged(file, source)).toBe(false);
  expect((await stat(file)).mtimeMs).toBe(fixed.getTime());
});
