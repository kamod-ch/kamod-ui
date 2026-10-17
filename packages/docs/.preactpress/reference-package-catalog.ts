import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { referencePackages } from "../src/references/catalog/packages";
import type { CodeReferencePackage } from "../src/references/types";

type PackageManifest = {
  name: string;
  description?: string;
  repository?: unknown;
  homepage?: string;
  license?: string;
  private?: boolean;
  exports?: Record<string, unknown>;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

const workspaces = ["core", "blocks", "docs", "themes", "typeset", "motion", "openui"];

/** GitHub only: registry strings and executable/non-web manifest URLs are not destinations. */
export function repositoryUrl(repository: unknown): string | undefined {
  const value =
    typeof repository === "string" ? repository : (repository as { url?: string } | undefined)?.url;
  if (!value) return;
  const normalized = value.replace(/^git\+/, "").replace(/\.git$/, "");
  if (/^[\w.-]+\/[\w.-]+$/.test(normalized)) return `https://github.com/${normalized}`;
  return /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/.test(normalized) ? normalized : undefined;
}

const exportPaths = (value: unknown): string[] =>
  typeof value === "string"
    ? [value]
    : value && typeof value === "object"
      ? Object.values(value).flatMap(exportPaths)
      : [];

/** Collect once per build; checked-out export targets get exact source links, never guessed URLs. */
export async function buildReferencePackages(root: string) {
  const manifests = new Map<string, { manifest: PackageManifest; directory?: string }>();
  const packages: Record<string, CodeReferencePackage> = {};
  const repositories: Record<string, string> = {};
  const packageSources: Record<string, string> = {};
  for (const workspace of workspaces) {
    const directory = resolve(root, "packages", workspace);
    const manifest = JSON.parse(await readFile(resolve(directory, "package.json"), "utf8"));
    manifests.set(manifest.name, { manifest, directory });
  }
  // Newly collected dependencies are not workspace roots for further manifest lookup.
  for (const { manifest, directory } of Array.from(manifests.values())) {
    for (const name of Object.keys({
      ...manifest.dependencies,
      ...manifest.peerDependencies,
      ...manifest.devDependencies,
    })) {
      if (manifests.has(name)) continue;
      try {
        const dependency = JSON.parse(
          await readFile(resolve(directory!, "node_modules", name, "package.json"), "utf8"),
        );
        manifests.set(name, { manifest: dependency });
      } catch {
        // Optional dependencies do not acquire invented manifest facts.
      }
    }
  }
  for (const name of new Set([...Object.keys(referencePackages), ...manifests.keys()])) {
    const entry = manifests.get(name);
    const manifest = entry?.manifest;
    const known = Object.hasOwn(referencePackages, name) ? referencePackages[name] : undefined;
    const repository = known?.repository ?? repositoryUrl(manifest?.repository);
    if (!repository) continue;
    repositories[name] = repository;
    const declaredDirectory = (manifest?.repository as { directory?: unknown } | undefined)
      ?.directory;
    const directory =
      known?.directory ??
      (typeof declaredDirectory === "string" &&
      /^[\w/-]+$/.test(declaredDirectory) &&
      !declaredDirectory.split("/").includes("..")
        ? declaredDirectory
        : undefined);
    packageSources[name] = directory
      ? `${repository}/tree/${known ? "main" : "HEAD"}/${directory}`
      : repository;
    packages[name] = {
      name,
      description: typeof manifest?.description === "string" ? manifest.description : "",
      repository,
      homepage:
        typeof manifest?.homepage === "string" && /^https?:\/\//.test(manifest.homepage)
          ? manifest.homepage
          : undefined,
      license: typeof manifest?.license === "string" ? manifest.license : undefined,
      private: manifest?.private === true,
    };
    // Installed third-party bundles need not contain their repository sources. Keep their verified owner.
    if (!entry?.directory || !known?.directory) continue;
    for (const [subpath, target] of Object.entries(manifest?.exports ?? {})) {
      if (subpath === "." || !subpath.startsWith("./") || subpath.includes("*")) continue;
      for (const exported of exportPaths(target)) {
        if (!exported.startsWith("./") || exported.split("/").includes("..")) continue;
        const relative = exported
          .replace(/^\.\/(?:dist\/|src\/)?/, "")
          .replace(/\.d\.[cm]?ts$/, ".ts")
          .replace(/\.[cm]?js$/, ".ts");
        let found = false;
        for (const path of [`src/${relative}`, `src/components/${relative}`, relative]) {
          try {
            await access(resolve(entry.directory, path));
          } catch {
            continue;
          }
          const source = `${known.directory}/${path}`;
          const index = /\/index\.tsx?$/.test(source);
          packageSources[`${name}/${subpath.slice(2)}`] =
            `${repository}/${index ? "tree" : "blob"}/main/${index ? dirname(source) : source}`;
          found = true;
          break;
        }
        if (found) break;
      }
    }
  }
  return { packages, repositories, packageSources };
}
