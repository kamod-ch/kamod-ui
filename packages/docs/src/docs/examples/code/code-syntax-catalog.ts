import type { CodeSyntaxTheme } from "@kamod-ch/ui/code";

/** Editorial metadata only; actual colors remain in core's scoped Prism stylesheet. */
export const prismPalettes = [
  {
    id: "okaidia",
    title: "Okaidia",
    canvas: "Dark",
    description:
      "Cyan declarations, lime strings and warm function names on a charcoal canvas. A vivid Monokai-inspired starting point for JSX-heavy examples.",
    file: "prism-okaidia.css",
  },
  {
    id: "tomorrow",
    title: "Tomorrow",
    canvas: "Dark",
    description:
      "Lavender keywords, peach functions and green strings on neutral gray. Tomorrow Night Eighties keeps a softer balance across long mixed-language files.",
    file: "prism-tomorrow.css",
  },
  {
    id: "twilight",
    title: "Twilight",
    canvas: "Dark",
    description:
      "Cream declarations, muted olive strings and copper tags on an ink-dark canvas. A restrained TextMate-inspired palette with fewer competing accents.",
    file: "prism-twilight.css",
  },
  {
    id: "solarized-light",
    title: "Solarized Light",
    canvas: "Light",
    description:
      "Blue properties, teal strings and olive keywords on warm cream. Its contrast-adjusted colors provide a light reading surface even inside a dark application.",
    file: "prism-solarizedlight.css",
  },
] as const satisfies readonly {
  id: CodeSyntaxTheme;
  title: string;
  canvas: string;
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
