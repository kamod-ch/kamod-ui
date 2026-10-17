import introduction from "virtual:kamod-guide-content/theme-component-foundations";
import { type GuideSection, parseGuide } from "../../blocks/guides/guide-markdown";
import { presetStudies, presetStudyId } from "./color-themes/preset-studies";
import { themeRuntimeReference } from "./theme-runtime-reference";
import { renderThemeRuntimeTable } from "./theme-runtime-table";

const reference = `
## Optional Tailwind preset

Tailwind CSS v4 uses the CSS-first setup above. The exported configuration preset is for projects that deliberately use a compatible config-driven pipeline; it does not replace loading theme values or scanning your component source.

\`\`\`ts tailwind.config.ts
import kamodThemes from "@kamod-ch/themes/tailwind-preset";

export default { presets: [kamodThemes] };
\`\`\`

Keep your existing build conventions. Do not add a second Tailwind configuration simply to follow this optional example.

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
  const [palettes] = parseGuide(`
## Color theme presets

Explore **Eight Palettes from Color to Working Interface**. Start with the main colors, inspect the complete light and dark token reference, then see those roles in the same compositions and an interactive workspace. Every study includes copyable color values, practical design notes, typography and shape.

Start with the direction that suits your content. **Use theme** applies a preset to this documentation while keeping your current appearance preference; comparisons and playgrounds keep their own local appearance. The complete TSX example is always visible. Suggested uses are starting points, not restrictions.
`);
  return [
    { ...installation, id: "installation" },
    { ...usage, id: "usage" },
    select("set-up-tailwind-and-theme-css", "css-setup"),
    {
      ...palettes,
      children: [
        ...presetStudies.map(({ id, label }) => ({ id: presetStudyId(id), label })),
        { id: "themes-on-this-page", label: "How Themes Work on This Page" },
      ],
    },
    select("shape-your-design-with-tokens", "token-overrides"),
    select("manage-appearance-preferences", "provider-controls"),
    { ...preset, id: "tailwind-preset" },
    { ...api, id: "api-reference" },
    select("troubleshoot-and-verify", "accessibility"),
  ];
}
