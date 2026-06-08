#!/usr/bin/env node
/**
 * Publishes packages/core to GitHub Packages as @kamod-ch/core.
 * The source package name stays @kamod-ui/core for npm; GitHub Packages requires
 * a scope that matches the owning GitHub org (kamod-ch).
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const pkgPath = join(root, "packages/core/package.json");
const original = readFileSync(pkgPath, "utf8");
const pkg = JSON.parse(original);

pkg.name = "@kamod-ch/core";
pkg.publishConfig = {
  registry: "https://npm.pkg.github.com",
};

writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

try {
  execSync("pnpm publish --no-git-checks", {
    cwd: join(root, "packages/core"),
    stdio: "inherit",
    env: process.env,
  });
} finally {
  writeFileSync(pkgPath, original);
}
