import { type AuthBlockId, loginBlocks, signupBlocks } from "@kamod-ch/blocks";
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@kamod-ch/ui";
import { Check, Copy, ExternalLink, RefreshCw } from "lucide-preact";
import { useMemo, useState } from "preact/hooks";
import { withBasePath } from "../base-path";
import { CodeBlock } from "../docs/components/CodeBlock";
import { DocsShell } from "../docs/components/DocsShell";
import { getAuthBlockSource } from "./auth-source";

type AuthCategory = "login" | "signup";
type AuthBlock = (typeof loginBlocks)[number];

export const BlocksAuthContent = ({ category }: { category: AuthCategory }) => {
  const isLogin = category === "login";
  return (
    <DocsShell
      isComponentsOverview={false}
      activeDoc={null}
      activeSection=""
      docs={[]}
      activeBlock={category}
      mainContent={
        <section class="docs-components-overview blocks-sidebar-page">
          <header class="blocks-hero">
            <h1>{isLogin ? "Login Blocks" : "Signup Blocks"}</h1>
            <p class="blocks-hero-lead">
              {isLogin
                ? "Responsive login screens built with Preact and Kamod UI primitives."
                : "Accessible signup screens with validation, terms copy, and social-provider callbacks."}
            </p>
          </header>
          <div class="grid gap-10">
            {(isLogin ? loginBlocks : signupBlocks).map((block) => (
              <BlockCard block={block} key={block.id} />
            ))}
          </div>
        </section>
      }
    />
  );
};

const buildFileTree = (files: AuthBlock["files"]) => {
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

const BlockCard = ({ block }: { block: AuthBlock }) => {
  const [selectedFile, setSelectedFile] = useState(block.files[0]?.label ?? "");
  const [previewKey, setPreviewKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const previewUrl = withBasePath(`/blocks/${block.category}/${block.id}/preview`);
  const source = getAuthBlockSource(block.id as AuthBlockId, selectedFile);
  const fileTree = useMemo(() => buildFileTree(block.files), [block.files]);

  const copySource = async () => {
    try {
      await navigator.clipboard.writeText(source);
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
        <Tabs defaultValue="preview" class="docs-tabs">
          <TabsList class="docs-tabs-list" variant="line">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <div class="blocks-preview-frame">
              <iframe
                key={previewKey}
                title={`${block.id} preview`}
                src={previewUrl}
                style={{ height: `${block.preview.height}px` }}
                loading="lazy"
              />
            </div>
          </TabsContent>
          <TabsContent value="code">
            <div class="blocks-install">
              <code>{selectedFile}</code>
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label="Copy selected source"
                onClick={copySource}
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
                <CodeBlock
                  code={source}
                  language={selectedFile.endsWith(".svg") ? "text" : "tsx"}
                  className="docs-tab-code"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </article>
  );
};

export const AuthBlocksPreviewContent = ({
  category,
  id,
}: {
  category?: AuthCategory;
  id?: string;
}) => {
  const blocks = category === "signup" ? signupBlocks : loginBlocks;
  const block = blocks.find((item) => item.id === id) ?? blocks[0];
  const Preview = block.component;
  return (
    <div class="min-h-svh bg-background text-foreground">
      <Preview />
    </div>
  );
};
