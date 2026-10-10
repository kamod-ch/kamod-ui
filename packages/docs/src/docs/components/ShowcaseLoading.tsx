import { Spinner } from "@kamod-ch/ui";
import type { PreviewAppearance } from "../../blocks/preview-appearance";
import { KamodMarkIcon } from "./brand/KamodMarkIcon";
import { InlineCodeLink } from "./InlineCodeLink";

const views = {
  preview: {
    title: "Setting the scene",
    hint: (
      <>
        Getting the interactive preview ready. Once it appears, <strong>try the controls</strong>{" "}
        and compare light and dark modes. Open <strong>Code</strong> to explore the composition, or
        browse the{" "}
        <InlineCodeLink href="/docs/components" size="compact">
          Components
        </InlineCodeLink>{" "}
        behind the preview.
      </>
    ),
  },
  code: {
    title: "Opening the source",
    hint: (
      <>
        Bringing the example’s source into view. Start with the{" "}
        <strong>imports and composition</strong>, then follow the props into the rendered interface.
        The{" "}
        <InlineCodeLink href="/docs/code/installation#code-reading-model" size="compact">
          Code
        </InlineCodeLink>{" "}
        guide explains the reading controls. Copy a useful piece and adapt it to your own app.
      </>
    ),
  },
  file: {
    title: "Loading source",
    hint: (
      <>
        Opening your selected file. Follow its <strong>imports, props and callbacks</strong> to see
        how it fits the example; nearby files may supply shared helpers or sample data. Explore the{" "}
        <InlineCodeLink href="/docs/code/installation#code-reading-model" size="compact">
          Code
        </InlineCodeLink>{" "}
        guide for reading controls, then keep the parts your project needs.
      </>
    ),
  },
  prompt: {
    title: "Preparing your prompt",
    hint: (
      <>
        Bringing the instructions and source together. Give your coding assistant{" "}
        <strong>your goal and your project’s conventions</strong>, then review its changes before
        using them. For setup, the{" "}
        <InlineCodeLink href="/docs/getting-started" size="compact">
          Getting Started Guide
        </InlineCodeLink>{" "}
        covers the foundation. A useful starting point, with the final choices still yours.
      </>
    ),
  },
};

/** Actual pending work, with a decorative miniature and no timers or fabricated progress. */
export function ShowcaseLoading({
  appearance,
  view,
  detail,
  className = "",
}: {
  /** Always the owning showcase’s current controls, initialized from the page on mount. */
  appearance: PreviewAppearance;
  view: keyof typeof views;
  detail?: string;
  className?: string;
}) {
  const { title, hint } = views[view];
  return (
    <div
      class={`showcase-loading ${appearance.scheme} ${className}`}
      data-theme-scope=""
      data-theme={appearance.preset}
      style={{ colorScheme: appearance.scheme }}
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
        <span class="showcase-loading-seal">
          <KamodMarkIcon size={22} accentColor="var(--primary)" />
        </span>
      </div>
      <div class="showcase-loading-copy">
        {/* Announce only the pending task; supporting reading links are outside the live region. */}
        <div class="showcase-loading-status" role="status" aria-atomic="true">
          <strong class="showcase-loading-title">{title}</strong>
          {detail && (
            <p class="showcase-loading-path" title={detail}>
              {detail}
            </p>
          )}
        </div>
        <p class="showcase-loading-description">{hint}</p>
      </div>
    </div>
  );
}
