import type { ComponentChildren } from "preact";

/** Shared contract for UI Motion docs examples (preview + code from one definition). */
export type UiMotionDocExample = {
  id: string;
  title: string;
  text: string;
  code: string;
  renderPreview: () => ComponentChildren;
  previewClass?: string;
};
