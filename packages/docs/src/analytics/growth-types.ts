/** Growth funnel events (Prompt 6). Names are stable for Matomo / adapter consumers. */
export const GROWTH_EVENT_NAMES = [
  "demo_open",
  "code_copy_success",
  "template_download_click",
  "template_download_prepared",
  "github_star_cta_click",
] as const;

export type GrowthEventName = (typeof GROWTH_EVENT_NAMES)[number];

export const GROWTH_LOCATIONS = ["header", "landing", "post_copy", "post_download"] as const;

export type GrowthLocation = (typeof GROWTH_LOCATIONS)[number];

/** Allowed metadata only — never paste code, form values, search text, or full query URLs. */
export type GrowthEventMeta = {
  location?: GrowthLocation;
  exampleId?: string;
  templateId?: string;
  displayMode?: string;
};
