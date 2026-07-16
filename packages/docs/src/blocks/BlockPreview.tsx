import type { ComponentType } from "preact";

type BlockPreviewProps = {
  component: ComponentType;
  height: number;
  previewKey: number;
};

export const BlockPreview = ({ component: Preview, height, previewKey }: BlockPreviewProps) => (
  <div class="blocks-preview-frame blocks-preview-inline" style={{ height: `${height}px` }}>
    <div
      key={previewKey}
      class="blocks-preview-host h-full w-full overflow-auto bg-background text-foreground"
    >
      <Preview />
    </div>
  </div>
);
