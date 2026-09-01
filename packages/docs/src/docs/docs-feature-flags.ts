/** Set to true when motion wrapper docs should appear in nav, overview, and component pages. */
export const docsShowMotion = false;

export const MOTION_DOC_SLUGS = new Set([
  "ui-motion",
  "motion-accordion",
  "motion-alert-dialog",
  "motion-collapsible",
  "motion-dialog",
  "motion-sheet",
  "motion-tabs",
]);

export const isMotionDocSlug = (slug: string) => MOTION_DOC_SLUGS.has(slug);

export const isMotionDocSection = (sectionId: string) => sectionId === "with-motion";
