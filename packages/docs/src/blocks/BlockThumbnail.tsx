/** Shared theme-aware screenshots for overview cards and the category header preview. */
import { ArrowUpRightIcon, ImageIcon } from "@kamod-ch/icons/lucide";
import { resolvedColorSchemeSignal } from "@kamod-ch/themes";
import { useEffect, useState } from "preact/hooks";
import { withBasePath } from "../base-path";
import type { BlockCategory } from "./block-categories";
import thumbnails from "./generated/block-thumbnails.json";

type Thumbnail = { src: string; width: number; height: number };
type ThumbnailSet = Record<"light" | "dark", Thumbnail[]>;
const catalog: Record<string, ThumbnailSet> = thumbnails;

/** Conservative slot widths for the capped desktop grid, tablet pairs and single mobile cards. */
const defaultSizes =
  "(min-width: 1680px) 410px, (min-width: 1360px) 475px, (min-width: 980px) 35vw, (min-width: 668px) 50vw, 100vw";

function ThumbnailImage({
  images,
  eager,
  sizes,
}: {
  images?: Thumbnail[];
  eager: boolean;
  sizes: string;
}) {
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

/** Wait for the stored theme before loading an image; reset failures when its source changes. */
export function BlockThumbnail({
  category,
  blockId,
  eager = false,
  sizes = defaultSizes,
}: {
  category: BlockCategory;
  blockId: string;
  eager?: boolean;
  sizes?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const scheme = resolvedColorSchemeSignal.value;
  const images = mounted ? catalog[`${category}/${blockId}`]?.[scheme] : undefined;
  return (
    <ThumbnailImage
      key={`${category}/${blockId}/${mounted ? scheme : "pending"}`}
      images={images}
      eager={eager}
      sizes={sizes}
    />
  );
}
