import introduction from "virtual:kamod-guide-content/theme-component-foundations";
import { type GuideSection, parseGuide } from "../../blocks/guides/guide-markdown";
import { presetStudies, presetStudyId } from "./color-themes/preset-studies";
import { prismThemeId, prismThemes } from "./color-themes/prism/prism-theme-catalog";
import { themeRuntimeReference } from "./theme-runtime-reference";
import { renderThemeRuntimeTable } from "./theme-runtime-table";

const reference = `
## Optional Tailwind preset

For a compatible config-driven pipeline, the package also exports a preset. Skip this for the CSS-first v4 setup above.

\`\`\`ts tailwind.config.ts
import kamodThemes from "@kamod-ch/themes/tailwind-preset";

export default { presets: [kamodThemes] };
\`\`\`

This does not replace theme CSS or source scanning.

`;

/** Assemble the canonical theme reference while retaining established section routes. */
export function createComponentThemingSections(foundationSource: string): GuideSection[] {
  const shared = parseGuide(foundationSource);
  const select = (sourceId: string, id: string): GuideSection => {
    const section = shared.find((entry) => entry.id === sourceId);
    if (!section) throw new Error(`Missing shared theming section: ${sourceId}`);
    return { ...section, id };
  };
  const [installation, usage] = parseGuide(introduction);
  const [preset, api] = parseGuide(reference + themeRuntimeReference, renderThemeRuntimeTable);
  const css = select("set-up-tailwind-and-theme-css", "css-setup");
  const [outro] = parseGuide(`
## From palette to product

The palette gives your app its character. **Shared roles make it hold together.** Take these three decisions into the next screen you build.
`);
  const [palettes] = parseGuide(`
## Color theme presets

Explore **Eight Palettes from Color to Working Interface**. Start with the main colors, inspect the complete light and dark token reference, then see those roles in the same compositions and an interactive workspace. Every study includes copyable color values, practical design notes, typography and shape.

Start with the direction that suits your content. **Use theme** applies a preset to this documentation while keeping your current appearance preference; comparisons and playgrounds keep their own local appearance. The complete TSX example is always visible. Suggested uses are starting points, not restrictions.

For source code, open the **Prism syntax themes** group after the application presets. Compare 24 locally saved palettes, inspect token colors and copy a scoped reader recipe. Each study credits its source; the collection ends with integration, licensing and contrast guidance.
`);
  return [
    { ...installation, id: "installation" },
    { ...usage, id: "usage" },
    {
      ...css,
      children: [...(css.children ?? []), { id: "tailwind-preset", label: preset.title }],
      parts: [
        ...css.parts,
        { kind: "heading", id: "tailwind-preset", title: preset.title },
        ...preset.parts,
      ],
    },
    {
      ...palettes,
      children: [
        ...presetStudies.map(({ id, label }) => ({ id: presetStudyId(id), label })),
        {
          id: "prism-color-themes",
          label: "Prism syntax themes",
          collapsible: true,
          children: prismThemes.map(({ id, label }) => ({ id: prismThemeId(id), label })),
        },
        { id: "prism-theme-resources", label: "Prism sources & credits" },
        { id: "themes-on-this-page", label: "How Themes Work on This Page" },
      ],
    },
    select("shape-your-design-with-tokens", "token-overrides"),
    select("manage-appearance-preferences", "provider-controls"),
    { ...api, id: "api-reference" },
    select("troubleshoot-and-verify", "accessibility"),
    { ...outro, id: "finish-with-a-theme-review" },
  ];
}
