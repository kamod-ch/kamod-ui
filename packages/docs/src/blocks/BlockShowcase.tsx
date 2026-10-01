/** Shared showcase controls, isolated live preview and on-demand source reference. */

import { useSize } from "@kamod-ch/hooks";
import { Tabs, TabsContent } from "@kamod-ch/ui";
import { useRef } from "preact/hooks";
import { withBasePath } from "../base-path";
import { BlockShowcaseCode } from "./BlockShowcaseCode";
import { BlockShowcasePreview } from "./BlockShowcasePreview";
import { BlockShowcasePrompt } from "./BlockShowcasePrompt";
import { BlockShowcaseToolbar } from "./BlockShowcaseToolbar";
import type { BlockSourceFile, BlockSourceLoader } from "./BlockSourceFiles";
import { fitBlockViewport } from "./BlockViewportSwitcher";
import type { BlockCategory } from "./block-categories";
import { previewAppearanceUrl } from "./preview-appearance";
import { ShowcaseTabMemory } from "./ShowcaseTabMemory";
import { usePreviewRefresh } from "./usePreviewRefresh";
import { useShowcasePreferences } from "./useShowcasePreferences";

/** Structural subset shared by Sidebar, Login, Signup and Application Shell registries. */
export type ShowcaseBlock = {
  id: string;
  title: string;
  description: string;
  category: BlockCategory;
  dependencies: readonly string[];
  installCommand: string;
  preview: { height: number };
  files: readonly (BlockSourceFile & { path: string })[];
};

/** Key by block ID so each variant restores its own controls and source navigation. */
export function BlockShowcase({
  block,
  loadSource,
  groupedFiles = true,
  copyPath = true,
}: {
  block: ShowcaseBlock;
  loadSource: BlockSourceLoader;
  groupedFiles?: boolean;
  copyPath?: boolean;
}) {
  const { previewKey, phase, refresh, complete, cancel } = usePreviewRefresh();
  const { preferences, update, ready } = useShowcasePreferences(block.category, block.id);
  const container = useRef<HTMLElement>(null);
  const availableWidth = useSize(container)?.width ?? 0;
  const viewport = fitBlockViewport(preferences.viewport, availableWidth);
  const { appearance, view } = preferences;
  const previewUrl = withBasePath(`/blocks/${block.category}/${block.id}/preview`);

  return (
    <article
      ref={container}
      id={block.id}
      class="blocks-card blocks-showcase"
      tabIndex={-1}
      aria-label={`${block.title} showcase`}
    >
      <h2 class="sr-only">Live preview and source</h2>
      <div id={`${block.id}-code`} class="blocks-card-body">
        <Tabs defaultValue="preview" class="blocks-showcase-tabs">
          <ShowcaseTabMemory
            blockId={block.id}
            files={block.files}
            ready={ready}
            view={view}
            onChange={(view) => update({ view })}
          />
          <BlockShowcaseToolbar
            viewport={viewport}
            availableWidth={availableWidth}
            onViewportChange={(viewport) => update({ viewport })}
            appearance={appearance}
            onAppearanceChange={(appearance) => update({ appearance })}
            previewUrl={previewAppearanceUrl(previewUrl, appearance)}
            refreshPhase={phase}
            onRefresh={refresh}
          />
          <TabsContent value="preview">
            <BlockShowcasePreview
              url={previewUrl}
              height={block.preview.height}
              previewKey={previewKey}
              viewport={viewport}
              appearance={appearance}
              onLoad={complete}
              onCancel={cancel}
              refreshing={phase === "loading"}
            />
          </TabsContent>
          {ready && (
            <BlockShowcaseCode
              block={block}
              loadSource={loadSource}
              groupedFiles={groupedFiles}
              copyPath={copyPath}
            />
          )}
          <TabsContent value="prompt" class="blocks-showcase-prompt">
            <BlockShowcasePrompt
              block={block}
              loadSource={loadSource}
              mode={preferences.promptMode}
              onModeChange={(promptMode) => update({ promptMode })}
              display={preferences.promptDisplay}
              onDisplayChange={(promptDisplay) => update({ promptDisplay })}
            />
          </TabsContent>
        </Tabs>
      </div>
    </article>
  );
}
