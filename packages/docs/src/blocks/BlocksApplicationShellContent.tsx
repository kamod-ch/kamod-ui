/**
 * Detail and standalone preview routes for registered application shells.
 * Each detail section owns its content and interaction state; internal links respect the site base.
 * @see https://www.shadcnblocks.com/blocks/application-shell — related block catalog.
 */
import { applicationShellBlocks } from "@kamod-ch/blocks/application-shell";
import { withBasePath } from "../base-path";
import { ShellDesignReference, ShellExplanation } from "./ApplicationShellAbout";
import { ShellTableOfContents } from "./ApplicationShellContents";
import { ShellFooter } from "./ApplicationShellFooter";
import { ShellPageHeader } from "./ApplicationShellHeader";
import { ShellProps } from "./ApplicationShellProps";
import { ShellSetup, ShellUsage } from "./ApplicationShellSetup";
import { ShellShowcase } from "./ApplicationShellShowcase";
import { type ApplicationShellBlock, categoryPath } from "./application-shell-config";
import { BlockDetailPage } from "./BlockDetailPage";

/** Composes the showcase and guide without owning either component’s interaction state. */
const ShellDetail = ({ block }: { block: ApplicationShellBlock }) => (
  <>
    <ShellShowcase key={block.id} block={block} />
    <section class="blocks-doc-guide" aria-label={`${block.title} documentation`}>
      <div class="blocks-detail-documentation">
        <ShellTableOfContents block={block} />
        <div class="blocks-doc-body">
          <ShellSetup />
          <ShellUsage />
          <ShellProps />
          <ShellExplanation />
          <ShellDesignReference />
        </div>
        <ShellFooter block={block} />
      </div>
    </section>
  </>
);

/**
 * Resolves a variant and wraps its detail view in the documentation site's top navigation.
 * Missing or unknown IDs show a not-found message while retaining the category return link.
 *
 * @param props - Route data; `blockId` must match a registry ID such as `application-shell-1`.
 */
export const BlocksApplicationShellDetailContent = ({ blockId }: { blockId?: string }) => {
  const block = applicationShellBlocks.find((item) => item.id === blockId);
  return (
    <BlockDetailPage
      category="application-shell"
      header={block ? <ShellPageHeader block={block} /> : undefined}
    >
      {block ? <ShellDetail block={block} /> : <p>Block not found.</p>}
    </BlockDetailPage>
  );
};

/**
 * Renders a registered demo without site chrome for iframe and new-tab previews.
 * Unknown IDs show a small fallback with a link back to the category overview.
 *
 * @param props - Preview route data; `id` matches the same registry ID as the detail route.
 */
export const ApplicationShellBlocksPreviewContent = ({ id }: { id?: string }) => {
  const block = applicationShellBlocks.find((item) => item.id === id);
  if (!block)
    return (
      <main>
        <p>Block not found.</p>
        <a href={withBasePath(categoryPath)}>All application shell blocks</a>
      </main>
    );
  const Preview = block.component;
  return <Preview />;
};
