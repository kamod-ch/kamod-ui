import type { ComponentType } from "preact";
import { useState } from "preact/hooks";
import { BlockPreview, type BlockPreviewMode } from "./BlockPreview";
import { type BlockPreviewViewport, BlockViewportSwitcher } from "./BlockViewportSwitcher";

type BlockPreviewPanelProps = {
  component: ComponentType<{ mode?: BlockPreviewMode } | Record<string, unknown>>;
  height: number;
  previewKey: number;
  /** Desktop preview route (also used for tablet iframe). */
  previewUrl: string;
  /** Optional dedicated mobile preview route (e.g. app-sidebar …/mobile). */
  mobilePreviewUrl?: string;
  mode?: BlockPreviewMode;
  appearance?: "light" | "dark";
};

const iframeSrcForViewport = (
  viewport: BlockPreviewViewport,
  previewUrl: string,
  mobilePreviewUrl?: string,
) => {
  if (viewport === "mobile") return mobilePreviewUrl ?? previewUrl;
  if (viewport === "tablet") return previewUrl;
  return undefined;
};

const modeForViewport = (
  viewport: BlockPreviewViewport,
  mode?: BlockPreviewMode,
): BlockPreviewMode => {
  if (viewport === "mobile") return "mobile";
  return mode ?? "desktop";
};

export const BlockPreviewPanel = ({
  component,
  height,
  previewKey,
  previewUrl,
  mobilePreviewUrl,
  mode,
  appearance = "light",
}: BlockPreviewPanelProps) => {
  const [viewport, setViewport] = useState<BlockPreviewViewport>("desktop");
  const iframeSrc = iframeSrcForViewport(viewport, previewUrl, mobilePreviewUrl);

  return (
    <div
      class={[
        "blocks-preview-panel",
        viewport !== "desktop" ? "blocks-preview-panel--constrained" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div class="blocks-preview-panel-toolbar">
        <BlockViewportSwitcher value={viewport} onValueChange={setViewport} />
      </div>
      <BlockPreview
        component={component}
        height={height}
        previewKey={previewKey}
        appearance={appearance}
        viewport={viewport}
        mode={modeForViewport(viewport, mode)}
        previewUrl={iframeSrc}
      />
    </div>
  );
};
