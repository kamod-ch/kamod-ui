/** Shared block preview, source tabs and controls; registries retain ownership of block data. */
import { ExternalLinkIcon, RefreshCwIcon } from "@kamod-ch/icons/lucide";
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@kamod-ch/ui";
import type { ComponentChildren, ComponentProps } from "preact";
import { useState } from "preact/hooks";
import { withBasePath } from "../base-path";
import { BlockPreviewPanel } from "./BlockPreviewPanel";
import { BlockShowcaseCode } from "./BlockShowcaseCode";
import type { BlockSourceFile, BlockSourceLoader } from "./BlockSourceFiles";

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

/** Key by block ID when changing variants so preview and selected-file state start fresh. */
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
  const previewUrl = withBasePath(`/blocks/${block.category}/${block.id}/preview`);

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
          <BlockShowcaseCode
            block={block}
            loadSource={loadSource}
            groupedFiles={groupedFiles}
            copyPath={copyPath}
          />
        </Tabs>
      </div>
    </article>
  );
};
