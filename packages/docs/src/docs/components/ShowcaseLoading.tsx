import { Spinner } from "@kamod-ch/ui";
import { useLayoutEffect, useRef } from "preact/hooks";
import type { PreviewAppearance } from "../../blocks/preview-appearance";
import { observeViewportActivity } from "../../layout/runtime/viewport-activity";

const views = {
  preview: {
    title: "Setting the scene...",
    hint: "Interactive preview",
  },
  code: {
    title: "Opening the source",
    hint: "Source code",
  },
  file: {
    title: "Loading source",
    hint: "Selected file",
  },
  prompt: {
    title: "Preparing your prompt",
    hint: "Instructions & source",
  },
  markdown: {
    title: "Formatting the reading view",
    hint: "Markdown view",
  },
};

/** Actual pending work, with a decorative miniature and no timers or fabricated progress. */
export function ShowcaseLoading({
  appearance,
  view,
  detail,
  className = "",
}: {
  /** Owning showcase controls; page-scoped references without preview settings inherit their theme. */
  appearance?: PreviewAppearance;
  view: keyof typeof views;
  detail?: string;
  className?: string;
}) {
  const { title, hint } = views[view];
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const node = root.current;
    if (node)
      return observeViewportActivity(node, (active) =>
        node.toggleAttribute("data-loading-active", active),
      );
  }, []);
  return (
    <div
      ref={root}
      class={`showcase-loading ${appearance?.scheme ?? ""} ${className}`}
      data-theme-scope={appearance ? "" : undefined}
      data-theme={appearance?.preset}
      style={appearance ? { colorScheme: appearance.scheme } : undefined}
      data-view={view}
    >
      <div class="showcase-loading-sketch" aria-hidden="true">
        <div class="showcase-loading-chrome">
          <Spinner
            class="showcase-loading-activity"
            size="sm"
            tone="primary"
            role="presentation"
            aria-label={undefined}
            aria-hidden="true"
          />
          <span class="showcase-loading-chrome-marks">
            <i />
            <i />
            <i />
          </span>
        </div>
        <div class="showcase-loading-sheet">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <span class="showcase-loading-companion">
          <i />
          <i />
          <i />
        </span>
      </div>
      <div class="showcase-loading-copy">
        {/* Only announce the pending task and optional source; the tiny caption stays quiet. */}
        <div class="showcase-loading-status" role="status" aria-atomic="true">
          <strong class="showcase-loading-title">{title}</strong>
          {detail && (
            <p class="showcase-loading-path" title={detail}>
              {detail}
            </p>
          )}
        </div>
        {!detail && <p class="showcase-loading-description">{hint}</p>}
      </div>
    </div>
  );
}
