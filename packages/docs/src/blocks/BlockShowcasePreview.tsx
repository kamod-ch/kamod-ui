import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";
import { ShowcaseLoading } from "../docs/components/ShowcaseLoading";
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
  const [settled, setSettled] = useState<{ key: number; url: string; error?: boolean }>();
  const pending = settled?.key !== previewKey || settled.url !== url;
  const applyAppearance = () => {
    const root = iframe.current?.contentDocument?.documentElement;
    if (root) applyPreviewAppearance(root, appearance);
  };
  // Updating the frame document preserves form input and sidebar state when changing themes.
  useLayoutEffect(applyAppearance, [appearance]);
  // Switching away from Preview unmounts its frame and cancels an unfinished refresh.
  useEffect(() => () => onCancel(previewKey), [previewKey, onCancel]);

  return (
    <div class="blocks-showcase-preview blocks-preview-panel" aria-busy={pending || refreshing}>
      <div
        class={`blocks-preview-frame blocks-preview-${viewport} showcase-preview-surface`}
        data-loading={pending || undefined}
        style={{ height: `${height}px` }}
      >
        <iframe
          key={previewKey}
          ref={iframe}
          src={url}
          title="Block preview"
          class="blocks-preview-iframe"
          aria-hidden={pending || undefined}
          tabIndex={pending ? -1 : undefined}
          onLoad={() => {
            applyAppearance();
            setSettled({ key: previewKey, url });
            onLoad(previewKey);
          }}
          onError={() => {
            setSettled({ key: previewKey, url, error: true });
            onCancel(previewKey);
          }}
        />
        {pending && <ShowcaseLoading appearance={appearance} view="preview" />}
        {!pending && settled?.error && (
          <div class="showcase-preview-error" role="alert">
            The preview could not load. Use Refresh to try again.
          </div>
        )}
      </div>
    </div>
  );
}
