#!/usr/bin/env node
import { spawn } from "node:child_process";
/**
 * Serve the production build under a GitHub Pages-style subpath for local E2E.
 * Usage: VITE_BASE_PATH=/kamod-ui/ pnpm build && pnpm preview:pages
 */
import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsRoot = resolve(__dirname, "..");
const basePath = (process.env.VITE_BASE_PATH ?? "/kamod-ui/").replace(/\/?$/, "/");
const baseName = basePath.replace(/^\//, "").replace(/\/$/, "") || "kamod-ui";
const serveRoot = resolve("/tmp", `${baseName}-gh-pages`);
const target = resolve(serveRoot, baseName);
const port = process.env.PREVIEW_PAGES_PORT ?? "4180";

rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
cpSync(resolve(docsRoot, "dist"), target, { recursive: true });

const url = `http://127.0.0.1:${port}/${baseName}/`;
console.log(`Serving production build at ${url}`);
console.log(
  `E2E: DOCS_AUDIT_BASE_URL=${url} pnpm exec playwright test --config=playwright.docs-audit.config.ts`,
);

spawn("npx", ["serve", serveRoot, "-l", port], { stdio: "inherit", shell: true });
