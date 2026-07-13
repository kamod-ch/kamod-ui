import { ThemeToggle } from "@kamod-ch/ui";
import { ThemePresetSelect } from "../../theme/ThemePresetSelect";
import { createGenericDocPage } from "./create-generic-doc-page";

export const themingDocPage = createGenericDocPage({
  slug: "theming",
  title: "Theming",
  usageLabel:
    "Use @kamod-ch/themes for reusable tokens, brand presets, and a Preact-first theme runtime.",
  installationText:
    "Install @kamod-ch/ui, @kamod-ch/themes, and @preact/signals, then import the themes CSS next to Tailwind. @kamod-ch/ui/theme.css remains the lightweight default if you only need the minimal theme.",
  usageText:
    'Theme presets are applied to <html data-theme="..."> and color scheme is represented by the .dark class. Keep custom brands token-driven and avoid one-off component overrides.',
  previewCode: `import { ThemeProvider } from "@kamod-ch/themes";
import { ThemeToggle } from "@kamod-ch/ui";
import { ThemePresetSelect } from "../theme/ThemePresetSelect";

export const App = ({ children }) => (
  <ThemeProvider>
    <div class="flex items-center gap-2">
      <ThemePresetSelect class="docs-theme-preset" selectClass="docs-theme-preset-select" />
      <ThemeToggle />
    </div>
    {children}
  </ThemeProvider>
);`,
  exampleSections: [
    {
      id: "css-setup",
      title: "Tailwind v4 CSS setup",
      text: "Import the full themes entry after Tailwind to get semantic tokens, default light/dark variables, and all brand presets. Use @kamod-ch/ui/theme.css instead when you want only the minimal compatibility theme.",
      code: `/* app.css */
@import "tailwindcss";
@import "@kamod-ch/themes/theme.css";

/* optional minimal path */
/* @import "@kamod-ch/ui/theme.css"; */`,
      renderPreview: () => (
        <div class="stack">
          <p class="docs-copy mb-0">
            Tailwind v4 reads the package&apos;s CSS @theme mappings directly.
          </p>
        </div>
      ),
    },
    {
      id: "provider-controls",
      title: "Runtime provider and controls",
      text: "ThemeProvider keeps preset and scheme state in sync with localStorage. You can build controls with useTheme() or keep using the demo ThemePresetSelect and @kamod-ch/ui ThemeToggle.",
      code: `import { ThemeProvider, useTheme } from "@kamod-ch/themes";

const BrandSelect = () => {
  const { preset, setPreset, presets } = useTheme();
  return (
    <select value={preset} onChange={(event) => setPreset(event.currentTarget.value)}>
      {presets.map((item) => <option value={item.id}>{item.label}</option>)}
    </select>
  );
};

export const App = ({ children }) => (
  <ThemeProvider defaultPreset="kamod" defaultScheme="system">
    <BrandSelect />
    {children}
  </ThemeProvider>
);`,
      renderPreview: () => (
        <div class="flex items-center gap-2">
          <ThemePresetSelect class="docs-theme-preset" selectClass="docs-theme-preset-select" />
          <ThemeToggle />
        </div>
      ),
    },
    {
      id: "token-overrides",
      title: "Brand token overrides",
      text: "Override semantic tokens per preset. Components consume the token contract for surfaces, actions, status colors, borders, radius, and sidebar colors.",
      code: `@import "tailwindcss";
@import "@kamod-ch/themes/theme.css";

:root[data-theme="ocean"] {
  --background: var(--color-slate-50);
  --foreground: var(--color-slate-950);
  --primary: var(--color-cyan-700);
  --card: var(--color-cyan-50);
  --info: var(--color-sky-300);
  --sidebar-background: var(--color-cyan-50);
  --border: var(--color-slate-300);
}

.dark[data-theme="ocean"] {
  --background: var(--color-slate-950);
  --foreground: var(--color-slate-50);
  --primary: var(--color-cyan-400);
  --card: var(--color-slate-900);
  --sidebar-background: var(--color-slate-900);
  --border: --alpha(var(--color-slate-100) / 15%);
}`,
      renderPreview: () => (
        <div class="stack">
          <p class="docs-copy mb-0">Override semantic token blocks to restyle all components.</p>
        </div>
      ),
    },
    {
      id: "tailwind-preset",
      title: "Optional Tailwind preset",
      text: "Tailwind v4 projects should prefer CSS @theme imports. @kamod-ch/themes/tailwind-preset is only for config-driven or compatibility setups.",
      code: `// tailwind.config.ts (optional / legacy)
import kamodThemes from "@kamod-ch/themes/tailwind-preset";

export default {
  presets: [kamodThemes],
};`,
      renderPreview: () => (
        <p class="docs-copy mb-0">CSS imports are the primary Tailwind v4 integration path.</p>
      ),
    },
  ],
  apiRows: [
    { prop: "Package", type: "@kamod-ch/themes", defaultValue: "optional add-on" },
    { prop: "CSS entry", type: "theme.css / tokens.css / brands.css", defaultValue: "theme.css" },
    { prop: "Runtime", type: "ThemeProvider, useTheme, ThemeScript", defaultValue: "Preact" },
    { prop: "Preset storage key", type: "theme-preset", defaultValue: "localStorage" },
    { prop: "Scheme storage key", type: "theme", defaultValue: "localStorage + cookie" },
    {
      prop: "Token groups",
      type: "surface, action, status, form/focus, radius, sidebar",
      defaultValue: "all presets",
    },
  ],
  accessibilityText:
    "Ensure contrast remains readable in every preset and dark/light combination, especially for focus rings and muted text.",
});
