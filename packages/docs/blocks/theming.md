---
title: Theming blocks
description: Apply the shared Kamod theme to copied layouts, sidebar surfaces and live previews without duplicating your app setup.
pageKind: blocks-guide
slug: theming
sidebar: false
outline: false
---

## Theme foundations

If this is your first integration, follow [Set Up Your App](/docs/getting-started#set-up-your-app) before customizing presets. The **Getting Started Guide** connects the same styling foundation to components, forms and copied blocks.

**Blocks Inherit Your Application Theme. They Do Not Need a Second Theme System.** Use the [Shared Theming & Tailwind Reference](/docs/theming/installation) for installation, CSS setup, semantic tokens, presets and runtime controls. This companion explains the extra checks that matter when those components become a complete screen.

### Understand the appearance layers

Set up the foundation once at the application boundary, then let copied layouts consume it. Keep the block’s navigation state, routing and data separate from appearance preferences.

| Your task                                       | Start here                                                              |
| ----------------------------------------------- | ----------------------------------------------------------------------- |
| First Tailwind integration or missing utilities | [Global CSS and Source Detection](/docs/theming/css-setup)              |
| Brand colors, radius, typography or presets     | [Shared Token Reference](/docs/theming/token-overrides)                 |
| Light, Dark, System or saved appearance         | [Appearance Controls and First Render](/docs/theming/provider-controls) |
| A copied sidebar or shell looks inconsistent    | Continue with this guide                                                |
| Local spacing, hierarchy or control variants    | [Component Styles](/blocks/styles)                                      |

### Distinguish preview settings from app settings

The showcase’s theme and scheme controls affect its preview, independently of the documentation page. Their saved choices let you compare a variant, but **Copying Source Does Not Export Those Preferences**, install fonts or add a theme picker to your app.

The preview’s device controls likewise do not define your application breakpoints. Test the copied block inside your real shell, where surrounding navigation, content and containers determine the available space.

## Set up Tailwind and theme CSS

If your components already render correctly, keep that working setup. A copied block needs its class names included in the same build, not another Tailwind pipeline.

### Choose a theme entry

The [Shared CSS Guide](/docs/theming/css-setup#choose-a-theme-entry) explains the two theme entries. For these layouts, prefer `@kamod-ch/themes/theme.css`: it includes the sidebar mappings and preset values used by the block examples. A minimal component setup may need that fuller contract before a sidebar looks correct.

### Connect Tailwind CSS v4

Keep Tailwind, the selected theme entry and application overrides in **One Global Stylesheet**. Follow the [CSS-First Setup](/docs/theming/css-setup#connect-tailwind-css-v4) if this is your first integration; do not add those imports again inside every copied block.

### Make source detection explicit

Check where you placed the copied source. App-local files normally participate in discovery; shared workspace folders may need an explicit source path in addition to the installed UI package. Paths are relative to the stylesheet.

```css src/app.css
/* Add only if your copied layouts live in this workspace folder. */
@source "../../shared-layouts/src/**/*.{ts,tsx}";
```

This is an addition to an existing setup, not a complete stylesheet. Use the [Source Detection Reference](/docs/theming/css-setup#make-source-detection-explicit) for installed component paths and complete class strings. Build the app and check a class that occurs only in the copied block; a successful dev preview alone is not proof it reaches production CSS.

## Shape your design with tokens

Theme the composition by role. A single screen can combine page, card, navigation and floating surfaces; making every region use the sidebar palette flattens that hierarchy.

### Work with semantic token pairs

Use `bg-background text-foreground` for the page, `bg-card text-card-foreground` for content surfaces and the popover pair for floating menus. Keep the original component variants when they already express the correct intent. The [Token Reference](/docs/theming/token-overrides) owns the complete contract and preset override examples.

### Understand the sidebar token family

Kamod uses **`--sidebar-background`** for the sidebar surface and **`--sidebar-outline`** for its focus treatment. A copied third-party palette using `--sidebar` or `--sidebar-ring` does not automatically configure those values.

Check navigation text, the selected row, hover feedback and keyboard focus together. Then open an account menu: its floating surface may consume popover tokens rather than sidebar tokens. The [Sidebar Token Table](/docs/theming/token-overrides#understand-the-sidebar-token-family) lists every mapping.

### Customize a preset with tokens

Refine the app’s chosen preset in the global stylesheet. The following optional example adjusts only the sidebar surface pair; the shared reference explains the [Complete Override Pattern](/docs/theming/token-overrides#customize-a-preset-with-tokens).

```css src/app.css
/* After the full theme import; applies only to the Ocean preset. */
:root[data-theme="ocean"] {
  --sidebar-background: oklch(0.97 0.01 250);
  --sidebar-foreground: oklch(0.25 0.03 250);
}

:root.dark[data-theme="ocean"] {
  --sidebar-background: oklch(0.2 0.02 250);
  --sidebar-foreground: oklch(0.95 0.01 250);
}
```

These values are a starting point, not an audited palette. Review the existing accent, border and focus colors against both new surfaces. Keep the preset choice at the app level so sibling pages use the same decisions.

### Refine radius, typography and motion

After changing shared typography or radius, check long navigation labels, collapsed icon buttons, menu corners and form errors in the integrated screen. Load your own font assets; the preview’s fonts do not arrive with the source. Keep reduced-motion behavior when adapting transitions. See [Shared Typography and Motion Guidance](/docs/theming/token-overrides#refine-radius-typography-and-motion) for the global setup.

## Manage appearance preferences

Reuse your app’s existing appearance controls and provider. Copying another layout should not introduce a competing storage key, system-preference listener or app-wide theme controller.

### Add preset and scheme controls

Put a [Theme Toggle](/docs/theme-toggle/installation) in an appropriate header, account menu or settings panel when a compact Light/Dark action is enough. Offer a scheme selector when users need an explicit System choice. The [Runtime Guide](/docs/theming/provider-controls) contains complete provider and selector examples.

Theme state and sidebar state serve different purposes. Retain the block’s sidebar provider for collapse and mobile navigation, and let appearance come from the application theme. Check overlays as well as the sidebar when using a custom `attributeTarget`; a portal outside that target will not inherit its scoped variables.

### Keep the first render consistent

Visit a nested application route directly with a saved dark preference. The shell, navigation and content should agree from the first paint. Configure the [Initialization Script](/docs/theming/provider-controls#keep-the-first-render-consistent) at the document boundary with defaults matching your provider, rather than adding scripts inside individual blocks.

## Troubleshoot and verify

First determine whether the problem affects every component or only the copied composition. Shared failures belong in the [Theme Troubleshooting Reference](/docs/theming/accessibility); local ones usually involve copied source, scoped styles or container layout.

### Diagnose theme problems in order

| What you see                                  | What to check in the block                                               |
| --------------------------------------------- | ------------------------------------------------------------------------ |
| Buttons look correct but the sidebar does not | Full sidebar token mappings and values, plus local background overrides. |
| A menu differs from its trigger               | Popover tokens and whether the portal inherits the intended theme scope. |
| Only copied layout utilities are missing      | Source discovery for the folder you copied or moved.                     |
| Your app differs from the showcase            | App preset, stored scheme, loaded fonts and real container width.        |
| A light region remains in dark mode           | Hard-coded colors on wrappers or example content.                        |
| A nested route flashes the wrong appearance   | Shared document initialization and provider defaults.                    |

### Finish with a theme review

Review the expanded and collapsed sidebar, mobile overlay, account menu and main content in both schemes. Use real names, long labels and form errors. Confirm visible focus and readable text on each surface, then refresh with saved settings and repeat the check in a production preview.

Keep **Theme Configuration Shared and Layout Behavior Local**. Return to [Theming & Tailwind](/docs/theming/installation) for foundation changes or [Component Styles](/blocks/styles) to refine this composition’s hierarchy and spacing.
