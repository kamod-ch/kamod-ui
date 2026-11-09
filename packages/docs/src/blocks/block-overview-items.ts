import {
  overviewTeaser,
  type PublishedBlockOverviewItem,
  publishedBlockOverviewList,
} from "./block-library-metadata";

export type { PublishedBlockOverviewItem };
export { overviewTeaser };

/** Published collections for /blocks and sidebar navigation, without loading live demos. */
export function publishedBlockOverviewItems(): PublishedBlockOverviewItem[] {
  return publishedBlockOverviewList();
}
