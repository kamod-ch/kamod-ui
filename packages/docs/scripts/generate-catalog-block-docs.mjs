#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const docsPkg = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const blocksPkg = resolve(docsPkg, "../blocks");
const docsBlocks = resolve(docsPkg, "blocks");

const categories = [
  {
    key: "app-sidebar",
    metadata: "src/app-sidebar/metadata.ts",
    export: "appSidebarBlockMetadata",
  },
  { key: "auth", metadata: "src/auth/catalog-metadata.ts", export: "catalogAuthBlockMetadata" },
  { key: "marketing", metadata: "src/marketing/metadata.ts", export: "marketingBlockMetadata" },
  { key: "dashboard", metadata: "src/dashboard/metadata.ts", export: "dashboardBlockMetadata" },
  {
    key: "communication",
    metadata: "src/communication/metadata.ts",
    export: "communicationBlockMetadata",
  },
  { key: "commerce", metadata: "src/commerce/metadata.ts", export: "commerceBlockMetadata" },
];

for (const { key, metadata, export: exportName } of categories) {
  const mod = await import(new URL(metadata, `file://${blocksPkg}/`).href);
  const blocks = mod[exportName];
  if (!Array.isArray(blocks)) throw new Error(`Missing ${exportName} in ${metadata}`);
  for (const block of blocks) {
    const dir = resolve(docsBlocks, key, block.id);
    mkdirSync(dir, { recursive: true });
    const path = resolve(dir, "index.md");
    const body = `---
title: "${block.id}"
description: "${block.description.replace(/"/g, '\\"')}"
pageKind: blocks-detail
blockCategory: ${key}
blockId: "${block.id}"
sidebar: false
outline: false
---
`;
    if (!existsSync(path)) writeFileSync(path, body);
  }
  console.log(`${key}: ensured ${blocks.length} detail pages`);
}
