import { type BlockCategory, blockCategories } from "./block-categories";
import { visibleBlockNavItems } from "./block-nav-config";

export type PublishedBlockOverviewItem = {
  key: string;
  label: string;
  href: string;
  count: number;
  description: string;
};

export function overviewTeaser(description: string): string {
  return `${description.replace(/[`*]/g, "").split(". ")[0]}.`;
}

/** Published collections for /blocks and sidebar navigation, without loading live demos. */
export function publishedBlockOverviewItems(): PublishedBlockOverviewItem[] {
  const items: PublishedBlockOverviewItem[] = [];
  for (const item of visibleBlockNavItems) {
    if (item.key in blockCategories) {
      const category = blockCategories[item.key as BlockCategory];
      items.push({
        key: item.key,
        label: item.label,
        href: item.href,
        count: category.blocks.length,
        description: category.description,
      });
    }
  }
  return items.sort((a, b) => a.label.localeCompare(b.label));
}
