## Set up Tailwind and theme CSS

Keep the foundation in **one global stylesheet**: load Tailwind, choose a theme entry and include the sources that contain your utility classes. For a complete app scaffold, follow [Set Up Your App](/docs/getting-started#set-up-your-app).

### Choose a theme entry

Use `@kamod-ch/themes/theme.css` for the full component-and-block foundation. The smaller UI entry is useful when you deliberately own the additional preset and sidebar mappings.

| Entry                          | What it supplies                                                               | When to use it                                          |
| ------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------- |
| `@kamod-ch/themes/theme.css`   | Semantic mappings, eight presets, sidebar roles and local scope resets.        | A shared application foundation.                        |
| `@kamod-ch/ui/theme.css`       | Common component defaults, source discovery, Code, CopyButton and Tabs styles. | A smaller UI baseline with app-owned additions.         |
| `@kamod-ch/ui/code/styles.css` | Reader layout, syntax palettes and CopyButton feedback; no theme foundation.   | Additive reader styles alongside the full themes entry. |

Choose **one foundation**: the first two entries contain overlapping defaults. The dedicated Code stylesheet can accompany the full theme; the UI entry already includes it.

### Connect Tailwind CSS v4

In Vite, enable `@tailwindcss/vite` alongside your existing Preact plugin. Import this stylesheet once from your application entry:

```css src/app.css
@import "tailwindcss";
@import "@kamod-ch/themes/theme.css";
/* Include when your app uses the Code reader. */
@import "@kamod-ch/ui/code/styles.css";

@source "../node_modules/@kamod-ch/ui/dist/**/*.{js,mjs}";
```

The full theme uses `@theme inline` to expose utilities such as `bg-card`, and supplies the class-based dark variant. Keep product overrides after these imports. The [optional Tailwind preset](/docs/theming/tailwind-preset) is for configuration-driven integrations; it is unnecessary for this CSS-first setup.

### Make source detection explicit

The `@source` path above is relative to `src/app.css`. Adjust it when your stylesheet, dependency installation or shared source lives elsewhere. Local application files are normally detected automatically; installed dependencies and external workspace folders may need explicit paths.

Keep complete class names visible to Tailwind. Use a finite mapping such as `ready: "bg-success text-success-foreground"` instead of assembling utility names from fragments. When styles disappear only in production, inspect source detection and generated CSS before adding overrides.

## Shape your design with tokens

Start with the roles your interface needs, then refine a preset. Shared values should keep the page, navigation and floating surfaces consistent.

### What a theme token actually is

A token names a responsibility: `--card` means a content surface, rather than a particular color. The chain is **preset value → semantic custom property → utility → element**. Changing the preset updates existing `bg-card` utilities without rebuilding Tailwind; introducing a new utility still requires source discovery.

Use complete color values: `background: var(--primary)` works with this contract; `hsl(var(--primary))` assumes a channel-only format that it does not promise. For a mixed treatment, use `color-mix()`.

### Follow inheritance and the cascade

Tokens follow DOM ancestry. A `data-theme-scope` wrapper resets the full contract before its `data-theme` and explicit `.dark` class select local values. A portal outside that wrapper does not inherit its palette.

Selector specificity still applies: a later `:root` override can lose to `:root[data-theme="ocean"]`. Match the intended preset and scheme, as in the recipe below. Component-specific variables belong on the component root when its own defaults reset inherited values.

### Work with semantic token pairs

Change surfaces and their matching foregrounds together. Background utilities do not automatically apply a text color.

| Role              | Surface and content                     | Typical classes                          |
| ----------------- | --------------------------------------- | ---------------------------------------- |
| Page              | `--background`, `--foreground`          | `bg-background text-foreground`          |
| Content           | `--card`, `--card-foreground`           | `bg-card text-card-foreground`           |
| Floating layer    | `--popover`, `--popover-foreground`     | `bg-popover text-popover-foreground`     |
| Main emphasis     | `--primary`, `--primary-foreground`     | `bg-primary text-primary-foreground`     |
| Supporting action | `--secondary`, `--secondary-foreground` | `bg-secondary text-secondary-foreground` |
| Quiet content     | `--muted`, `--muted-foreground`         | `bg-muted text-muted-foreground`         |
| Interaction       | `--accent`, `--accent-foreground`       | `bg-accent text-accent-foreground`       |

Inspect the consumer too: the current default Button pairs `bg-primary` with `text-background`. Feedback uses success, warning, error and info roles; destructive actions use `--destructive`. Keep readable labels alongside color. Boundaries and focus use `--border`, `--input`, `--ring` and `--outline`.

### Understand the sidebar token family

Sidebar roles are separate from page roles. Kamod uses **`--sidebar-background` and `--sidebar-outline`**, rather than another library's `--sidebar` or `--sidebar-ring` names.

| Tokens                                              | Purpose                                |
| --------------------------------------------------- | -------------------------------------- |
| `--sidebar-background`, `--sidebar-foreground`      | Navigation surface and content.        |
| `--sidebar-primary`, `--sidebar-primary-foreground` | Strong navigation emphasis.            |
| `--sidebar-accent`, `--sidebar-accent-foreground`   | Supporting interaction surfaces.       |
| `--sidebar-border`, `--sidebar-outline`             | Boundaries and visible keyboard focus. |

The full theme maps `bg-sidebar` to `--sidebar-background` and `ring-sidebar-ring` to `--sidebar-outline`. A selected row may consume accent rather than primary; check the actual component. Menus still need the popover pair. See [Block Theming](/blocks/theming#shape-your-design-with-tokens) for integrated navigation.

### Customize a preset with tokens

Place a targeted refinement after your global imports, with values for both schemes:

```css src/product-theme.css
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

These values are a starting point, not an audited palette. Check foregrounds, focus and interaction states against real content. An arbitrary `data-theme="my-brand"` selector does not register a new runtime preset; extending the supported IDs is a separate API change.

### Refine radius, typography and motion

`--radius` affects derived radius utilities; fixed local CSS stays fixed. `--font-sans` selects a font stack, but your app must load its font assets. Check small controls, long labels and form errors after changing either.

Motion comes from component styles and any animation utilities your app uses, rather than the color palette. Preserve reduced-motion behavior. For source-only color changes, use [Code's theme-token palette](/docs/code/installation#code-theme-tokens) without changing application roles.

## Manage appearance preferences

Static CSS works without a provider. Add runtime controls when people need a saved preset or Light, Dark and System choices.

### Add preset and scheme controls

Mount one `ThemeProvider` around components that call `useTheme()`. Read available palettes from `presets`, validate external strings with `isThemePresetId`, and update choices through `setPreset` and `setScheme`. The [runtime examples](/docs/theming/api-reference#connect-the-provider) show the complete boundary and controls.

A preset is the palette; `scheme` is the preference, while `resolvedScheme` is the resulting Light or Dark appearance. Defaults are fallbacks to saved choices. Use [Theme Toggle](/docs/theme-toggle/installation) for a compact control, or [explicit choices](/docs/theming/api-reference#read-and-change-appearance) when System should remain selectable.

### Keep the first render consistent

Emit `ThemeScript` in the server-rendered document head for package defaults, or use `getThemeInitScript` with the same defaults as your provider. The helper returns script text: defining a variable alone does not execute it. Follow [the startup examples](/docs/theming/api-reference#match-the-first-render) for placement and custom defaults.

Keep browser storage reads out of server-rendered component bodies. The runtime already observes device appearance; another listener is unnecessary. Test a first visit and a reload with saved choices, since existing preferences can override new defaults.

## Troubleshoot and verify

Trace a shared failure to its source before patching individual components. Use computed styles to identify the winning variable and selector.

### Diagnose theme problems in order

| What you see                         | Check first                                                             |
| ------------------------------------ | ----------------------------------------------------------------------- |
| Missing styling or utilities         | Global CSS import, Tailwind processing and source detection.            |
| Sidebar differs from other controls  | Full sidebar mappings, especially `--sidebar-background`.               |
| Selection changes without new colors | Loaded preset CSS and the target element's `data-theme`.                |
| Unreadable dark regions              | Surface/foreground pairs and hard-coded light colors.                   |
| Ignored defaults or a reload flash   | Saved `theme-preset`/`theme` values and matching early-script defaults. |
| Override or font has no effect       | Selector specificity, import order and loaded font assets.              |
