import { execSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// When copied to scripts/release.mjs in a consumer repo, __dirname is scripts/.
const repoRoot = path.resolve(__dirname, "..");

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

function readPackageJson(packageDir) {
  const packagePath = path.join(repoRoot, packageDir, "package.json");
  return JSON.parse(readFileSync(packagePath, "utf8"));
}

function readVersion(packageDir) {
  return readPackageJson(packageDir).version;
}

function discoverPackages(globPattern) {
  const parent = path.dirname(globPattern);
  const base = path.basename(globPattern);
  const parentDir = path.join(repoRoot, parent);

  if (!existsSync(parentDir)) {
    fail(`discoverPackages parent directory not found: ${parent}`);
  }

  const entries = readdirSync(parentDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => base === "*" || name === base.replace("*", ""));

  const packages = [];
  for (const name of entries.sort()) {
    const packageDir = path.posix.join(parent, name);
    const packagePath = path.join(repoRoot, packageDir, "package.json");
    if (!existsSync(packagePath)) continue;

    const pkg = JSON.parse(readFileSync(packagePath, "utf8"));
    if (pkg.private === true) continue;
    packages.push(packageDir);
  }

  if (packages.length === 0) {
    fail(`no publishable packages found for discoverPackages: ${globPattern}`);
  }

  return packages;
}

function resolvePackageDirs(config) {
  if (config.packages?.length) {
    return config.packages.map((entry) => (entry === "." ? "." : entry.replace(/\\/g, "/")));
  }

  if (config.discoverPackages) {
    return discoverPackages(config.discoverPackages);
  }

  fail("release.config.mjs must define packages or discoverPackages");
}

async function loadConfig() {
  const configPath = path.join(repoRoot, "release.config.mjs");
  if (!existsSync(configPath)) {
    fail(`missing release.config.mjs at ${configPath}`);
  }

  const module = await import(pathToFileURL(configPath).href);
  return module.default ?? module;
}

const config = await loadConfig();
const packageDirs = resolvePackageDirs(config);
const tagPackage = config.tagPackage ?? packageDirs[0];
const qaCommand = config.qaCommand ?? "pnpm release:check";
const commitMessage = config.commitMessage ?? ((version) => `chore: release v${version}`);
const syncLockfile = config.syncLockfile === true;
const syncLockfileCommands = config.syncLockfileCommands ?? [
  "pnpm syncpack:fix",
  "pnpm install --lockfile-only",
];

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

const tagPkg = readPackageJson(tagPackage);
const packageName = tagPkg.name;
const currentVersion = tagPkg.version;
console.log(`[release] Preparing ${packageName}@${currentVersion}${dryRun ? " (dry run)" : ""}`);

run("pnpm install --frozen-lockfile");
run(qaCommand);

const primaryDir = path.join(repoRoot, tagPackage);
if (dryRun) {
  const tarball = output("npm pack", { cwd: primaryDir });
  run(`tar -tf ${JSON.stringify(tarball)}`, { cwd: primaryDir });
  run(`rm -f ${JSON.stringify(tarball)}`, { cwd: primaryDir });
  console.log("\n[release] Dry run completed successfully.");
  process.exit(0);
}

for (const packageDir of packageDirs) {
  run(`npm version ${bump} --no-git-tag-version`, {
    cwd: path.join(repoRoot, packageDir),
  });
}

const newVersion = readVersion(tagPackage);
console.log(`\n[release] Bumping ${packageName} from ${currentVersion} to ${newVersion}`);

if (syncLockfile) {
  for (const command of syncLockfileCommands) {
    run(command);
  }
}

const gitPaths = config.gitPaths ?? [
  ...packageDirs.map((dir) =>
    dir === "." ? "package.json" : path.posix.join(dir, "package.json"),
  ),
  ...(existsSync(path.join(repoRoot, "pnpm-lock.yaml")) ? ["pnpm-lock.yaml"] : []),
];

run(`git add ${gitPaths.map((entry) => JSON.stringify(entry)).join(" ")}`);
run(`git commit -m ${JSON.stringify(commitMessage(newVersion))}`);
run(`git tag v${newVersion}`);

run("git push origin main");
run(`git push origin v${newVersion}`);

console.log("\n[release] Release tag pushed successfully.");
console.log(
  "[release] GitHub Actions will publish to npm with provenance (see .github/workflows/publish.yml).",
);
console.log(`[release] npm: https://www.npmjs.com/package/${packageName}/v/${newVersion}`);
