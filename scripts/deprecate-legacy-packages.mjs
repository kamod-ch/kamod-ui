#!/usr/bin/env node
/**
 * Mark legacy npm packages as deprecated (does not unpublish).
 * Requires npm login with publish access to @kamod-ui and 2FA if enabled.
 */
import { execSync } from "node:child_process";

const LEGACY = [
  {
    name: "@kamod-ui/core",
    message: "Renamed to @kamod-ch/ui — install with: pnpm add @kamod-ch/ui",
  },
];

function npm(cmd) {
  return execSync(`npm ${cmd}`, { encoding: "utf8", stdio: "pipe" }).trim();
}

console.log(`Logged in as: ${npm("whoami")}\n`);

for (const { name, message } of LEGACY) {
  try {
    const latest = npm(`view ${name} version`);
    const deprecated = npm(`view ${name} deprecated`).trim();
    console.log(`${name}@${latest}`);
    if (deprecated && deprecated !== "undefined") {
      console.log(`  already deprecated: ${deprecated}`);
      continue;
    }
  } catch {
    console.log(`${name}: not found on npm (skip)`);
    continue;
  }

  console.log(`  deprecating all versions…`);
  execSync(`npm deprecate '${name}@*' ${JSON.stringify(message)}`, {
    stdio: "inherit",
  });
  console.log(`  done\n`);
}

console.log("Verify:");
for (const { name } of LEGACY) {
  try {
    console.log(`  npm view ${name} deprecated`);
  } catch {
    /* skip */
  }
}
