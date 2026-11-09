#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { writeIfChanged } from "./write-generated.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blocksDir = path.resolve(__dirname, "../blocks");
const configPath = path.resolve(__dirname, "../src/blocks/block-nav-config.ts");

const readPlaceholders = async () => {
  const source = await fs.readFile(configPath, "utf8");
  const match = source.match(
    /export const PLACEHOLDER_BLOCK_CATEGORIES = (\[[\s\S]*?\]) as const;/,
  );
  if (!match) throw new Error("PLACEHOLDER_BLOCK_CATEGORIES not found in block-nav-config.ts");
  return Function(`"use strict"; return (${match[1]});`)();
};

const frontmatter = (fields) =>
  `---\n${Object.entries(fields)
    .map(([key, value]) => `${key}: ${typeof value === "string" ? JSON.stringify(value) : value}`)
    .join("\n")}\n---\n`;

const main = async () => {
  const placeholders = await readPlaceholders();
  const placeholderKeys = new Set(placeholders.map(({ key }) => key));

  await writeIfChanged(
    path.join(blocksDir, "roadmap.md"),
    frontmatter({
      title: "Block library roadmap",
      description:
        "Published and planned block collections in the Kamod UI library, with clear status for each category.",
      pageKind: "blocks-roadmap",
      sidebar: "false",
      outline: "false",
    }),
  );

  for (const { key, label } of placeholders) {
    await writeIfChanged(
      path.join(blocksDir, `${key}.md`),
      frontmatter({
        title: `${label} — planned`,
        description: `Status for the planned ${label} block collection in Kamod UI.`,
        pageKind: "blocks-planned-category",
        plannedCategoryKey: key,
        sidebar: "false",
        outline: "false",
      }),
    );
  }

  const entries = await fs.readdir(blocksDir);
  for (const name of entries) {
    if (!name.endsWith(".md") || name === "index.md" || name === "roadmap.md") continue;
    const key = name.slice(0, -3);
    if (!placeholderKeys.has(key)) continue;
    const raw = await fs.readFile(path.join(blocksDir, name), "utf8");
    if (!raw.includes("pageKind: blocks-planned-category")) continue;
    const planned = placeholders.find((item) => item.key === key);
    if (!planned) {
      await fs.rm(path.join(blocksDir, name));
    }
  }
};

await main();
