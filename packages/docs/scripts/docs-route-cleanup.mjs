import fs from "node:fs/promises";
import path from "node:path";

// Authored guides share this directory with generated routes. Only own empty
// component-doc stubs, never prose, another page kind or an entire directory.
const isGeneratedComponentPage = (source) => {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---\s*$/)?.[1];
  return frontmatter !== undefined && /^pageKind: component-doc\s*$/m.test(frontmatter);
};

export async function removeStaleComponentRoutes(docsDir, manifestSlugs) {
  for (const entry of await fs.readdir(docsDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const slug = entry.name.slice(0, -3);
    if (manifestSlugs.has(slug)) continue;
    const file = path.join(docsDir, entry.name);
    if (!isGeneratedComponentPage(await fs.readFile(file, "utf8"))) continue;
    await fs.unlink(file);

    const directory = path.join(docsDir, slug);
    let sections;
    try {
      sections = await fs.readdir(directory, { withFileTypes: true });
    } catch (error) {
      if (error.code === "ENOENT") continue;
      throw error;
    }
    for (const section of sections) {
      if (!section.isFile() || !section.name.endsWith(".md")) continue;
      const sectionFile = path.join(directory, section.name);
      if (isGeneratedComponentPage(await fs.readFile(sectionFile, "utf8")))
        await fs.unlink(sectionFile);
    }
    if ((await fs.readdir(directory)).length === 0) await fs.rmdir(directory);
  }
}
