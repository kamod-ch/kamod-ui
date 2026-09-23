/**
 * Category, detail and standalone preview routes for registered application shells.
 * Each detail section owns its content and interaction state; internal links respect the site base.
 * @see https://www.shadcnblocks.com/blocks/application-shell — related block catalog.
 */
import { applicationShellBlocks } from "@kamod-ch/blocks/application-shell";
import { withBasePath } from "../base-path";
import { DocsShell } from "../docs/components/DocsShell";
import { DemoShell, demoTopNavItems } from "../layout/DemoShell";
import { ShellDesignReference, ShellExplanation } from "./ApplicationShellAbout";
import { ShellTableOfContents } from "./ApplicationShellContents";
import { ShellFooter } from "./ApplicationShellFooter";
import { ShellPageHeader } from "./ApplicationShellHeader";
import { ShellProps } from "./ApplicationShellProps";
import { ShellSetup, ShellUsage } from "./ApplicationShellSetup";
import { ShellShowcase } from "./ApplicationShellShowcase";
import { type ApplicationShellBlock, categoryPath } from "./application-shell-config";
import { BlocksTopbarActions } from "./BlocksSidebarContent";

/**
 * Renders the category overview with one detail-page link per registered application shell.
 * Uses the shared docs sidebar and marks Application Shell as the active block category.
 */
export const BlocksApplicationShellContent = () => (
  <DocsShell
    sidebarScope="blocks"
    activeDoc={null}
    activeSection=""
    docs={[]}
    activeBlock="application-shell"
    mainContent={
      <section class="docs-components-overview blocks-sidebar-page">
        <header class="blocks-hero">
          <h1>Application Shell Blocks</h1>
          <p class="blocks-hero-lead">
            Responsive application layouts built with Preact and Kamod UI.
          </p>
        </header>
        <ul class="docs-package-overview-grid blocks-overview-grid">
          {applicationShellBlocks.map((block) => (
            <li key={block.id}>
              <a
                class="docs-package-overview-card blocks-overview-card"
                href={withBasePath(`${categoryPath}/${block.id}`)}
              >
                <span class="docs-package-overview-label">{block.title}</span>
                <span class="docs-package-overview-summary">{block.description}</span>
                <code class="docs-package-overview-path">{block.installCommand}</code>
              </a>
            </li>
          ))}
        </ul>
      </section>
    }
  />
);

/** Composes the showcase and guide without owning either component’s interaction state. */
const ShellDetail = ({ block }: { block: ApplicationShellBlock }) => (
  <>
    <ShellPageHeader block={block} />
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
    <DemoShell
      brand="Kamod UI"
      rootClassName="docs-shell"
      topNavItems={demoTopNavItems}
      topbarActions={<BlocksTopbarActions />}
      mainContent={
        <section class="docs-components-overview blocks-sidebar-page blocks-sidebar-detail">
          {block ? (
            <ShellDetail block={block} />
          ) : (
            <>
              <a class="blocks-detail-back" href={withBasePath(categoryPath)}>
                All application shell blocks
              </a>
              <p>Block not found.</p>
            </>
          )}
        </section>
      }
    />
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
