/** Optional per-viewer palettes. Every palette follows the app's light/dark scheme. */
export const codeSyntaxThemes = ["default", "dusk", "forest", "monochrome"] as const;

/** `default` preserves the standard Code syntax colors. */
export type CodeSyntaxTheme = (typeof codeSyntaxThemes)[number];
