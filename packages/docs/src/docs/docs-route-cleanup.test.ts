import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, expect, it } from "vitest";
import { removeStaleComponentRoutes } from "../../scripts/docs-route-cleanup.mjs";

const temporaryDirectories: string[] = [];
afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((dir) => rm(dir, { recursive: true })));
});

it("preserves authored guides and current routes while removing only stale generated stubs", async () => {
  const dir = await mkdtemp(join(tmpdir(), "kamod-doc-routes-"));
  temporaryDirectories.push(dir);
  const stub = "---\npageKind: component-doc\n---\n";
  const guide = "---\npageKind: getting-started-guide\n---\n\n## Start Here\n\nAuthored content.\n";
  const files = {
    "getting-started.md": guide,
    "future-guide.md": "---\npageKind: another-guide\n---\n",
    "components.md": "---\npageKind: docs-overview\n---\n",
    "button.md": stub,
    "retired.md": stub,
    "retired/installation.md": stub,
    "retired/notes.md": "Keep these authored notes.\n",
    "removed.md": stub,
    "removed/installation.md": stub,
    "authored-component.md": `${stub}\nKeep this component prose.\n`,
  };
  for (const [name, source] of Object.entries(files)) {
    const filename = join(dir, name);
    await mkdir(dirname(filename), { recursive: true });
    await writeFile(filename, source);
  }
  // Repeated startup/build generation must be safe as well.
  for (let run = 0; run < 2; run++) {
    await removeStaleComponentRoutes(dir, new Set(["button"]));
    for (const [name, source] of Object.entries(files)) {
      if (name === "retired.md" || name === "retired/installation.md" || name.startsWith("removed"))
        await expect(readFile(join(dir, name), "utf8")).rejects.toMatchObject({ code: "ENOENT" });
      else expect(await readFile(join(dir, name), "utf8"), name).toBe(source);
    }
    expect(await readdir(dir)).not.toContain("removed");
  }
});
