import type { ComponentType } from "preact";
import type { DocContentsSection } from "../../docs/types";

export type BlockGuideIdentity = { id: string; title: string };

/** A destination shared by the visible heading and contents navigation. */
export type BlockGuideHeading = DocContentsSection;

/** Each guide owns its content; the layout owns labels, anchors and navigation. */
export type BlockGuideSection = BlockGuideHeading & {
  eyebrow: string;
  Content: ComponentType;
};
