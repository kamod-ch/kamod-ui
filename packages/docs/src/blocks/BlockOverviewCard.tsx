/** Visual comparison stays lightweight: only detail pages mount the interactive blocks. */
import { ArrowUpRightIcon, ImageIcon, PackagePlusIcon, TagIcon } from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { resolvedColorSchemeSignal } from "@kamod-ch/themes";
import { Badge, Button, Card } from "@kamod-ch/ui";
import { useEffect, useState } from "preact/hooks";
import { withBasePath } from "../base-path";
import type { BlockCategory, BlockOverviewEntry } from "./block-categories";
import { getBlockOverviewDetails } from "./block-overview-details";
import thumbnails from "./generated/block-thumbnails.json";

type Thumbnail = { src: string; width: number; height: number };
type ThumbnailSet = Record<"light" | "dark", Thumbnail[]>;
const catalog: Record<string, ThumbnailSet> = thumbnails;

/** Matches the responsive grid; the browser selects a suitable asset for width and pixel density. */
const sizes = "(min-width: 1680px) 30vw, (min-width: 980px) 40vw, (min-width: 640px) 50vw, 100vw";

function ThumbnailImage({ images, eager }: { images?: Thumbnail[]; eager: boolean }) {
  const [failed, setFailed] = useState(false);
  const largest = images?.at(-1);
  return (
    <span class="blocks-overview-preview" aria-hidden="true">
      <span class="blocks-overview-placeholder">
        <ImageIcon size={24} strokeWidth={1.5} />
        <span>{failed || !largest ? "Explore the live demo" : "Loading preview"}</span>
      </span>
      {largest && !failed && (
        <img
          src={withBasePath(largest.src)}
          srcSet={images?.map((image) => `${withBasePath(image.src)} ${image.width}w`).join(", ")}
          sizes={sizes}
          width={largest.width}
          height={largest.height}
          alt=""
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
      <span class="blocks-overview-open">
        <ArrowUpRightIcon size={13} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </span>
    </span>
  );
}

/** Preview/title navigation and footer actions are sibling links, never nested controls. */
export function BlockOverviewCard({
  block,
  category,
  eager = false,
}: {
  block: BlockOverviewEntry;
  category: BlockCategory;
  eager?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Wait for the stored theme before assigning image URLs; SSR cannot know that preference.
  // This prevents an unnecessary light-image download on an explicitly dark first visit.
  const scheme = resolvedColorSchemeSignal.value;
  const images = mounted ? catalog[`${category}/${block.id}`]?.[scheme] : undefined;
  const tags = (block.features?.length ? block.features : block.tags).slice(0, 3);
  const { displayName, note, sourceUrl, installationId } = getBlockOverviewDetails(category, block);
  const detailUrl = withBasePath(`/blocks/${category}/${block.id}`);
  const titleId = `${block.id}-title`;
  const descriptionId = `${block.id}-description`;
  const [pathScope, ...pathSegments] = block.installCommand.split("/");
  const pathName = pathSegments.pop();
  return (
    <Card class="blocks-overview-surface">
      <a
        class="blocks-overview-card"
        href={detailUrl}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <ThumbnailImage key={mounted ? scheme : "pending"} images={images} eager={eager} />
        <div class="blocks-overview-info">
          <div class="blocks-overview-title-row">
            <h2 id={titleId}>
              <span>{displayName}</span>
              <span class="blocks-overview-code-label">
                <span class="blocks-overview-title-separator" aria-hidden="true">
                  /
                </span>
                <code>{block.title}</code>
              </span>
            </h2>
          </div>
          <p id={descriptionId}>
            {block.description} {note}
          </p>
          <div class="blocks-overview-tags">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" size="xs">
                <TagIcon size={11} strokeWidth={1.75} aria-hidden="true" />
                {tag.replaceAll("-", " ")}
              </Badge>
            ))}
          </div>
        </div>
      </a>
      <div class="blocks-overview-footer">
        <div class="blocks-overview-actions">
          <div class="blocks-overview-path">
            <code title={block.installCommand}>
              <span class="sr-only">{block.installCommand}</span>
              <span aria-hidden="true">{pathScope}/</span>
              <span class="blocks-overview-path-middle" aria-hidden="true">
                {pathSegments.join("/")}/
              </span>
              <span aria-hidden="true">{pathName}</span>
            </code>
          </div>
          <div class="blocks-overview-action-links">
            <Button
              variant="ghost"
              size="icon-sm"
              href={sourceUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${displayName} source on GitHub (opens in a new tab)`}
              title="View source on GitHub"
            >
              <BrandGithubIcon size={13} aria-hidden="true" />
            </Button>
            {/* Native navigation preserves fragment scrolling across PreactPress routes. */}
            <Button
              variant="ghost"
              size="icon-sm"
              href={`${detailUrl}#${installationId}`}
              target="_self"
              aria-label={`Add ${displayName} to your project`}
              title="Add this block"
            >
              <PackagePlusIcon size={13} strokeWidth={1.75} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
