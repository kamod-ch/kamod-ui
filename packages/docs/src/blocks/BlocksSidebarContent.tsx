/** Sidebar detail and standalone previews; the shared overview only imports registry metadata. */
import { sidebarBlocks } from "@kamod-ch/blocks/sidebar";
import { BlockVariantDetail, type VariantSourceLoader } from "./BlockVariantDetail";

const loadSource: VariantSourceLoader<(typeof sidebarBlocks)[number]["id"]> = async (
  blockId,
  file,
) => (await import("./sidebar-source")).getSidebarBlockSource(blockId, file);

export const BlocksSidebarDetailContent = ({ blockId }: { blockId?: string }) => {
  const block = sidebarBlocks.find((item) => item.id === blockId);
  return <BlockVariantDetail category="sidebar" block={block} loadSource={loadSource} />;
};

export const BlocksPreviewContent = ({ id }: { id?: string }) => {
  const block = sidebarBlocks.find((item) => item.id === id) ?? sidebarBlocks[0];
  const Preview = block.component;
  return (
    <div class="min-h-svh bg-background text-foreground">
      <Preview />
    </div>
  );
};
