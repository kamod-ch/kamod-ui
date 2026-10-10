import { type GuideSection, parseGuide } from "../../blocks/guides/guide-markdown";
import { themeRuntimeReference } from "./theme-runtime-reference";
import { renderThemeRuntimeTable } from "./theme-runtime-table";

const introduction = `
## Choose your theme foundation

A consistent interface starts with **shared values rather than separate colors for every component**. Buttons, cards, fields, menus and sidebars consume semantic tokens; configure those tokens once, then use each component’s supported variants, sizes and local layout classes.

Keep three responsibilities separate: **Tailwind generates utilities**, **theme CSS defines their values**, and **the optional runtime selects a preset and color scheme**. A preset is a palette; Light, Dark and System are appearance preferences within that palette.

### Install the packages you need

Add only missing dependencies to your existing Preact application. This guide uses the full theme so components and [Complete Blocks](/blocks/theming) share the same preset and sidebar tokens.

\`\`\`bash package-manager
pnpm add @kamod-ch/ui @kamod-ch/themes @preact/signals
\`\`\`

Use \`@kamod-ch/themes/theme.css\` for built-in presets and the full token contract. The smaller \`@kamod-ch/ui/theme.css\` is available for a minimal setup; it does not supply every preset or sidebar mapping. Choose one CSS entry instead of importing both and depending on their order to resolve overlapping defaults.

## Style components through their roles

Start with a component’s documented API. A \`variant\` expresses intent; \`size\` controls its supported density; \`class\` is useful for local placement and spacing. Theme tokens let those choices keep working when the palette changes.

\`\`\`tsx src/components/AccountActions.tsx
import { Button, ThemeToggle } from "@kamod-ch/ui";

export function AccountActions() {
  return (
    <div class="flex flex-wrap items-center gap-3">
      <Button type="button">Save changes</Button>
      <Button type="button" variant="outline">Cancel</Button>
      <ThemeToggle />
    </div>
  );
}
\`\`\`

Connect the buttons to your application’s actions. Use the [Button Reference](/docs/button/installation) for supported variants and [Theme Toggle](/docs/theme-toggle/installation) for accessible labels and the optional ripple transition.

### Keep local changes local

Use utilities such as \`gap-3\`, \`w-full\` and \`items-center\` for composition. Use pairs such as \`bg-card text-card-foreground\` for surfaces. Avoid overriding every button with a fixed color when a shared token can express the same decision across the interface.

Review changes inside real cards, dialogs and menus, including hover, focus, disabled and error states. The [Component Styles Guide](/blocks/styles) explains how to separate composition decisions from theme changes.
`;

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
  return [
    { ...installation, id: "installation" },
    { ...usage, id: "usage" },
    select("set-up-tailwind-and-theme-css", "css-setup"),
    select("shape-your-design-with-tokens", "token-overrides"),
    select("manage-appearance-preferences", "provider-controls"),
    { ...preset, id: "tailwind-preset" },
    { ...api, id: "api-reference" },
    select("troubleshoot-and-verify", "accessibility"),
  ];
}
