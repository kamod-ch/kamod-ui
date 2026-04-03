# Kamod UI

Monorepo for `@kamod-ui/core` (Preact + Tailwind) with a demo/docs app.

## Theme Presets

The demo now supports **theme presets** in addition to light/dark mode:

- `kamod`
- `shadcn`
- `ocean`
- `sunset`
- `watson` (Watson tokens and `data-theme="watson"` overrides in [watson-theme.css](apps/demo/src/styles/watson-theme.css))

Preset state is stored in `localStorage` (`theme-preset`) and applied via `data-theme` on `<html>`.

### Add a New Preset

1. Add the preset id + label in [theme-presets.ts](/home/watzak/master/kamod-ui/apps/demo/src/theme/theme-presets.ts).
2. Add CSS variable overrides in [foundation.css](/home/watzak/master/kamod-ui/apps/demo/src/styles/foundation.css):
   - `:root[data-theme="<id>"]` for light values
   - `.dark[data-theme="<id>"]` for dark values
3. Keep semantic tokens consistent (for example `--primary`, `--accent`, `--border`, `--outline`, `--radius`, sidebar tokens).
4. Run `pnpm -r typecheck`.
5. Run `pnpm qa:themes` to generate/update the regression checklist in `tmp/theme-regression-checklist.md`.

### Docs: rewrite `@kamod-ui/core` in snippet strings

The demo rewrites doc code samples from `from "@kamod-ui/core"` to `@/components/kamod-ui/<slug>` at render time (`doc-snippet-imports.ts`). To **bulk-rewrite** string literals and template chunks under `apps/demo/src/docs`, run:

```bash
pnpm doc:rewrite-imports
```

The script transpiles `doc-snippet-rewrite.ts` (no Preact/registry load) and derives slug ordering from `apps/demo/src/docs/pages/*-doc.tsx`. Unit coverage lives in `apps/demo/src/docs/doc-snippet-rewrite.test.ts` (`pnpm test:demo`).

### DialogContent: `presentation="modal"` vs `presentation="slot"`

- **Default (`modal`):** `DialogContent` renders a dimmed backdrop plus a centered panel (shadcn-style). Override width with classes like `sm:max-w-sm` only.
- **`presentation="slot"`:** Use when **you** implement the full-screen layer yourself — typically `class` includes `fixed inset-0`, `flex items-center justify-center`, and a backdrop color. Otherwise the default modal adds a **second** backdrop and breaks layout. This applies to legacy patterns, full-screen previews, and is how `AlertDialogContent` is built internally.

### Where It Is Wired

- Preset selector UI: [ThemePresetSelect.tsx](/home/watzak/master/kamod-ui/apps/demo/src/theme/ThemePresetSelect.tsx)
- Initial preset apply on app start: [main.tsx](/home/watzak/master/kamod-ui/apps/demo/src/main.tsx)
- Topbar integration:
  - [DocsShell.tsx](/home/watzak/master/kamod-ui/apps/demo/src/docs/components/DocsShell.tsx)
  - [KitchenSinkPage.tsx](/home/watzak/master/kamod-ui/apps/demo/src/kitchen-sink/KitchenSinkPage.tsx) (demo home + `/kitchen-sink`)

## Design Guidelines For Themes

### 1) Contrast First

- Keep text/background pairs accessible (especially `--foreground` on `--background`, and `--muted-foreground` on `--muted`).
- Validate interactive states (`hover`, `focus`, `disabled`) in both light and dark.
- Keep `--outline` and `--ring` visible against surrounding surfaces.

### 2) Token Strategy

- Prefer changing semantic tokens (`--primary`, `--accent`, `--border`) instead of component-specific CSS.
- Update both base and sidebar token families to avoid mismatched nav/surface colors.
- Keep destructive and status colors (`--error`, `--warning`, `--success`, `--info`) distinct and readable.

### 3) Radius And Feel

- Use `--radius` to define visual personality per preset.
- Recommended range for this system: `0.5rem` to `0.875rem`.
- Extreme radius changes can break visual rhythm across dense components.

### 4) Safe Update Checklist

1. Add/update preset in `:root[data-theme=\"...\"]` and `.dark[data-theme=\"...\"]`.
2. Test key components: `button`, `input`, `card`, `dialog`, `select`, `table`.
3. Check docs layout surfaces (topbar, sidebar, code blocks, cards).
4. Run `pnpm -r typecheck`.
