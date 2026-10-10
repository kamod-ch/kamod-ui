/** Registry-driven headers for all documented block variants. */
import { BugIcon, ChevronLeftIcon, ChevronRightIcon } from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { Button } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { withBasePath } from "../base-path";
import { BlockDetailDescription } from "./BlockDetailDescription";
import { BlockHeadingLink } from "./BlockHeadingLink";
import { BlockPageHeader } from "./BlockPageHeader";
import { type BlockCategory, type BlockOverviewEntry, blockCategories } from "./block-categories";
import { getBlockDetailTitle } from "./block-detail-titles";
import { blockIssueUrl, blockSourceUrl } from "./block-links";
import { ShowcaseHeading } from "./ShowcaseHeading";

export type BlockDetailHeaderProps = {
  category: BlockCategory;
  block: BlockOverviewEntry;
  /** Richer guides can retain their existing title and introduction. */
  title?: string;
  description?: ComponentChildren;
  descriptionLink?: ComponentChildren;
  className?: string;
};

/** Preserve variant content while sharing collection typography, spacing and toolbar behavior. */
export function BlockDetailHeader({
  category,
  block,
  title,
  description,
  descriptionLink,
  className = "",
}: BlockDetailHeaderProps) {
  return (
    <BlockPageHeader
      category={category}
      variant={block.title}
      className={`blocks-variant-header ${className}`}
      id={`${block.id}-overview`}
      title={<BlockHeadingLink id="top">{title ?? getBlockDetailTitle(block)}</BlockHeadingLink>}
      eyebrow={category === "login" || category === "signup" ? "Form block" : "Layout block"}
      description={description ?? <BlockDetailDescription category={category} block={block} />}
      descriptionLink={descriptionLink}
      summaryLabel={<ShowcaseHeading />}
      actions={<BlockDetailHeaderActions category={category} block={block} />}
    />
  );
}

/** Registry order defines neighbouring variants; boundaries remain native disabled controls. */
function BlockDetailHeaderActions({
  category,
  block,
}: Pick<BlockDetailHeaderProps, "category" | "block">) {
  const variants = blockCategories[category].blocks;
  const index = variants.findIndex((entry) => entry.id === block.id);
  const sourceUrl = blockSourceUrl(category, block.id);
  const neighbours = [
    { label: "Previous", rel: "prev", block: variants[index - 1], Icon: ChevronLeftIcon },
    { label: "Next", rel: "next", block: variants[index + 1], Icon: ChevronRightIcon },
  ];
  return (
    <>
      <p class="blocks-overview-count">
        Variant <strong>{index + 1}</strong> of {variants.length}
      </p>
      <span class="blocks-overview-summary-separator" aria-hidden="true">
        ·
      </span>
      <div class="blocks-page-header-links" role="group" aria-label="Block navigation and links">
        {neighbours.map(({ label, rel, block: neighbour, Icon }) => (
          <Button
            class="docs-icon-button"
            key={rel}
            variant="ghost"
            size="icon-sm"
            {...(neighbour
              ? { href: withBasePath(`/blocks/${category}/${neighbour.id}`), rel }
              : { type: "button", disabled: true })}
            aria-label={
              neighbour ? `${label} variant: ${neighbour.title}` : `${label} variant unavailable`
            }
            title={neighbour ? `${label}: ${neighbour.title}` : `No ${label.toLowerCase()} variant`}
          >
            <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
          </Button>
        ))}
        <Button
          class="docs-icon-button"
          variant="ghost"
          size="icon-sm"
          href={blockIssueUrl(block.title, sourceUrl, "Block")}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`Report a bug with ${block.title} on GitHub (opens in a new tab)`}
          title="Report a bug on GitHub"
        >
          <BugIcon size={16} strokeWidth={1.75} aria-hidden="true" />
        </Button>
        <Button
          class="docs-icon-button"
          variant="ghost"
          size="icon-sm"
          href={sourceUrl}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`View ${block.title} source on GitHub (opens in a new tab)`}
          title="View source on GitHub"
        >
          <BrandGithubIcon size={16} aria-hidden="true" />
        </Button>
      </div>
    </>
  );
}
