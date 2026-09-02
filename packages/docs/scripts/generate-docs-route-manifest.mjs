import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ROUTE_SKIP_SLUGS } from "./docs-hidden-slugs.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.resolve(__dirname, "../src/docs/pages");
const outFile = path.resolve(__dirname, "../src/docs/generated-manifest.ts");
const docsDir = path.resolve(__dirname, "../docs");
const repoRoot = path.resolve(__dirname, "../../..");
const llmsSource = path.join(repoRoot, "llms.txt");
const llmsPublic = path.resolve(__dirname, "../public/llms.txt");

const files = (await fs.readdir(pagesDir)).filter((file) => file.endsWith("-doc.tsx"));
const manifest = [];

const ensureDir = (target) => fs.mkdir(target, { recursive: true });

const writePage = async (target, frontmatter) => {
  await ensureDir(path.dirname(target));
  await fs.writeFile(target, `${frontmatter}\n`, "utf8");
};

const removeIfExists = async (target) => {
  await fs.rm(target, { recursive: true, force: true });
};

for (const file of files) {
  const source = await fs.readFile(path.join(pagesDir, file), "utf8");
  const slugMatch = source.match(/slug:\s*"([^"]+)"/);
  if (!slugMatch || ROUTE_SKIP_SLUGS.has(slugMatch[1])) continue;

  const ids = [...source.matchAll(/id:\s*"([^"]+)"/g)].map((match) => match[1]);
  const seen = new Set();
  const sections = [];

  for (const id of ["installation", "usage", ...ids, "api-reference", "accessibility"]) {
    if (seen.has(id)) continue;
    seen.add(id);
    sections.push(id);
  }

  manifest.push({ slug: slugMatch[1], sections });
}

manifest.sort((a, b) => a.slug.localeCompare(b.slug));

await fs.writeFile(
  outFile,
  `export const docsRouteManifest = ${JSON.stringify(manifest, null, 2)} as const;\n`,
  "utf8",
);

execSync("pnpm exec oxfmt src/docs/generated-manifest.ts", {
  cwd: path.resolve(__dirname, ".."),
  stdio: "inherit",
});

await ensureDir(docsDir);
await removeIfExists(path.join(docsDir, "[slug]"));
await removeIfExists(path.join(docsDir, "[slug].md"));
await removeIfExists(path.join(docsDir, "[slug].paths.ts"));

await writePage(
  path.join(docsDir, "components.md"),
  `---
title: Components
description: Browse all available Kamod UI components.
pageKind: docs-overview
sidebar: false
outline: false
---`,
);

await writePage(
  path.join(docsDir, "forms.md"),
  `---
title: Forms
description: Form guides and patterns for Kamod UI.
pageKind: docs-forms-overview
sidebar: false
outline: false
---`,
);

await writePage(
  path.join(docsDir, "packages.md"),
  `---
title: Packages
description: Standalone Kamod packages — hooks, icons, i18n, and more.
pageKind: docs-packages-overview
sidebar: false
outline: false
---`,
);

for (const doc of manifest) {
  await writePage(
    path.join(docsDir, `${doc.slug}.md`),
    `---
title: "${doc.slug}"
description: "${doc.slug}"
pageKind: component-doc
slug: "${doc.slug}"
section: installation
sidebar: false
outline: false
---`,
  );

  for (const section of doc.sections) {
    await writePage(
      path.join(docsDir, doc.slug, `${section}.md`),
      `---
title: "${doc.slug}"
description: "${doc.slug} / ${section}"
pageKind: component-doc
slug: "${doc.slug}"
section: "${section}"
sidebar: false
outline: false
---`,
    );
  }
}

const overviewPages = new Set(["components.md", "forms.md", "packages.md"]);
const manifestSlugs = new Set(manifest.map((doc) => doc.slug));
const existingDocs = await fs.readdir(docsDir, { withFileTypes: true });

for (const entry of existingDocs) {
  if (!entry.isFile() || !entry.name.endsWith(".md") || overviewPages.has(entry.name)) {
    continue;
  }

  const slug = entry.name.replace(/\.md$/, "");
  if (manifestSlugs.has(slug)) continue;

  await removeIfExists(path.join(docsDir, entry.name));
  await removeIfExists(path.join(docsDir, slug));
}

await fs.copyFile(llmsSource, llmsPublic);
