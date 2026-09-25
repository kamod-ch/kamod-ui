/** Sidebar detail and standalone previews; the shared overview only imports registry metadata. */
import { sidebarBlocks } from "@kamod-ch/blocks/sidebar";
import { BlockDetailPage } from "./BlockDetailPage";
import { BlockInstallation } from "./BlockInstallation";
import { BlockShowcase } from "./BlockShowcase";

export const BlocksSidebarDetailContent = ({ blockId }: { blockId?: string }) => {
  const block = sidebarBlocks.find((item) => item.id === blockId);
  return (
    <BlockDetailPage category="sidebar">
      {block ? (
        <>
          <BlockShowcase
            key={block.id}
            block={block}
            loadSource={async (file) =>
              (await import("./sidebar-source")).getSidebarBlockSource(block.id, file)
            }
          />
          <BlockInstallation block={block} category="sidebar" />
        </>
      ) : (
        <p>Block not found.</p>
      )}
    </BlockDetailPage>
  );
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
