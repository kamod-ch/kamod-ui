import type { ComponentType } from "preact";

export type BlockGuideIdentity = { id: string; title: string };

/** A destination shared by the visible heading and contents navigation. */
export type BlockGuideHeading = {
  id: string;
  label: string;
  step?: number;
};

/** Each guide owns its content; the layout owns labels, anchors and navigation. */
export type BlockGuideSection = BlockGuideHeading & {
  eyebrow: string;
  Content: ComponentType;
  children?: readonly BlockGuideHeading[];
};
