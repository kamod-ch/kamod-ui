import { cn } from "@kamod-ch/ui";
import type { ComponentType } from "preact";
import type { BlockPreviewViewport } from "./BlockViewportSwitcher";

export type BlockPreviewMode = "desktop" | "collapsed" | "mobile";

type BlockPreviewProps = {
  component: ComponentType<{ mode?: BlockPreviewMode } | Record<string, unknown>>;
  height: number;
  previewKey: number;
  appearance?: "light" | "dark";
  viewport?: BlockPreviewViewport;
  mode?: BlockPreviewMode;
  /** When set and viewport is tablet/mobile, render an iframe instead of inline. */
  previewUrl?: string;
};

export const BlockPreview = ({
  component: Preview,
  height,
  previewKey,
  appearance = "light",
  viewport = "desktop",
  mode = "desktop",
  previewUrl,
}: BlockPreviewProps) => {
  const useIframe = Boolean(previewUrl) && viewport !== "desktop";

  return (
    <div
      class={cn(
        "blocks-preview-frame blocks-preview-inline",
        appearance === "dark" && "dark",
        viewport === "tablet" && "blocks-preview-tablet",
        viewport === "mobile" && "blocks-preview-mobile",
      )}
      style={{ height: `${height}px` }}
    >
      <div
        key={`${previewKey}-${appearance}-${viewport}-${mode}-${useIframe ? "iframe" : "inline"}`}
        class="blocks-preview-host h-full w-full overflow-auto bg-background text-foreground"
      >
        {useIframe && previewUrl ? (
          <iframe
            src={previewUrl}
            title="Block preview"
            class="blocks-preview-iframe"
            loading="lazy"
          />
        ) : (
          <Preview mode={mode} />
        )}
      </div>
    </div>
  );
};
