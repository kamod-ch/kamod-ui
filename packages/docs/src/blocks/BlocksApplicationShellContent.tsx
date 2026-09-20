/**
 * @file Application shell category, detail and standalone preview page content.
 * The registry supplies variant metadata; raw source imports power the copyable Code tab.
 * Internal URLs use withBasePath so these routes also work under the GitHub Pages prefix.
 * @see https://www.shadcnblocks.com/blocks/application-shell — related application shell catalog.
 * @see https://www.shadcnblocks.com/block/application-shell1 — block and detail-header design reference.
 */
import { applicationShellBlocks } from "@kamod-ch/blocks/application-shell";
import {
  ArrowLeftIcon,
  BugIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  LinkIcon,
  RefreshCwIcon,
} from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { withBasePath } from "../base-path";
import { CodeBlock } from "../docs/components/CodeBlock";
import { DocsShell } from "../docs/components/DocsShell";
import { DemoShell, demoTopNavItems } from "../layout/DemoShell";
import { applicationShellSources } from "./application-shell-source";
import { BlockPreviewPanel } from "./BlockPreviewPanel";
import { BlocksTopbarActions } from "./BlocksSidebarContent";

const categoryPath = "/blocks/application-shell";
const repositoryUrl = "https://github.com/kamod-ch/kamod-ui";
/** One registry entry, keeping page props aligned with the available block metadata. */
type ApplicationShellBlock = (typeof applicationShellBlocks)[number];

/**
 * Makes a heading a native permalink with a link icon revealed on hover or keyboard focus.
 * The decorative icon sits outside the text flow, preserving alignment and accessible names.
 * @param props - The fragment target (or `top`) and the visible heading content.
 */
const ShellHeadingLink = ({ id, children }: { id: string; children: ComponentChildren }) => (
  <a class="blocks-doc-heading-link" href={`#${id}`}>
    <span class="blocks-doc-heading-icon" aria-hidden="true">
      <LinkIcon size={14} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </span>
    {children}
  </a>
);

/**
 * Introduces the variant and provides category, adjacent-variant and repository links.
 * Registry order determines previous/next destinations; missing neighbours render as
 * native disabled buttons rather than inert anchors. The source URL targets upstream
 * main, where the block becomes available once this feature is merged.
 *
 * @param props - The registered variant displayed by this detail page.
 */
const ShellPageHeader = ({ block }: { block: ApplicationShellBlock }) => {
  const displayName = `Application Shell ${block.id.replace("application-shell-", "")}`;
  const index = applicationShellBlocks.findIndex((entry) => entry.id === block.id);
  const neighbours = [
    {
      label: "Previous",
      rel: "prev",
      block: applicationShellBlocks[index - 1],
      Icon: ChevronLeftIcon,
    },
    {
      label: "Next",
      rel: "next",
      block: applicationShellBlocks[index + 1],
      Icon: ChevronRightIcon,
    },
  ];
  const sourceUrl = `${repositoryUrl}/tree/main/packages/blocks/src/${block.category}/${block.id}`;
  const issueQuery = new URLSearchParams({
    title: `bug(blocks): ${block.title} — `,
    body: `Block: ${block.title}\nSource: ${sourceUrl}\n\n### What happened?\n\n### Steps to reproduce\n\n1. \n\n### Expected behavior\n\n### Browser and screen size\n\n`,
  });

  return (
    <header class="blocks-shell-header" aria-labelledby={`${block.id}-overview`}>
      <div class="blocks-shell-header-intro">
        <a class="blocks-detail-back blocks-shell-header-back" href={withBasePath(categoryPath)}>
          <ArrowLeftIcon
            size={16}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          />
          All application shell blocks
        </a>
        <div class="blocks-shell-header-title-row">
          <h1 id={`${block.id}-overview`} tabIndex={-1}>
            <ShellHeadingLink id="top">
              {displayName} — Sidebar shell with breadcrumbs
            </ShellHeadingLink>
          </h1>
          <Badge variant="info" size="lg" class="py-1.5">
            Preact native
          </Badge>
        </div>
        <p>
          A responsive frame for your application, with a collapsible sidebar, grouped navigation,
          nested links and an account menu. Add your pages beneath the breadcrumb header and connect
          your own routing and user actions.
        </p>
      </div>
      <div class="blocks-shell-header-toolbar">
        <Breadcrumb aria-label="Block breadcrumb">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={withBasePath("/")}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={withBasePath("/blocks")}>Blocks</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={withBasePath(categoryPath)}>Application Shell</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{block.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div
          class="blocks-shell-header-actions"
          role="group"
          aria-label="Block navigation and links"
        >
          {neighbours.map(({ label, rel, block: neighbour, Icon }) => (
            <Button
              key={rel}
              variant="ghost"
              size="icon"
              {...(neighbour
                ? { href: withBasePath(`${categoryPath}/${neighbour.id}`), rel }
                : { type: "button", disabled: true })}
              aria-label={
                neighbour ? `${label} variant: ${neighbour.title}` : `${label} variant unavailable`
              }
              title={
                neighbour ? `${label}: ${neighbour.title}` : `No ${label.toLowerCase()} variant`
              }
            >
              <Icon
                size={16}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              />
            </Button>
          ))}
          <Button
            variant="ghost"
            size="icon"
            href={`${repositoryUrl}/issues/new?${issueQuery}`}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`Report a bug with ${block.title} on GitHub (opens in a new tab)`}
            title="Report a bug on GitHub"
          >
            <BugIcon
              size={16}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            href={sourceUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`View ${block.title} source on GitHub (opens in a new tab)`}
            title="View source on GitHub"
          >
            <BrandGithubIcon size={16} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  );
};

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
      <ShellPageHeader block={block} />
      <article
        id={block.id}
        class="blocks-card"
        tabIndex={-1}
        aria-label={`${block.title} showcase`}
      >
        <div class="blocks-card-header">
          <div>
            <h2 class="blocks-card-title">
              <ShellHeadingLink id={block.id}>{block.title}</ShellHeadingLink>
            </h2>
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
