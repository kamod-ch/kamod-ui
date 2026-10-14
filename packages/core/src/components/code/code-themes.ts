/** Per-viewer palettes with light/dark source adaptations, selected independently of colorMode. */
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
