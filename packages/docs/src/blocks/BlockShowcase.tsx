/** Shared block preview, source tabs and controls; registries retain ownership of block data. */
import { useTimeout } from "@kamod-ch/hooks";
import { CheckIcon, ExternalLinkIcon, RefreshCwIcon } from "@kamod-ch/icons/lucide";
import { CopyIcon } from "@kamod-ch/icons/tabler/outline";
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@kamod-ch/ui";
import type { ComponentChildren, ComponentProps } from "preact";
import { useState } from "preact/hooks";
import { withBasePath } from "../base-path";
import { BlockPreviewPanel } from "./BlockPreviewPanel";
import { type BlockSourceFile, BlockSourceFiles, type BlockSourceLoader } from "./BlockSourceFiles";

/** Structural subset shared by Sidebar, Login, Signup and Application Shell registries. */
export type ShowcaseBlock = {
  id: string;
  title: string;
  description: string;
  category: string;
  installCommand: string;
  component: ComponentProps<typeof BlockPreviewPanel>["component"];
  preview: { height: number };
  files: readonly BlockSourceFile[];
};

export const BlockShowcase = ({
  block,
  loadSource,
  title,
  groupedFiles = true,
  copyPath = true,
  headingLevel = "h1",
}: {
  block: ShowcaseBlock;
  loadSource: BlockSourceLoader;
  /** Optional heading content, such as an existing section permalink. */
  title?: ComponentChildren;
  groupedFiles?: boolean;
  copyPath?: boolean;
  headingLevel?: "h1" | "h2";
}) => {
  const Heading = headingLevel;
  const [previewKey, setPreviewKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState(block.files[0]?.label ?? "");
  useTimeout(() => setCopied(false), copied ? 1600 : undefined);
  const previewUrl = withBasePath(`/blocks/${block.category}/${block.id}/preview`);
  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(block.installCommand);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <article id={block.id} class="blocks-card" tabIndex={-1} aria-label={`${block.title} showcase`}>
      <div class="blocks-card-header">
        <div>
          <Heading class="blocks-card-title">{title ?? block.title}</Heading>
          <p class="blocks-card-desc">{block.description}</p>
        </div>
        <div class="blocks-card-actions">
          <Button size="sm" variant="outline" onClick={() => setPreviewKey((value) => value + 1)}>
            <RefreshCwIcon
              size={14}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            />{" "}
            Refresh Preview
          </Button>
          <Button size="sm" variant="outline" href={previewUrl} target="_blank" rel="noreferrer">
            <ExternalLinkIcon
              size={14}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            />{" "}
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
              {copyPath && (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label={copied ? "Block path copied" : "Copy block path"}
                  onClick={copyInstall}
                >
                  {copied ? (
                    <CheckIcon
                      size={14}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <CopyIcon
                      size={14}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </Button>
              )}
            </div>
            <BlockSourceFiles
              files={block.files}
              loadSource={loadSource}
              selectedFile={selectedFile}
              onSelect={setSelectedFile}
              grouped={groupedFiles}
            />
          </TabsContent>
        </Tabs>
      </div>
    </article>
  );
};
