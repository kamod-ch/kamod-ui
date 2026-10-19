import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { CodeReferenceHelp, CodeReferenceHelpSection } from "../src/references/types.ts";

export type TechnologySnapshot = {
  reviewedAt?: string;
  sourceKind?: "project-authored";
  sections: CodeReferenceHelpSection[];
  resources: NonNullable<CodeReferenceHelp["related"]>;
};

export const technologySnapshotFile = (root: string) =>
  resolve(root, "packages/docs/.preactpress/content/reference-technologies.json");

/** Read private saved data afresh after dev invalidation; never import a frozen config snapshot. */
export function technologySnapshots(root = resolve(import.meta.dirname, "../../..")) {
  const saved = JSON.parse(readFileSync(technologySnapshotFile(root), "utf8")) as {
    schemaVersion: number;
    profiles: Record<string, TechnologySnapshot>;
  };
  if (saved.schemaVersion !== 1 || !saved.profiles)
    throw new Error("Unsupported saved technology reference format");
  return saved.profiles;
}
