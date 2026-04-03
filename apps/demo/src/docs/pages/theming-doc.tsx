import { ThemeToggle } from "@kamod-ui/core";
import { ThemePresetSelect } from "../../theme/ThemePresetSelect";
import { createGenericDocPage } from "./create-generic-doc-page";

export const themingDocPage = createGenericDocPage({
  slug: "theming",
  title: "Theming",
  usageLabel:
    "Use theme presets for visual direction and keep components consistent through semantic CSS tokens.",
  installationText:
    "Use ThemePresetSelect in app chrome and map tokens in foundation.css via :root[data-theme=\"...\"] and .dark[data-theme=\"...\"].",
  usageText:
    "Theme presets are persisted in localStorage and applied to <html data-theme=\"...\">. Keep component styling token-driven.",
  previewCode: `import { ThemeToggle } from "@/components/kamod-ui/theme-toggle";
import { ThemePresetSelect } from "../theme/ThemePresetSelect";

export const ThemingControls = () => (
  <div class="flex items-center gap-2">
    <ThemePresetSelect class="docs-theme-preset" selectClass="docs-theme-preset-select" />
    <ThemeToggle />
  </div>
);`,
  exampleSections: [
    {
      id: "preset-controls",
      title: "Preset Controls",
      text: "Place preset select and light/dark toggle together in your topbar.",
      code: `import { ThemeToggle } from "@/components/kamod-ui/theme-toggle";
import { ThemePresetSelect } from "../theme/ThemePresetSelect";

export const Example = () => (
  <div class="flex items-center gap-2">
    <ThemePresetSelect class="docs-theme-preset" selectClass="docs-theme-preset-select" />
    <ThemeToggle />
  </div>
);`,
      renderPreview: () => (
        <div class="flex items-center gap-2">
          <ThemePresetSelect class="docs-theme-preset" selectClass="docs-theme-preset-select" />
          <ThemeToggle />
        </div>
      )
    },
    {
      id: "token-overrides",
      title: "Token Overrides",
      text: "Override semantic tokens per preset instead of styling components directly.",
      code: `:root[data-theme="ocean"] {
  --background: var(--color-slate-50);
  --foreground: var(--color-slate-950);
  --primary: var(--color-cyan-700);
  --card: var(--color-cyan-50);
  --border: var(--color-slate-300);
}

.dark[data-theme="ocean"] {
  --background: var(--color-slate-950);
  --foreground: var(--color-slate-50);
  --primary: var(--color-cyan-400);
  --card: var(--color-slate-900);
  --border: --alpha(var(--color-slate-100) / 15%);
}`,
      renderPreview: () => (
        <div class="stack">
          <p class="docs-copy mb-0">Edit token blocks in <code>foundation.css</code> to restyle all components.</p>
        </div>
      )
    },
    {
      id: "dos-and-donts",
      title: "Do / Don&apos;t",
      text: "Keep themes maintainable by changing semantic tokens, not one-off component rules.",
      code: `/* Do */
:root[data-theme="sunset"] {
  --primary: var(--color-rose-600);
  --accent: var(--color-rose-100);
  --border: var(--color-orange-300);
}

/* Don't */
.my-button {
  background: hotpink;
}`,
      renderPreview: () => (
        <ul class="m-0 list-disc pl-5 text-sm">
          <li>Do: update semantic tokens like --primary, --card, --border.</li>
          <li>Do: provide both light and dark blocks per preset.</li>
          <li>Don&apos;t: patch individual components for each theme.</li>
        </ul>
      )
    }
  ],
  apiRows: [
    { prop: "Preset storage key", type: "theme-preset", defaultValue: "localStorage" },
    { prop: "Preset attribute", type: "data-theme", defaultValue: "document.documentElement" },
    { prop: "Main controls", type: "ThemePresetSelect + ThemeToggle", defaultValue: "topbar" },
    { prop: "Recommended token groups", type: "surface, text, action, status, border, sidebar", defaultValue: "all presets" }
  ],
  accessibilityText:
    "Ensure contrast remains readable in every preset and dark/light combination, especially for focus rings and muted text."
});

