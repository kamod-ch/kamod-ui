/** Per-viewer palettes: Kamod presets follow the app scheme; Prism presets retain their canvas. */
export const codeSyntaxThemes = [
  "default",
  "dusk",
  "forest",
  "monochrome",
  "okaidia",
  "tomorrow",
  "twilight",
  "solarized-light",
] as const;

/** `default` preserves the standard Code syntax colors. */
export type CodeSyntaxTheme = (typeof codeSyntaxThemes)[number];
