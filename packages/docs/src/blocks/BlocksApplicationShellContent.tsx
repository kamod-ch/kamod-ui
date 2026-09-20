/**
 * @file Application shell category, detail and standalone preview page content.
 * The registry supplies variant metadata; raw source imports power the copyable Code tab.
 * Internal URLs use withBasePath so these routes also work under the GitHub Pages prefix.
 * @see https://www.shadcnblocks.com/blocks/application-shell — related application shell catalog.
 * @see https://www.shadcnblocks.com/block/application-shell1 — block and detail-header design reference.
 */
import { applicationShellBlocks } from "@kamod-ch/blocks/application-shell";
import { ArrowLeftIcon, ExternalLinkIcon, RefreshCwIcon } from "@kamod-ch/icons/lucide";
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import { withBasePath } from "../base-path";
import { CodeBlock } from "../docs/components/CodeBlock";
import { DocsShell } from "../docs/components/DocsShell";
import { DemoShell, demoTopNavItems } from "../layout/DemoShell";
import { applicationShellSources } from "./application-shell-source";
import { BlockPreviewPanel } from "./BlockPreviewPanel";
import { BlocksTopbarActions } from "./BlocksSidebarContent";

const categoryPath = "/blocks/application-shell";
/** One registry entry, keeping page props aligned with the available block metadata. */
type ApplicationShellBlock = (typeof applicationShellBlocks)[number];

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

/**
 * Presents one variant's responsive preview and source browser.
 * Preview resets and file selection belong to this docs view, separate from shell state.
 *
 * @param props - A resolved registry entry with matching raw source files.
 */
const ShellDetail = ({ block }: { block: ApplicationShellBlock }) => {
  const [selectedFile, setSelectedFile] = useState(block.files[0].label);
  // A new key remounts the preview, resetting its sidebar, menus and demo selections.
  const [previewKey, setPreviewKey] = useState(0);
  const previewUrl = withBasePath(`${categoryPath}/${block.id}/preview`);
  return (
    <>
      <header class="blocks-detail-header">
        <a class="blocks-detail-back" href={withBasePath(categoryPath)}>
          <ArrowLeftIcon size={16} strokeWidth={2} aria-hidden="true" />
          All application shell blocks
        </a>
      </header>
      <article
        id={block.id}
        class="blocks-card"
        tabIndex={-1}
        aria-label={`${block.title} showcase`}
      >
        <div class="blocks-card-header">
          <div>
            <h1 class="blocks-card-title">{block.title}</h1>
            <p class="blocks-card-desc">{block.description}</p>
          </div>
          <div class="blocks-card-actions">
            <Button size="sm" variant="outline" onClick={() => setPreviewKey((key) => key + 1)}>
              <RefreshCwIcon
                size={14}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              />
              Refresh Preview
            </Button>
            <Button size="sm" variant="outline" href={previewUrl} target="_blank" rel="noreferrer">
              <ExternalLinkIcon
                size={14}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              />
              Open in New Tab
            </Button>
          </div>
        </div>
        <div class="blocks-card-body">
          <Tabs defaultValue="preview" class="docs-tabs">
            <TabsList class="docs-tabs-list" variant="line">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
            <TabsContent value="preview">
              <BlockPreviewPanel
                component={block.component}
                previewKey={previewKey}
                previewUrl={previewUrl}
                height={block.preview.height}
              />
            </TabsContent>
            <TabsContent value="code">
              <div class="blocks-install">
                <code>{block.installCommand}</code>
              </div>
              <div class="blocks-code-layout mt-3">
                <aside class="blocks-file-tree" aria-label="Block files">
                  <p class="blocks-file-tree-label">Files</p>
                  <ul class="blocks-file-tree-list">
                    {block.files.map((file) => (
                      <li key={file.label}>
                        <button
                          type="button"
                          class={`blocks-file-tree-btn ${selectedFile === file.label ? "is-active" : ""}`}
                          aria-pressed={selectedFile === file.label}
                          onClick={() => setSelectedFile(file.label)}
                        >
                          {file.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </aside>
                <div class="blocks-code-pane">
                  <CodeBlock
                    code={applicationShellSources[selectedFile]}
                    language="tsx"
                    className="docs-tab-code"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </article>
    </>
  );
};

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
