/** Preview reset, viewport controls and copyable source files for one registered block. */
import { ExternalLinkIcon, RefreshCwIcon } from "@kamod-ch/icons/lucide";
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import { withBasePath } from "../base-path";
import { CodeBlock } from "../docs/components/CodeBlock";
import { type ApplicationShellBlock, categoryPath } from "./application-shell-config";
import { applicationShellSources } from "./application-shell-source";
import { BlockPreviewPanel } from "./BlockPreviewPanel";
import { ShellHeadingLink } from "./ShellHeadingLink";

/** Keeps preview and source selection state independent of the documentation below it. */
export const ShellShowcase = ({ block }: { block: ApplicationShellBlock }) => {
  const [selectedFile, setSelectedFile] = useState(block.files[0].label);
  // Remount only the preview to reset sidebar, menus and demo selections.
  const [previewKey, setPreviewKey] = useState(0);
  const previewUrl = withBasePath(`${categoryPath}/${block.id}/preview`);
  return (
    <article id={block.id} class="blocks-card" tabIndex={-1} aria-label={`${block.title} showcase`}>
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
