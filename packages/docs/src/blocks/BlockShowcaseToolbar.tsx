import { CodeIcon, EyeIcon, SparklesIcon } from "@kamod-ch/icons/lucide";
import { ArrowsMaximizeIcon } from "@kamod-ch/icons/tabler/outline";
import { TabsList, TabsTrigger } from "@kamod-ch/ui";
import { type BlockPreviewViewport, BlockViewportSwitcher } from "./BlockViewportSwitcher";
import { PreviewAppearanceControls } from "./PreviewAppearanceControls";
import { PreviewRefreshControl } from "./PreviewRefreshControl";
import type { PreviewAppearance } from "./preview-appearance";
import type { PreviewRefreshPhase } from "./usePreviewRefresh";

/** One shared toolbar; viewport and appearance controls remain available across all three tabs. */
export function BlockShowcaseToolbar({
  viewport,
  availableWidth,
  onViewportChange,
  appearance,
  onAppearanceChange,
  previewUrl,
  refreshPhase,
  onRefresh,
}: {
  viewport: BlockPreviewViewport;
  availableWidth: number;
  onViewportChange: (value: BlockPreviewViewport) => void;
  appearance: PreviewAppearance;
  onAppearanceChange: (value: PreviewAppearance) => void;
  previewUrl: string;
  refreshPhase: PreviewRefreshPhase;
  onRefresh: () => boolean;
}) {
  return (
    <div class="blocks-showcase-toolbar">
      <div class="blocks-showcase-views">
        <TabsList variant="line" class="blocks-showcase-segmented" aria-label="Showcase view">
          <TabsTrigger value="preview" aria-label="Preview" title="Preview">
            <EyeIcon aria-hidden="true" />
            <span class="blocks-showcase-control-label">Preview</span>
          </TabsTrigger>
          <TabsTrigger value="code" aria-label="Code" title="Code">
            <CodeIcon aria-hidden="true" />
            <span class="blocks-showcase-control-label">Code</span>
          </TabsTrigger>
          <TabsTrigger value="prompt" aria-label="Prompt" title="Prompt">
            <SparklesIcon aria-hidden="true" />
            <span class="blocks-showcase-control-label">Prompt</span>
          </TabsTrigger>
        </TabsList>
        <div class="blocks-showcase-segmented" role="group" aria-label="Preview actions">
          <PreviewRefreshControl phase={refreshPhase} onRefresh={onRefresh} />
          <a
            class="docs-icon-button blocks-showcase-control"
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            title="Open the preview in a new tab"
            aria-label="Open Preview in a New Tab"
          >
            <ArrowsMaximizeIcon aria-hidden="true" />
            <span class="blocks-showcase-control-label">Open</span>
          </a>
        </div>
      </div>
      <div class="blocks-showcase-settings">
        <BlockViewportSwitcher
          value={viewport}
          availableWidth={availableWidth}
          onValueChange={onViewportChange}
        />
        <PreviewAppearanceControls value={appearance} onChange={onAppearanceChange} />
      </div>
    </div>
  );
}
