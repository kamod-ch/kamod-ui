import { type SidebarBlockId, sidebarBlocks } from "@kamod-ch/blocks";
import { Button, Tabs, TabsContent, TabsList, TabsTrigger, ThemeToggle } from "@kamod-ch/ui";
import { ArrowLeft, Check, Copy, ExternalLink, RefreshCw, SunMoon } from "lucide-preact";
import { useMemo, useState } from "preact/hooks";
import { withBasePath } from "../base-path";
import { CodeBlock } from "../docs/components/CodeBlock";
import { DocsShell } from "../docs/components/DocsShell";
import { DemoShell, demoTopNavItems } from "../layout/DemoShell";
import { GithubRepoLink } from "../layout/GithubRepoLink";
import { ThemePresetSelect } from "../theme/ThemePresetSelect";
import { BlockPreviewPanel } from "./BlockPreviewPanel";
import { getSidebarBlockSource } from "./sidebar-source";

export const BlocksSidebarContent = () => (
  <DocsShell
    sidebarScope="blocks"
    activeDoc={null}
    activeSection=""
    docs={[]}
    activeBlock="sidebar"
    mainContent={<BlocksSidebarOverview />}
  />
);

export const BlocksSidebarDetailContent = ({ blockId }: { blockId?: string }) => {
  const block = sidebarBlocks.find((item) => item.id === blockId);

  return (
    <DemoShell
      brand="Kamod UI"
      rootClassName="docs-shell"
      topNavItems={demoTopNavItems}
      topbarActions={<BlocksTopbarActions />}
      mainContent={
        block ? (
          <section class="docs-components-overview blocks-sidebar-page blocks-sidebar-detail">
            <header class="blocks-detail-header">
              <a class="blocks-detail-back" href={withBasePath("/blocks/sidebar")}>
                <ArrowLeft size={16} aria-hidden="true" />
                All sidebar blocks
              </a>
            </header>
            <BlockCard block={block} />
          </section>
        ) : (
          <section class="docs-components-overview blocks-sidebar-page blocks-sidebar-detail">
            <p>Block not found.</p>
            <a href={withBasePath("/blocks/sidebar")}>Back to sidebar blocks</a>
          </section>
        )
      }
    />
  );
};

const BlocksSidebarOverview = () => (
  <section class="docs-components-overview blocks-sidebar-page">
    <header class="blocks-hero">
      <h1>Building Blocks for the Web</h1>
      <p class="blocks-hero-lead">
        Clean, modern building blocks. Copy and paste into your apps. Built with Preact and Kamod
        UI. Open Source.
      </p>
    </header>
    <ul class="docs-package-overview-grid blocks-overview-grid">
      {sidebarBlocks.map((block) => (
        <li key={block.id}>
          <a
            class="docs-package-overview-card blocks-overview-card"
            href={withBasePath(`/blocks/sidebar/${block.id}`)}
          >
            <span class="docs-package-overview-label">{block.id}</span>
            <span class="docs-package-overview-summary">{block.description}</span>
            <code class="docs-package-overview-path">{block.installCommand}</code>
          </a>
        </li>
      ))}
    </ul>
  </section>
);

type SidebarBlock = (typeof sidebarBlocks)[number];

const buildFileTree = (files: SidebarBlock["files"]) => {
  const tree: { dir: string; files: { label: string; path: string }[] }[] = [];
  const byDir = new Map<string, { label: string; path: string }[]>();

  for (const file of files) {
    const parts = file.label.split("/");
    const dir = parts.length > 1 ? parts.slice(0, -1).join("/") : ".";
    const leaf = parts[parts.length - 1] ?? file.label;
    const list = byDir.get(dir) ?? [];
    list.push({ label: leaf, path: file.label });
    byDir.set(dir, list);
  }

  for (const [dir, entries] of byDir) {
    tree.push({ dir, files: entries });
  }
  return tree;
};

const BlockCard = ({ block }: { block: SidebarBlock }) => {
  const [selectedFile, setSelectedFile] = useState(block.files[0]?.label ?? "");
  const [previewKey, setPreviewKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const previewUrl = withBasePath(`/blocks/sidebar/${block.id}/preview`);
  const source = getSidebarBlockSource(block.id as SidebarBlockId, selectedFile);
  const fileTree = useMemo(() => buildFileTree(block.files), [block.files]);
  const installCommand = block.installCommand;

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <article id={block.id} class="blocks-card">
      <div class="blocks-card-header">
        <div>
          <p class="blocks-card-title">{block.id}</p>
          <h2 class="blocks-card-desc">{block.description}</h2>
        </div>
        <div class="blocks-card-actions">
          <Button size="sm" variant="outline" onClick={() => setPreviewKey((value) => value + 1)}>
            <RefreshCw size={14} /> Refresh Preview
          </Button>
          <Button size="sm" variant="outline" href={previewUrl} target="_blank" rel="noreferrer">
            <ExternalLink size={14} /> Open in New Tab
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
              previewKey={previewKey}
              component={block.component}
              height={block.preview.height}
              previewUrl={previewUrl}
            />
          </TabsContent>
          <TabsContent value="code">
            <div class="blocks-install">
              <code>{installCommand}</code>
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label="Copy block path"
                onClick={copyInstall}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </Button>
            </div>
            <div class="blocks-code-layout mt-3">
              <aside class="blocks-file-tree" aria-label="Block files">
                <p class="blocks-file-tree-label">Files</p>
                <ul class="blocks-file-tree-list">
                  {fileTree.map((group) => (
                    <li key={group.dir}>
                      <div class="blocks-file-tree-dir">{group.dir}/</div>
                      <ul class="blocks-file-tree-list">
                        {group.files.map((file) => (
                          <li key={file.path}>
                            <button
                              type="button"
                              class={[
                                "blocks-file-tree-btn",
                                selectedFile === file.path ? "is-active" : "",
                              ]
                                .filter(Boolean)
                                .join(" ")}
                              onClick={() => setSelectedFile(file.path)}
                            >
                              {file.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </aside>
              <div class="blocks-code-pane">
                <CodeBlock code={source} language="tsx" className="docs-tab-code" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </article>
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

export const BlocksTopbarActions = () => (
  <>
    <ThemePresetSelect class="docs-theme-preset" selectClass="docs-theme-preset-select" />
    <GithubRepoLink />
    <ThemeToggle class="docs-topbar-theme-toggle">
      <SunMoon />
    </ThemeToggle>
  </>
);
