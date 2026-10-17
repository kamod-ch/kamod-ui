import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { type BlockCategory, blockCategories } from "../src/blocks/block-categories";
import type { CodeReferenceHelp } from "../src/references/types";
import { blockReferenceSections } from "./block-reference-sections";
import { sourceSectionIds } from "./inline-reference-pages";

/** Component-free metadata owns variants, dependencies and file lists; folders must exist. */
export async function buildBlockReferences(root: string) {
  const records: {
    id: string;
    facts: CodeReferenceHelp;
    aliases: string[];
    href: string;
    sections: string[];
  }[] = [];
  const guide = await readFile(
    resolve(root, "packages/docs/src/blocks/detail/VariantDocumentation.tsx"),
    "utf8",
  );
  for (const [category, group] of Object.entries(blockCategories)) {
    for (const [position, block] of group.blocks.entries()) {
      const href = `/blocks/${category}/${block.id}`;
      const directory = `packages/blocks/src/${category}/${block.id}`;
      try {
        await access(resolve(root, directory));
      } catch {
        continue;
      }
      const files = (
        await Promise.all(
          block.files.map(async (file) => {
            try {
              await access(resolve(root, "packages/blocks", file.path));
              return file.path;
            } catch {
              return undefined;
            }
          }),
        )
      ).filter((file): file is string => !!file);
      const aliases = [
        block.id,
        block.title,
        `${category}/${block.id}`,
        block.installCommand,
        directory,
        `${group.label} ${position + 1}`,
        `${group.label.replaceAll(" ", "")}${position + 1}`,
        `${group.label.replaceAll(" ", "")}${String(position + 1).padStart(2, "0")}`,
      ];
      if (files.some((file) => file.endsWith(`/${block.id}.tsx`))) aliases.push(`${block.id}.tsx`);
      const sections =
        category === "application-shell"
          ? sourceSectionIds(
              await readFile(
                resolve(
                  root,
                  "packages/docs/src/blocks/detail",
                  block.id === "application-shell-1"
                    ? "application-shell-sections.ts"
                    : "application-shell-variant-guides.tsx",
                ),
                "utf8",
              ),
            )
          : sourceSectionIds(guide, category, block.id);
      records.push({
        id: `block:${category}/${block.id}`,
        href,
        aliases,
        sections,
        facts: {
          kind: "block",
          name: block.id,
          module: block.installCommand,
          originLabel: "Workspace target",
          description: block.description,
          detail:
            "This identifies private workspace source, not a published installable package. Copy the complete file set and connect your application’s routes and services.",
          facts: [
            { label: "Collection", value: group.label },
            { label: "Source files", value: String(files.length) },
            { label: "Dependencies", value: block.dependencies.join(", ") },
          ],
          docs: { label: "Block guide", href },
          source: {
            label: "Source directory",
            href: `https://github.com/kamod-ch/kamod-ui/tree/main/${directory}`,
          },
          related: [
            { label: "Live preview", href: `${href}/preview`, kind: "guide" },
            {
              label: "Copy & setup",
              href: `${href}#${category === "application-shell" ? "application-shell" : block.id}-copy`,
              kind: "guide",
            },
          ],
          sections: blockReferenceSections(
            category as BlockCategory,
            block,
            await Promise.all(
              files
                .filter(
                  (file) =>
                    /\.[cm]?[jt]sx?$/.test(file) &&
                    !/(?:^|\/)(?:preview|demo-data|preview-data)(?:\.|\/)/.test(file),
                )
                .map(async (file) => ({
                  file: `packages/blocks/${file}`,
                  source: await readFile(resolve(root, "packages/blocks", file), "utf8"),
                })),
            ),
          ),
        },
      });
    }
  }
  return records;
}
