/** A single random discovery link above the desktop category navigation. */
import { useEffect, useState } from "preact/hooks";
import { withBasePath } from "../base-path";
import { BlockThumbnail } from "./BlockThumbnail";
import { type BlockCategory, type BlockOverviewEntry, blockCategories } from "./block-categories";
import { getBlockDisplayName } from "./block-overview-details";

/** Pick once after hydration; theme changes do not change the selected block. */
export function BlockCategoryPreview({ category }: { category: BlockCategory }) {
  const [block, setBlock] = useState<BlockOverviewEntry | null>(null);
  useEffect(() => {
    const variants = blockCategories[category].blocks;
    setBlock(variants[Math.floor(Math.random() * variants.length)] ?? null);
  }, [category]);

  if (!block) return null;
  const displayName = getBlockDisplayName(block.title);
  return (
    <a
      class="blocks-category-preview blocks-category-preview-link"
      href={withBasePath(`/blocks/${category}/${block.id}`)}
      aria-label={`Explore ${displayName} from this collection`}
    >
      <span class="blocks-category-preview-label">From this collection</span>
      <BlockThumbnail category={category} blockId={block.id} sizes="300px" />
    </a>
  );
}
