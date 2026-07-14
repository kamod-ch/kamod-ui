import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const coreDir = path.join(repoRoot, "packages/core");

const [, , bumpArg, ...flags] = process.argv;
const bump = bumpArg ?? "patch";
const dryRun = flags.includes("--dry");
const allowed = new Set(["patch", "minor", "major"]);

function fail(message, error) {
  console.error(`[release] ERROR: ${message}`);
  if (error) {
    const detail = error?.stderr?.toString?.().trim() || error?.message || String(error);
    if (detail) console.error(detail);
  }
  process.exit(1);
}

function run(command, options = {}) {
  console.log(`\n[release] $ ${command}`);
  try {
    return execSync(command, {
      stdio: "inherit",
      encoding: "utf8",
      cwd: options.cwd ?? repoRoot,
      ...options,
    });
  } catch (error) {
    fail(`command failed: ${command}`, error);
  }
}

function output(command, options = {}) {
  try {
    return execSync(command, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      cwd: options.cwd ?? repoRoot,
      ...options,
    }).trim();
  } catch (error) {
    fail(`command failed: ${command}`, error);
  }
}

function readCorePackage() {
  return JSON.parse(readFileSync(path.join(coreDir, "package.json"), "utf8"));
}

function readCoreVersion() {
  return readCorePackage().version;
}

function assertNpmLogin() {
  output("npm whoami --registry=https://registry.npmjs.org");
}

if (!allowed.has(bump)) {
  fail(`invalid release type: ${bump}. Use one of: patch, minor, major`);
}

const branch = output("git branch --show-current");
if (branch !== "main") {
  fail(`current branch is "${branch}", expected "main"`);
}

const status = output("git status --porcelain");
if (status) {
  fail("working tree is not clean — commit or stash changes before releasing");
}

const corePackage = readCorePackage();
const packageName = corePackage.name;
const currentVersion = corePackage.version;
console.log(`[release] Preparing ${packageName}@${currentVersion}${dryRun ? " (dry run)" : ""}`);

assertNpmLogin();

run("pnpm install --frozen-lockfile");
run("pnpm run release:check");

if (dryRun) {
  const tarball = output("npm pack", { cwd: coreDir });
  run(`tar -tf ${JSON.stringify(tarball)}`, { cwd: coreDir });
  run(`rm -f ${JSON.stringify(tarball)}`, { cwd: coreDir });
  console.log("\n[release] Dry run completed successfully.");
  process.exit(0);
}

run(`npm version ${bump} --no-git-tag-version`, { cwd: coreDir });
const newVersion = readCoreVersion();
console.log(`\n[release] Bumping ${packageName} from ${currentVersion} to ${newVersion}`);

run("pnpm syncpack:fix");
run("pnpm install --lockfile-only");

run("git add packages/core/package.json pnpm-lock.yaml");
run(`git commit -m "chore(core): release v${newVersion}"`);
run(`git tag v${newVersion}`);

console.log("\n[release] Publishing to npm from packages/core …");
run("pnpm publish --access public --no-git-checks", { cwd: coreDir });

run("git push origin main");
run(`git push origin v${newVersion}`);

console.log("\n[release] Release completed successfully.");
console.log(`[release] npm: https://www.npmjs.com/package/${packageName}/v/${newVersion}`);
console.log("[release] Push to main will deploy docs via GitHub Pages workflow.");
