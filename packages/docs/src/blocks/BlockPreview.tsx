import { cn } from "@kamod-ch/ui";
import type { ComponentType } from "preact";

export type BlockPreviewMode = "desktop" | "collapsed" | "mobile";

type BlockPreviewProps = {
  component: ComponentType<{ mode?: BlockPreviewMode } | Record<string, unknown>>;
  height: number;
  previewKey: number;
  appearance?: "light" | "dark";
  viewport?: "desktop" | "mobile";
  mode?: BlockPreviewMode;
};

export const BlockPreview = ({
  component: Preview,
  height,
  previewKey,
  appearance = "light",
  viewport = "desktop",
  mode = "desktop",
}: BlockPreviewProps) => (
  <div
    class={cn(
      "blocks-preview-frame blocks-preview-inline",
      appearance === "dark" && "dark",
      viewport === "mobile" && "blocks-preview-mobile",
    )}
    style={{ height: `${height}px` }}
  >
    <div
      key={`${previewKey}-${appearance}-${viewport}-${mode}`}
      class="blocks-preview-host h-full w-full overflow-auto bg-background text-foreground"
    >
      <Preview mode={mode} />
    </div>
  </div>
);
