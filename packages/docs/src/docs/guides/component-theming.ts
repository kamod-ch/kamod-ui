import { type GuideSection, parseGuide } from "../../blocks/guides/guide-markdown";

const introduction = `
## Choose your theme foundation

A consistent interface starts with **shared values rather than separate colors for every component**. Buttons, cards, fields, menus and sidebars consume semantic tokens; configure those tokens once, then use each component’s supported variants, sizes and local layout classes.

Keep three responsibilities separate: **Tailwind generates utilities**, **theme CSS defines their values**, and **the optional runtime selects a preset and color scheme**. A preset is a palette; Light, Dark and System are appearance preferences within that palette.

### Install the packages you need

Add only missing dependencies to your existing Preact application. This guide uses the full theme so components and [complete blocks](/blocks/theming) share the same preset and sidebar tokens.

\`\`\`bash
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

Connect the buttons to your application’s actions. Use the [Button reference](/docs/button/installation) for supported variants and [Theme Toggle](/docs/theme-toggle/installation) for accessible labels and the optional ripple transition.

### Keep local changes local

Use utilities such as \`gap-3\`, \`w-full\` and \`items-center\` for composition. Use pairs such as \`bg-card text-card-foreground\` for surfaces. Avoid overriding every button with a fixed color when a shared token can express the same decision across the interface.

Review changes inside real cards, dialogs and menus, including hover, focus, disabled and error states. The [component styles guide](/blocks/styles) explains how to separate composition decisions from theme changes.
`;

const reference = `
## Optional Tailwind preset

Tailwind CSS v4 uses the CSS-first setup above. The exported configuration preset is for projects that deliberately use a compatible config-driven pipeline; it does not replace loading theme values or scanning your component source.

\`\`\`text tailwind.config.ts
import kamodThemes from "@kamod-ch/themes/tailwind-preset";

export default { presets: [kamodThemes] };
\`\`\`

Keep your existing build conventions. Do not add a second Tailwind configuration simply to follow this optional example.

## Theme runtime reference

These are public exports of \`@kamod-ch/themes\`. Use the provider when building controls with \`useTheme()\`; the standalone [Theme Toggle](/docs/theme-toggle/installation) uses the same shared scheme state.

| API | Purpose |
| --- | --- |
| \`ThemeProvider\` | Makes preset and scheme controls available to descendants using \`useTheme()\`. |
| \`defaultPreset\` | Initial built-in preset, defaulting to \`kamod\`; a saved preference can take precedence. |
| \`defaultScheme\` | Initial \`light\`, \`dark\` or \`system\` preference, defaulting to \`system\`. |
| \`storage\` | Optional storage adapter; \`null\` disables provider storage access. |
| \`attributeTarget\` | Optional element receiving theme attributes and scheme classes. |
| \`useTheme()\` | Returns \`preset\`, \`presets\`, \`setPreset\`, \`scheme\`, \`setScheme\` and \`resolvedScheme\`. |
| \`isThemePresetId\` | Validates a string before passing it to \`setPreset\`. |
| \`getThemeInitScript\` | Produces early initialization script text with configurable defaults. |
| \`ThemeScript\` | Renders initialization using package defaults, with an optional CSP \`nonce\`. |

### Storage and initial appearance

The runtime uses \`theme-preset\` for the preset and \`theme\` for the scheme; the scheme is also reflected in a cookie. **Stored preference and resolved appearance differ:** System follows the device, while \`resolvedScheme\` is always Light or Dark.

For custom provider defaults, emit \`getThemeInitScript()\` with the same defaults in your framework’s document head. Merely defining the script string does not execute it. Avoid browser-only reads during server rendering, and do not introduce another system listener when the provider already manages it.

### CSS entrypoints

\`theme.css\` combines mappings, defaults and presets. The package also exports \`tokens.css\` and \`brands.css\` for deliberately assembled setups; most applications should start with the complete entry and scope their overrides after it.
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
  const [preset, api] = parseGuide(reference);
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
