import { type CommerceBlockId, commerceBlocks } from "@kamod-ch/blocks";
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@kamod-ch/ui";
import { Check, Copy, ExternalLink, RefreshCw } from "lucide-preact";
import { useMemo, useState } from "preact/hooks";
import { withBasePath } from "../base-path";
import { CodeBlock } from "../docs/components/CodeBlock";
import { DocsShell } from "../docs/components/DocsShell";
import { BlockPreviewPanel } from "./BlockPreviewPanel";
import { getCommerceBlockSource } from "./commerce-source";

type CommerceBlock = (typeof commerceBlocks)[number];

export const BlocksCommerceContent = () => (
  <DocsShell
    sidebarScope="blocks"
    activeDoc={null}
    activeSection=""
    docs={[]}
    activeBlock="commerce"
    mainContent={
      <section class="docs-components-overview blocks-sidebar-page">
        <header class="blocks-hero">
          <h1>Commerce Blocks</h1>
          <p class="blocks-hero-lead">
            Payment UI, saved tokenized cards, and a checkout state machine. PAN/CVC never persist.
            These blocks do not make an app PCI compliant — use PSP-hosted fields in production.
          </p>
        </header>
        <div class="grid gap-10">
          {commerceBlocks.map((block) => (
            <BlockCard block={block} key={block.id} />
          ))}
        </div>
      </section>
    }
  />
);

const buildFileTree = (files: CommerceBlock["files"]) => {
  const byDir = new Map<string, { label: string; path: string }[]>();
  for (const file of files) {
    const parts = file.label.split("/");
    const dir = parts.length > 1 ? parts.slice(0, -1).join("/") : ".";
    const leaf = parts.at(-1) ?? file.label;
    const list = byDir.get(dir) ?? [];
    list.push({ label: leaf, path: file.label });
    byDir.set(dir, list);
  }
  return [...byDir].map(([dir, files]) => ({ dir, files }));
};

const BlockCard = ({ block }: { block: CommerceBlock }) => {
  const [selectedFile, setSelectedFile] = useState(block.files[0]?.label ?? "");
  const [previewKey, setPreviewKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const previewUrl = withBasePath(`/blocks/commerce/${block.id}/preview`);
  const source = getCommerceBlockSource(block.id as CommerceBlockId, selectedFile);
  const fileTree = useMemo(() => buildFileTree(block.files), [block.files]);
  const installCommand = block.installCommand;

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* noop */
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
        <div class="mb-4 overflow-x-auto">
          <table class="w-full text-left text-sm">
            <caption class="sr-only">{block.title} props</caption>
            <thead>
              <tr class="border-b text-muted-foreground">
                <th class="py-2 pr-4 font-medium">Prop</th>
                <th class="py-2 pr-4 font-medium">Type</th>
                <th class="py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {block.props.map((prop) => (
                <tr key={prop.name} class="border-b border-border/60">
                  <td class="py-2 pr-4 font-mono text-xs">{prop.name}</td>
                  <td class="py-2 pr-4 font-mono text-xs text-muted-foreground">{prop.type}</td>
                  <td class="py-2 text-muted-foreground">{prop.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Tabs defaultValue="preview" class="docs-tabs">
          <TabsList class="docs-tabs-list" variant="line">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="dark">Dark Mode</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
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
          <TabsContent value="dark">
            <BlockPreviewPanel
              previewKey={previewKey}
              component={block.component}
              height={block.preview.height}
              previewUrl={previewUrl}
              appearance="dark"
            />
          </TabsContent>
          <TabsContent value="usage">
            <CodeBlock code={block.usage} language="tsx" className="docs-tab-code" />
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

export const CommerceBlocksPreviewContent = ({ id }: { id?: string }) => {
  const block = commerceBlocks.find((item) => item.id === id) ?? commerceBlocks[0];
  const Preview = block.component;
  return (
    <div class="min-h-svh bg-background text-foreground">
      <Preview />
    </div>
  );
};
