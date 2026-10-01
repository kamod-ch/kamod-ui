import { useEffect, useLayoutEffect, useRef } from "preact/hooks";
import type { BlockPreviewViewport } from "./BlockViewportSwitcher";
import { applyPreviewAppearance, type PreviewAppearance } from "./preview-appearance";

/** An isolated document gives every viewport accurate media queries and locally themed portals. */
export function BlockShowcasePreview({
  url,
  height,
  previewKey,
  viewport,
  appearance,
  onLoad,
  onCancel,
  refreshing,
}: {
  url: string;
  height: number;
  previewKey: number;
  viewport: BlockPreviewViewport;
  appearance: PreviewAppearance;
  onLoad: (key: number) => void;
  onCancel: (key: number) => void;
  refreshing: boolean;
}) {
  const iframe = useRef<HTMLIFrameElement>(null);
  const applyAppearance = () => {
    const root = iframe.current?.contentDocument?.documentElement;
    if (root) applyPreviewAppearance(root, appearance);
  };
  // Updating the frame document preserves form input and sidebar state when changing themes.
  useLayoutEffect(applyAppearance, [appearance]);
  // Switching away from Preview unmounts its frame and cancels an unfinished refresh.
  useEffect(() => () => onCancel(previewKey), [previewKey, onCancel]);

  return (
    <div class="blocks-showcase-preview blocks-preview-panel" aria-busy={refreshing}>
      <div
        class={`blocks-preview-frame blocks-preview-${viewport}`}
        style={{ height: `${height}px` }}
      >
        <iframe
          key={previewKey}
          ref={iframe}
          src={url}
          title="Block preview"
          class="blocks-preview-iframe"
          onLoad={() => {
            applyAppearance();
            onLoad(previewKey);
          }}
          onError={() => onCancel(previewKey)}
        />
      </div>
    </div>
  );
}
