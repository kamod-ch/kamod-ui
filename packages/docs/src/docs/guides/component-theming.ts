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

Explore **Eight Palettes through the Same Small Compositions**. Every study pairs a simple workspace and action card in light and dark. Compare how the surfaces, accents and navigation relate, then read the preset's practical design notes, declared typography and shape.

Start with the direction that suits your content. **Use theme** applies a preset to this documentation while keeping your current appearance preference; the comparison sketches stay fixed. Each local code example opens on request. Suggested uses are starting points, not restrictions.
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
