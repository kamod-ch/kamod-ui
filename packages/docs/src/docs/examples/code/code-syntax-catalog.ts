import type { CodeSyntaxTheme } from "@kamod-ch/ui/code";

/** Editorial metadata only; actual colors remain in core's scoped Prism stylesheet. */
export const prismPalettes = [
  {
    id: "okaidia",
    title: "Okaidia",
    description:
      "Cyan declarations, green strings and warm function names. A vivid Monokai-inspired palette adapted for both light and dark source areas.",
    file: "prism-okaidia.css",
  },
  {
    id: "tomorrow",
    title: "Tomorrow",
    description:
      "Violet keywords, warm functions and green strings. Tomorrow's color families keep a softer balance across long files in either source mode.",
    file: "prism-tomorrow.css",
  },
  {
    id: "twilight",
    title: "Twilight",
    description:
      "Neutral declarations, olive strings and copper tags. A restrained TextMate-inspired palette with light and dark adaptations and fewer competing accents.",
    file: "prism-twilight.css",
  },
  {
    id: "solarized-light",
    title: "Solarized Light",
    description:
      "Blue properties, teal strings and olive keywords. The Solarized Light name identifies the original palette; its adapted colors work in either source mode.",
    file: "prism-solarizedlight.css",
  },
] as const satisfies readonly {
  id: CodeSyntaxTheme;
  title: string;
  description: string;
  file: string;
}[];

export const syntaxThemeLabels: Record<CodeSyntaxTheme, string> = {
  default: "Default",
  dusk: "Dusk",
  forest: "Forest",
  monochrome: "Monochrome",
  okaidia: "Okaidia · Prism",
  tomorrow: "Tomorrow · Prism",
  twilight: "Twilight · Prism",
  "solarized-light": "Solarized Light · Prism",
};
