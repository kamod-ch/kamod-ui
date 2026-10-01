/**
 * Detail and standalone preview routes for registered application shells.
 * Each detail section owns its content and interaction state; internal links respect the site base.
 * @see https://www.shadcnblocks.com/blocks/application-shell — related block catalog.
 */
import { applicationShellBlocks } from "@kamod-ch/blocks/application-shell";
import { withBasePath } from "../base-path";
import { ShellPageHeader } from "./ApplicationShellHeader";
import { ShellShowcase } from "./ApplicationShellShowcase";
import { type ApplicationShellBlock, categoryPath } from "./application-shell-config";
import { BlockDetailPage } from "./BlockDetailPage";
import { applicationShellSections } from "./detail/application-shell-sections";
import { BlockDocumentation } from "./detail/BlockDocumentation";

/** Composes the showcase and guide without owning either component’s interaction state. */
const ShellDetail = ({ block }: { block: ApplicationShellBlock }) => (
  <>
    <ShellShowcase key={block.id} block={block} />
    <BlockDocumentation
      block={block}
      category="application-shell"
      sections={applicationShellSections}
      contentsId="application-shell-contents"
    />
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
