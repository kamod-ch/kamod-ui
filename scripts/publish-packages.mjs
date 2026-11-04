import { execFileSync, spawnSync } from "node:child_process";

const packages = ["@kamod-ch/ui", "@kamod-ch/themes"];

function packageVersion(packageName) {
  return execFileSync(
    "pnpm",
    ["--filter", packageName, "exec", "node", "-p", "require('./package.json').version"],
    { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] },
  ).trim();
}

function isPublished(packageName, version) {
  const result = spawnSync("npm", ["view", `${packageName}@${version}`, "version", "--json"], {
    encoding: "utf8",
  });

  if (result.status === 0) return true;

  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  if (output.includes("E404")) return false;

  process.stderr.write(result.stdout ?? "");
  process.stderr.write(result.stderr ?? "");
  throw new Error(`Could not determine whether ${packageName}@${version} is already published`);
}

for (const packageName of packages) {
  const version = packageVersion(packageName);

  if (isPublished(packageName, version)) {
    console.log(`[publish] ${packageName}@${version} is already published; skipping`);
    continue;
  }

  console.log(`[publish] Publishing ${packageName}@${version}`);
  const result = spawnSync(
    "pnpm",
    ["--filter", packageName, "publish", "--access", "public", "--provenance", "--no-git-checks"],
    { stdio: "inherit" },
  );

  if (result.status !== 0) process.exit(result.status ?? 1);
}
