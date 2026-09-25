/** Basic detail template for blocks that share the standard showcase and copy/setup guide. */
import { useCallback } from "preact/hooks";
import { BlockDetailPage } from "./BlockDetailPage";
import { BlockInstallation } from "./BlockInstallation";
import { BlockShowcase, type ShowcaseBlock } from "./BlockShowcase";
import type { BlockCategory, BlockOverviewEntry } from "./block-categories";

/** Category-specific raw source modules are imported only when the Code tab requests a file. */
export type VariantSourceLoader<Id extends string> = (blockId: Id, file: string) => Promise<string>;

export function BlockVariantDetail<Id extends string>({
  category,
  block,
  loadSource,
}: {
  category: BlockCategory;
  block?: ShowcaseBlock & BlockOverviewEntry & { id: Id };
  loadSource: VariantSourceLoader<Id>;
}) {
  const loadFile = useCallback(
    (file: string) =>
      block ? loadSource(block.id, file) : Promise.reject(new Error("Block not found")),
    [block, loadSource],
  );
  return (
    <BlockDetailPage category={category}>
      {block ? (
        <>
          <BlockShowcase key={block.id} block={block} loadSource={loadFile} />
          <BlockInstallation block={block} category={category} />
        </>
      ) : (
        <p>Block not found.</p>
      )}
    </BlockDetailPage>
  );
}
