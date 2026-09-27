/** Shared variant page with a showcase and the complete, source-backed block guide. */
import { useCallback } from "preact/hooks";
import { BlockDetailHeader } from "./BlockDetailHeader";
import { BlockDetailPage } from "./BlockDetailPage";
import { BlockShowcase, type ShowcaseBlock } from "./BlockShowcase";
import type { BlockCategory, BlockOverviewEntry } from "./block-categories";
import { VariantDocumentation } from "./detail/VariantDocumentation";

/** Category-specific raw source modules are imported only when the Code tab requests a file. */
export type VariantSourceLoader<Id extends string> = (blockId: Id, file: string) => Promise<string>;

export function BlockVariantDetail<Id extends string>({
  category,
  block,
  loadSource,
}: {
  category: Exclude<BlockCategory, "application-shell">;
  block?: ShowcaseBlock & BlockOverviewEntry & { id: Id };
  loadSource: VariantSourceLoader<Id>;
}) {
  const loadFile = useCallback(
    (file: string) =>
      block ? loadSource(block.id, file) : Promise.reject(new Error("Block not found")),
    [block, loadSource],
  );
  return (
    <BlockDetailPage
      category={category}
      header={block ? <BlockDetailHeader category={category} block={block} /> : undefined}
    >
      {block ? (
        <>
          <BlockShowcase key={block.id} block={block} loadSource={loadFile} headingLevel="h2" />
          <VariantDocumentation key={block.id} block={block} category={category} />
        </>
      ) : (
        <p>Block not found.</p>
      )}
    </BlockDetailPage>
  );
}
