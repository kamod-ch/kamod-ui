export type KamodBrandSize = "sm" | "md" | "lg";

/** Horizontal Kamod wordmark — height-led sizing keeps aspect ratio stable. */
export const kamodLogoSizeClass: Record<KamodBrandSize, string> = {
  sm: "h-6 w-auto max-w-[8rem]",
  md: "h-8 w-auto max-w-[9.5rem]",
  lg: "h-9 w-auto max-w-[11rem]",
};

/** Kamod mark for compact slots (sidebar switchers, favicons). */
export const kamodIconSizeClass: Record<KamodBrandSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};
