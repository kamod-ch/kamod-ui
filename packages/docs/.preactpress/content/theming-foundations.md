## Set up Tailwind and theme CSS

Connect the foundation in order: choose a theme entry, load it through your existing Tailwind pipeline, then make sure the build can find every utility class. Keep this setup in **one global stylesheet**.

### Choose a theme entry

For the shared component and block setup in this library, use **`@kamod-ch/themes/theme.css`**. It includes token mappings, default values and the built-in brand presets, including the sidebar token family. This is the most direct way to keep a copied sidebar or shell consistent with other Kamod controls.

`@kamod-ch/ui/theme.css` is a smaller compatibility theme for a simpler setup. It provides common component tokens, but it is not interchangeable with the full preset and sidebar contract. If you deliberately use it for a block, supply any additional mappings and values that block needs. Start with the full theme when following these guides.

Choose one entry for your global setup rather than layering both indiscriminately. Their defaults overlap, and a later import can override values you thought were already settled. Keep custom overrides after the chosen entry and inspect the cascade when a value unexpectedly changes.

```bash
pnpm add @kamod-ch/themes @preact/signals
```

This command adds theme dependencies only. Your app still needs Preact, Kamod UI and any dependencies of the components you use. Preserve packages your application already has installed; copied layouts have their own [block integration steps](/blocks/getting-started#check-your-project-foundation).

### Connect Tailwind CSS v4

Tailwind v4 uses CSS-first configuration. Import Tailwind before the theme entry so the theme can expose semantic utility mappings. In a Vite app, enable `@tailwindcss/vite` alongside your existing Preact plugin, then import the global stylesheet from your app entry.

```css src/app.css
@import "tailwindcss";
@import "@kamod-ch/themes/theme.css";

/* This stylesheet lives in src/; adjust for your project. */
@source "../node_modules/@kamod-ch/ui/dist/**/*.{js,mjs}";
```

The theme entry defines mappings such as `--color-background: var(--background)` using `@theme inline`. That allows `bg-background` to follow the selected runtime token. It also provides the class-based dark variant, so an additional conflicting dark-mode setup is unnecessary when using this entry.

In an existing app, merge this setup into the stylesheet and build pipeline you already use. Do not add a second Tailwind import in a block-local CSS file. A global import belongs at the application boundary; local block styles should only describe that block’s additional presentation.

Kamod also exports a Tailwind preset for config-driven compatibility setups. It is not required for the CSS-first v4 path above. See the [theming package reference](/docs/theming/tailwind-preset) if your build intentionally uses a configuration-based integration.

### Make source detection explicit

Tailwind must see the class names used by both your copied source and the installed UI components. Local application files are normally detected automatically, while dependency files may need an explicit `@source`. The example above points to the installed UI package’s runtime files from `src/app.css`.

Check the actual package layout in your project. A stylesheet in `src/styles/` needs a different relative path from one directly in `src/`. A monorepo can put shared code outside the app’s automatically scanned directory. Paths in these examples describe a conventional single-app layout, not every workspace arrangement.

```css src/styles/app.css
@import "tailwindcss";
@import "@kamod-ch/themes/theme.css";

@source "../../node_modules/@kamod-ch/ui/dist/**/*.{js,mjs}";
/* Add a shared source only if your app really uses this folder. */
@source "../../../shared-ui/src/**/*.{ts,tsx}";
```

Keep full class strings visible to Tailwind. Building a utility from fragments such as a color name and a numeric suffix can leave the final class absent from production CSS. Prefer a finite mapping of complete classes or a semantic token when the value varies by state.

```tsx src/components/status-classes.ts
export const statusClasses = {
  ready: "bg-success text-success-foreground",
  waiting: "bg-warning text-warning-foreground",
  failed: "bg-error text-error-foreground",
} as const;
```

These status utilities come from the full theme contract. The mapping controls presentation only; include a readable status label in the component that uses it. If a utility works locally but disappears in production, inspect source detection and the built CSS before increasing selector specificity.

## Shape your design with tokens

Once the styles are connected, work from shared color roles to the details of your brand. Start with surface and foreground pairs, include the sidebar, then refine your preset, typography and shape.

### Work with semantic token pairs

Many surfaces have a matching foreground token. Change both when adjusting a surface so text remains legible. The palette should communicate consistent roles rather than copying a screenshot’s individual color values into each component.

| Role                 | Tokens                                                              | Typical utilities                           |
| -------------------- | ------------------------------------------------------------------- | ------------------------------------------- |
| Page                 | `--background`, `--foreground`                                      | `bg-background`, `text-foreground`          |
| Content surface      | `--card`, `--card-foreground`                                       | `bg-card`, `text-card-foreground`           |
| Floating surface     | `--popover`, `--popover-foreground`                                 | `bg-popover`, `text-popover-foreground`     |
| Main emphasis        | `--primary`, `--primary-foreground`                                 | `bg-primary`, `text-primary-foreground`     |
| Supporting action    | `--secondary`, `--secondary-foreground`                             | `bg-secondary`, `text-secondary-foreground` |
| Quiet content        | `--muted`, `--muted-foreground`                                     | `bg-muted`, `text-muted-foreground`         |
| Interaction emphasis | `--accent`, `--accent-foreground`                                   | `bg-accent`, `text-accent-foreground`       |
| Boundaries and focus | `--border`, `--input`, `--ring`, `--outline`                        | `border-border`, `ring-ring`                |
| Feedback             | `--success`, `--warning`, `--error`, `--info` and their foregrounds | `bg-error`, `text-error-foreground`         |

Inspect the actual component treatment as well as the token table. For example, the current default Button uses `bg-primary` with `text-background`; changing only `--primary-foreground` will not change that variant’s label. A custom palette must be checked against the components that consume it, not only against isolated swatches.

Use `--destructive` and its foreground for destructive actions, keeping their meaning distinct from a decorative accent. Chart tokens `--chart-1` through `--chart-5` provide coordinated series colors, but a chart still needs labels or other cues that distinguish its data without color alone.

### Understand the sidebar token family

The sidebar has its own surface and interaction tokens so it can remain subtly distinct from the page. In Kamod, the background variable is **`--sidebar-background`**, and the focus variable is **`--sidebar-outline`**. Do not copy a third-party theme’s `--sidebar` or `--sidebar-ring` variables and assume they target the same contract.

| Sidebar token                                       | Purpose                                                                     |
| --------------------------------------------------- | --------------------------------------------------------------------------- |
| `--sidebar-background`                              | The navigation surface behind sidebar content.                              |
| `--sidebar-foreground`                              | Default navigation text and icons.                                          |
| `--sidebar-primary`, `--sidebar-primary-foreground` | Strong sidebar emphasis and its content color.                              |
| `--sidebar-accent`, `--sidebar-accent-foreground`   | Supporting interaction surfaces and their text.                             |
| `--sidebar-border`                                  | Boundaries associated with sidebar regions.                                 |
| `--sidebar-outline`                                 | Sidebar focus treatment; mapped to both sidebar outline and ring utilities. |

The full theme maps `bg-sidebar` to `--sidebar-background`, and `ring-sidebar-ring` to `--sidebar-outline`. Keep those mappings intact when adapting a palette. If ordinary buttons look themed but the sidebar does not, inspect this token family before changing every navigation row. For complete layouts, follow the [block application guide](/blocks/theming#shape-your-design-with-tokens).

Remember that a block may also contain ordinary cards, popovers and page backgrounds. A sidebar-only palette does not replace their tokens. Check the complete screen, especially menus that open from the sidebar into a floating layer.

### Customize a preset with tokens

Place overrides after the full theme import, and target the preset and scheme you intend to change. A simple `:root` rule can lose to a more specific preset selector, so use the same scoped selector when refining a built-in preset.

```css src/app.css
@import "tailwindcss";
@import "@kamod-ch/themes/theme.css";
@source "../node_modules/@kamod-ch/ui/dist/**/*.{js,mjs}";

:root[data-theme="ocean"] {
  --primary: oklch(0.42 0.13 250);
  --primary-foreground: oklch(0.98 0.01 250);
  --sidebar-background: oklch(0.97 0.01 250);
  --sidebar-foreground: oklch(0.25 0.03 250);
  --radius: 0.5rem;
}

:root.dark[data-theme="ocean"] {
  --primary: oklch(0.8 0.1 250);
  --primary-foreground: oklch(0.2 0.03 250);
  --sidebar-background: oklch(0.2 0.02 250);
  --sidebar-foreground: oklch(0.95 0.01 250);
}
```

These are example refinements, not a complete audited brand palette. Review the resulting controls, text and focus indicators with your real content. If you change an accent or surface substantially, check its foreground, hover and disabled treatments together. Do not judge the full theme from one primary button.

The runtime’s `ThemePresetId` is a defined set of supported IDs. Adding an arbitrary CSS selector such as `data-theme="my-brand"` does not automatically register a selectable preset with `setPreset`. For a straightforward application customization, override a supported preset. A new runtime-selectable preset requires a deliberate extension of the theme contract and its controls.

### Refine radius, typography and motion

`--radius` feeds the theme’s derived radius utilities. Changing it adjusts components that use those utilities, while fixed radius values in local CSS remain fixed. Keep the value within a sensible range and review small controls as well as large cards; derived small radii subtract from the base token.

Typography has both a token and an asset side. Setting `--font-sans` names a font stack; it does not download the font files. If you want a specific family, install or serve it through your application’s font pipeline, load it once, and provide useful fallbacks. Do not assume that the fonts loaded by the documentation site are automatically included with copied block source.

```css src/app.css
/* After your imports; use a font your app actually loads. */
@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}
```

Review headings, navigation labels, monospace paths and form errors after changing fonts. A different family changes text width and can expose truncation or wrapping problems even if the nominal font size stays the same.

Animation styles are separate from color tokens. Inspect the chosen components and application setup for any required animation utilities; do not import every plugin used by the documentation site simply to reproduce a block. If you add `tw-animate-css` or another stylesheet for utilities you actually use, include it once and verify reduced-motion behavior. A color theme alone does not define every animation.

## Manage appearance preferences

Add runtime controls when people need to choose their appearance. Keep **preset and color scheme separate**, and use matching defaults for the provider and the first page render.

### Add preset and scheme controls

Use `ThemeProvider` when your app needs runtime theme selection. Put it around the part of the application that uses `useTheme()`. The provider’s defaults establish a starting preference; an existing stored preference can take precedence.

```tsx src/App.tsx
import { ThemeProvider } from "@kamod-ch/themes";
import type { ComponentChildren } from "preact";
import { AppearanceControls } from "./components/AppearanceControls";

export function App({ children }: { children: ComponentChildren }) {
  return (
    <ThemeProvider defaultPreset="kamod" defaultScheme="system">
      <AppearanceControls />
      {children}
    </ThemeProvider>
  );
}
```

This illustrates provider placement. In your real layout, place the appearance controls in a settings screen, header or account menu rather than adding an unrelated row above a full-height shell. The theme provider handles appearance; it does not replace the block’s sidebar provider.

Read the supported preset list from `useTheme()` instead of duplicating it in a select. The current library includes Kamod, shadcn (Geist), Ocean, Sunset, Cursor warm, Voltage, Watson and Professional (Electronics). Preset selection applies `data-theme` to the target element; scheme selection manages the `.dark` class.

```tsx src/components/AppearanceControls.tsx
import { isThemePresetId, useTheme } from "@kamod-ch/themes";

export function AppearanceControls() {
  const { preset, presets, setPreset, scheme, setScheme } = useTheme();
  return (
    <div class="flex flex-wrap gap-4">
      <label class="grid gap-1 text-sm">
        Theme
        <select
          value={preset}
          onChange={(event) => {
            const value = event.currentTarget.value;
            if (isThemePresetId(value)) setPreset(value);
          }}
        >
          {presets.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label class="grid gap-1 text-sm">
        Color scheme
        <select
          value={scheme}
          onChange={(event) => {
            const value = event.currentTarget.value;
            if (value === "light" || value === "dark" || value === "system") setScheme(value);
          }}
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
    </div>
  );
}
```

For a compact Light/Dark action, use [Theme Toggle](/docs/theme-toggle/installation) from `@kamod-ch/ui`. It shares the runtime’s scheme state and supports an optional ripple transition; keep the scheme select when users need an explicit System choice.

These native selects keep the example focused on the runtime API. Style them with your application’s form controls, preserving labels and keyboard operation. `scheme` is the user’s preference, while `resolvedScheme` tells you the resulting light or dark appearance when that preference is System.

### Keep the first render consistent

Applying the stored theme only after the UI mounts can briefly show the wrong appearance. For server-rendered or statically generated documents, Kamod exports `getThemeInitScript()` to apply the stored preset and resolved scheme before the page paints. Integrate it with your framework’s document-head mechanism.

```tsx src/document-theme.ts
import { getThemeInitScript } from "@kamod-ch/themes";

export const themeInitialization = getThemeInitScript({
  defaultPreset: "kamod",
  defaultScheme: "system",
});
```

The returned value is script text. Defining this constant alone does not execute it: your document renderer must emit it in an early script using the framework’s supported API. If your application has a Content Security Policy, supply the nonce or hash required by that policy. Use the same default preset and scheme as your runtime provider.

Keep browser APIs out of server-rendered component bodies. The theme package guards its own DOM access, but application code that reads `window`, `document` or storage during server rendering can still fail. A custom browser listener belongs in an effect with cleanup; avoid adding a second system-preference listener when the provider already owns that behavior.

The runtime uses `theme-preset` for the preset preference and `theme` for the scheme preference. When testing defaults, remember that existing storage can override them. Verify first visit, refresh, an explicit user selection and system scheme changes as separate cases.

## Troubleshoot and verify

Check the global setup before adding local overrides. Once the theme behaves correctly, review the complete composition with real content, saved preferences and both color schemes.

### Diagnose theme problems in order

| Symptom                                   | First checks                                                                                                   |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| No styling at all                         | Is the global CSS imported, processed by Tailwind and included in the page?                                    |
| Some component classes are missing        | Does source detection include the installed UI runtime and copied local source?                                |
| Sidebar looks different from the rest     | Are the full sidebar mappings and variables present, especially `--sidebar-background`?                        |
| Preset selector changes but colors do not | Is the full theme CSS loaded, and does `data-theme` reach the element that scopes the tokens?                  |
| Dark mode has unreadable regions          | Are the surface and foreground tokens both defined for dark mode? Are hard-coded light colors overriding them? |
| Defaults seem ignored                     | Is an earlier choice stored under `theme-preset` or `theme`?                                                   |
| Theme flashes on reload                   | Is the initialization script emitted early with defaults matching the provider?                                |
| A brand override has no effect            | Does the selector match the current preset and have the required specificity and import order?                 |
| A custom font never appears               | Are the actual font assets loaded, and does the rendered element use the intended font family?                 |

Use browser computed styles to trace the winning variable and selector before adding another override. Fixing the global cause is usually clearer than patching every block that consumes the same token. Recheck production output when the problem appears only after deployment.

### Finish with a theme review

Test light, dark and System choices, then refresh with a saved selection. Check at least one first visit without preferences. If you offer several presets, review each with the sidebar expanded and collapsed, any mobile overlay open, and forms showing errors as well as their resting state.

Check contrast and focus in context. A muted label that is readable on the page may be too faint inside a tinted card; a border that separates two light surfaces may disappear in dark mode. Verify text, icons, focus indicators, disabled controls and destructive actions together.

Keep theme configuration centralized and keep component-specific behavior in the composition. Continue with the [runtime reference](#api-reference) for public exports, [Component styles](/blocks/styles) for local visual treatments, or [Theming blocks](/blocks/theming) to apply this foundation to a copied layout.
