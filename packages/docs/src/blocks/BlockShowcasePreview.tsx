import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";
import { ShowcaseLoading } from "../docs/components/ShowcaseLoading";
import type { BlockPreviewViewport } from "./BlockViewportSwitcher";
import { usePreviewActivity } from "./preview-activity";
import { applyPreviewAppearance, type PreviewAppearance } from "./preview-appearance";

/** Hosts often redirect `/preview` to `/preview/`. The frame attribute keeps the requested URL. */
function loadedPreview(frame: HTMLIFrameElement): Document | null {
  const doc = frame.contentDocument;
  if (!doc || doc.readyState !== "complete" || !frame.src) return null;
  let loaded: URL;
  let requested: URL;
  try {
    loaded = new URL(doc.URL);
    requested = new URL(frame.src, loaded.href);
  } catch {
    return null;
  }
  const path = (value: string) => value.replace(/\/+$/, "") || "/";
  if (loaded.origin !== requested.origin || path(loaded.pathname) !== path(requested.pathname)) {
    return null;
  }
  return doc;
}

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
  const region = useRef<HTMLDivElement>(null);
  const applyActivity = usePreviewActivity(region, iframe, `${previewKey}:${url}`);
  const [settled, setSettled] = useState<{ key: number; url: string; error?: boolean }>();
  const pending = settled?.key !== previewKey || settled.url !== url;
  const applyAppearance = () => {
    const root = iframe.current?.contentDocument?.documentElement;
    if (root) applyPreviewAppearance(root, appearance);
  };
  const complete = () => {
    const frame = iframe.current;
    // Ignore about:blank and the previous document while a replacement is navigating.
    const doc = frame ? loadedPreview(frame) : null;
    if (!doc) return;
    applyAppearance();
    applyActivity();
    setSettled({ key: previewKey, url });
    onLoad(previewKey);
  };
  // An eager SSR iframe may finish before hydration attaches its load handler.
  useLayoutEffect(complete, [previewKey, url]);
  // Updating the frame document preserves form input and sidebar state when changing themes.
  useLayoutEffect(applyAppearance, [appearance]);
  // Switching away from Preview unmounts its frame and cancels an unfinished refresh.
  useEffect(() => () => onCancel(previewKey), [previewKey, onCancel]);

  return (
    <div
      ref={region}
      class="blocks-showcase-preview blocks-preview-panel"
      aria-busy={pending || refreshing}
    >
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
          onLoad={complete}
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
