/** Visual comparison stays lightweight: only detail pages mount the interactive blocks. */
import { ArrowUpRightIcon, ImageIcon } from "@kamod-ch/icons/lucide";
import { resolvedColorSchemeSignal } from "@kamod-ch/themes";
import { Badge, Card } from "@kamod-ch/ui";
import { useEffect, useState } from "preact/hooks";
import { withBasePath } from "../base-path";
import type { BlockCategory, BlockOverviewEntry } from "./block-categories";
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
    </span>
  );
}

/** A single focusable link: preview images and metadata never introduce nested controls. */
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
  const titleId = `${block.id}-title`;
  const descriptionId = `${block.id}-description`;
  return (
    <a
      class="blocks-overview-card"
      href={withBasePath(`/blocks/${category}/${block.id}`)}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <Card class="blocks-overview-surface">
        <ThumbnailImage key={mounted ? scheme : "pending"} images={images} eager={eager} />
        <div class="blocks-overview-info">
          <div class="blocks-overview-title-row">
            <h2 id={titleId}>{block.title}</h2>
            <span class="blocks-overview-open" aria-hidden="true">
              <ArrowUpRightIcon
                size={18}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </span>
          </div>
          <p id={descriptionId}>{block.description}</p>
          <div class="blocks-overview-tags">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" size="xs">
                {tag.replaceAll("-", " ")}
              </Badge>
            ))}
          </div>
        </div>
        <div class="blocks-overview-footer">
          <code title={block.installCommand}>{block.installCommand}</code>
          <span>
            View block <span aria-hidden="true">→</span>
          </span>
        </div>
      </Card>
    </a>
  );
}
