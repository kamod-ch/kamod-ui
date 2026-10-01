/** A lightweight discovery preview above the desktop category navigation. */
import { ArrowUpRightIcon, PackagePlusIcon } from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { Button } from "@kamod-ch/ui";
import { useEffect, useState } from "preact/hooks";
import { withBasePath } from "../base-path";
import { BlockThumbnail } from "./BlockThumbnail";
import { type BlockCategory, type BlockOverviewEntry, blockCategories } from "./block-categories";
import { getBlockOverviewDetails } from "./block-overview-details";

/** Pick once after hydration; theme changes do not change the selected block. */
export function BlockCategoryPreview({ category }: { category: BlockCategory }) {
  const [block, setBlock] = useState<BlockOverviewEntry | null>(null);
  useEffect(() => {
    const variants = blockCategories[category].blocks;
    setBlock(variants[Math.floor(Math.random() * variants.length)] ?? null);
  }, [category]);

  if (!block) return null;
  const { displayName, sourceUrl, installationId } = getBlockOverviewDetails(category, block);
  const detailUrl = withBasePath(`/blocks/${category}/${block.id}`);
  return (
    <div class="blocks-category-preview">
      <div class="blocks-category-preview-meta">
        <div class="blocks-category-preview-title">
          <span class="blocks-category-preview-name">{displayName}</span>
          <span class="blocks-category-preview-code">
            <span aria-hidden="true">/</span>
            <code>{block.title}</code>
          </span>
        </div>
        <div
          class="blocks-category-preview-actions"
          role="group"
          aria-label={`${displayName} links`}
        >
          <Button
            variant="ghost"
            size="icon-xs"
            href={detailUrl}
            aria-label={`View ${displayName} details`}
            title="View block details"
          >
            <ArrowUpRightIcon size={13} strokeWidth={1.75} aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            href={sourceUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${displayName} source on GitHub (opens in a new tab)`}
            title="View source on GitHub"
          >
            <BrandGithubIcon size={13} aria-hidden="true" />
          </Button>
          {/* Native navigation preserves the installation fragment across routes. */}
          <Button
            variant="ghost"
            size="icon-xs"
            href={`${detailUrl}#${installationId}`}
            target="_self"
            aria-label={`Add ${displayName} to your project`}
            title="Add this block"
          >
            <PackagePlusIcon size={13} strokeWidth={1.75} aria-hidden="true" />
          </Button>
        </div>
      </div>
      <a
        class="blocks-category-preview-link"
        href={detailUrl}
        aria-label={`Explore ${displayName} from this collection`}
      >
        <BlockThumbnail category={category} blockId={block.id} sizes="300px" />
      </a>
      <p class="blocks-category-preview-caption">
        <span>A pick from this collection</span>
        <a
          href={`${detailUrl}#${block.id}`}
          target="_self"
          aria-label={`View ${displayName} preview`}
        >
          View preview <ArrowUpRightIcon size={10} strokeWidth={1.75} aria-hidden="true" />
        </a>
      </p>
    </div>
  );
}
