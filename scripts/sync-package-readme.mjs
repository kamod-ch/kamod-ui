#!/usr/bin/env node
/**
 * Generates packages/core/README.md from the repo root README for npm and
 * GitHub package-directory views. Rewrites monorepo-relative paths to absolute
 * GitHub URLs so images and doc links work outside the repo root.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const source = join(root, "README.md");
const target = join(root, "packages/core/README.md");

const REPO = "kamod-ch/kamod-ui";
const BRANCH = "main";
const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`;
const BLOB_BASE = `https://github.com/${REPO}/blob/${BRANCH}`;

/** @param {string} markdown */
function transformForPackage(markdown) {
  let out = markdown;

  out = out.replace(/\.github\/assets\//g, `${RAW_BASE}/.github/assets/`);

  out = out.replace(/\]\(\.docs\/([^)]+)\)/g, `](${BLOB_BASE}/.docs/$1)`);
  out = out.replace(/\]\(packages\/core\/([^)]+)\)/g, `](${BLOB_BASE}/packages/core/$1)`);
  out = out.replace(/\]\(packages\/docs\/([^)]+)\)/g, `](${BLOB_BASE}/packages/docs/$1)`);
  out = out.replace(/\]\(apps\/demo\/([^)]+)\)/g, `](${BLOB_BASE}/packages/docs/$1)`);

  return out;
}

const check = process.argv.includes("--check");
const sourceText = readFileSync(source, "utf8");
const generated = transformForPackage(sourceText);

if (check) {
  let existing;
  try {
    existing = readFileSync(target, "utf8");
  } catch {
    console.error("packages/core/README.md is missing. Run: pnpm docs:readme");
    process.exit(1);
  }
  if (existing !== generated) {
    console.error("packages/core/README.md is out of date. Run: pnpm docs:readme");
    process.exit(1);
  }
  process.exit(0);
}

writeFileSync(target, generated);
console.log(`Wrote ${target}`);
