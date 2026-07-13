# Plan 001: Add a publishable themes package and integrate it into the docs

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 4fa1b22..HEAD -- package.json pnpm-workspace.yaml packages/core apps/demo/package.json apps/demo/src/theme apps/demo/src/styles apps/demo/src/docs packages/themes`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.
>
> **Working-tree safety check**: run `git status --short` before editing. This repo had unrelated local changes when the plan was written. Preserve any pre-existing changes that are not required by this plan.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: none
- **Category**: direction
- **Planned at**: commit `4fa1b22`, 2026-07-10

## Why this matters

Kamod UI currently has theme tokens in `packages/core/src/theme.css`, while richer brand presets and preset selection live only inside the demo app. That makes docs themeable, but it does not give consumers a reusable ThemeProvider, a package-level brand theme registry, or a documented Tailwind token/preset surface. A dedicated `packages/themes` workspace package can make theme tokens, Tailwind integration, brand themes, and runtime theme state reusable by both external apps and `apps/demo`.

## Current state

Relevant files and roles:

- `packages/core/src/theme.css` — published as `@kamod-ch/ui/theme.css`; contains the minimal semantic token contract and Tailwind v4 `@theme inline` mapping.
- `apps/demo/src/styles/foundation.css` — demo-only expanded token contract including `info`, `success`, `warning`, `error`, and sidebar tokens.
- `apps/demo/src/styles/themes.css` and `apps/demo/src/styles/themes/*.css` — demo-only brand presets selected via `html[data-theme="..."]`.
- `apps/demo/src/theme/theme-presets.ts` — demo-only registry and DOM applicator for preset ids.
- `apps/demo/src/theme/ThemePresetSelect.tsx` — demo-only select UI for presets.
- `packages/core/src/components/theme-toggle/ThemeToggle.tsx` — currently owns light/dark persistence by toggling `.dark` and `localStorage.theme`.
- `apps/demo/src/docs/pages/theming-doc.tsx` — existing theming docs, currently documenting the demo-only preset pattern.
- `packages/core/tsup.config.ts` — package build pattern to mirror for the new package.

Key excerpts to confirm before editing:

```css
/* packages/core/src/theme.css */
@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-outline: var(--outline);
}
```

```ts
// apps/demo/src/theme/theme-presets.ts
export const THEME_PRESET_STORAGE_KEY = "theme-preset";
export const DEFAULT_THEME_PRESET = "kamod";

export const THEME_PRESETS = [
  { id: "kamod", label: "Kamod" },
  { id: "shadcn", label: "shadcn (Geist)" },
  { id: "ocean", label: "Ocean" },
  { id: "sunset", label: "Sunset" },
  { id: "cursor-warm", label: "Cursor warm" },
  { id: "voltage", label: "Voltage" },
  { id: "watson", label: "Watson" },
  { id: "professional", label: "Professional (Electronics)" },
] as const;
```

```tsx
// packages/core/src/components/theme-toggle/ThemeToggle.tsx
const THEME_STORAGE_KEY = "theme";

const persistTheme = (darkMode: boolean) => {
  const value = darkMode ? "dark" : "light";
  document.documentElement.classList.toggle("dark", darkMode);
  window.localStorage.setItem(THEME_STORAGE_KEY, value);
  document.cookie = `${THEME_STORAGE_KEY}=${value}; path=/; max-age=31536000; SameSite=Lax`;
};
```

```css
/* apps/demo/src/styles/index.css */
@import "./theme-fonts.css";
@import "tailwindcss";
@import "tw-animate-css";
@plugin "@tailwindcss/forms";
@custom-variant dark (&:where(.dark, .dark *));
@source "../../../../packages/core/src/**/*.{ts,tsx}";

@import "./foundation.css";
@import "./themes.css";
@import "./app.css";
@import "./pages.css";
```

Repo conventions to match:

- pnpm workspace; packages live under `packages/*` and apps under `apps/*`.
- Preact components use `class` props, `ComponentChildren`, `JSX` types, and small utility helpers.
- Build tooling for published packages uses `tsup`, ESM, `dts: true`, and explicit package exports.
- CSS is Tailwind v4-first (`@theme`, `@theme inline`, `@custom-variant`, `@source`), but user-facing docs should explain that JS `tailwind.config` presets are optional/legacy compared to CSS imports in Tailwind v4.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Install/update lockfile | `pnpm install` | exit 0 |
| Package build | `pnpm --filter @kamod-ch/themes build` | exit 0 and `packages/themes/dist` exists |
| Themes tests | `pnpm --filter @kamod-ch/themes test` | all tests pass |
| Demo typecheck | `pnpm --filter demo typecheck` | exit 0, no TypeScript errors |
| Demo tests | `pnpm --filter demo test` | all tests pass |
| Full recursive typecheck | `pnpm typecheck` | exit 0 |
| Full build | `pnpm build` | exit 0 |

## Scope

**In scope**:

- Create `packages/themes/**`.
- Update root `package.json` only if needed for shared dev dependencies/scripts.
- Update `pnpm-lock.yaml` via `pnpm install`.
- Update `apps/demo/package.json` to depend on the new workspace package.
- Update `apps/demo/src/theme/**`, `apps/demo/src/styles/index.css`, `apps/demo/src/styles/themes.css`, and docs theming files to consume `@kamod-ch/themes`.
- Add tests for `packages/themes` and adjust demo tests only when imports change.

**Out of scope**:

- Do not rewrite existing UI components for every brand theme.
- Do not move `@kamod-ch/ui` components into `@kamod-ch/themes`.
- Do not introduce a React-only dependency; this repo is Preact-first.
- Do not change the public API of unrelated components.
- Do not remove `@kamod-ch/ui/theme.css` in this plan; keep it as the lightweight default compatibility path.

## Git workflow

- Branch suggestion: `feat/themes-package`.
- Commit style: Conventional Commits, e.g. `feat(themes): add reusable theme provider and brand presets`.
- Do not push or open a PR unless instructed.

## Steps

### Step 1: Define the package boundary and exports

Create `packages/themes/package.json` for a publishable package named `@kamod-ch/themes` with ESM-only exports. Use the same license/repository/engine conventions as `packages/core/package.json`.

Required exports:

- `.` → runtime API: `ThemeProvider`, hooks/utilities, registry constants.
- `./theme.css` → complete CSS entry for Tailwind v4 apps: token contract + base variables + all brand theme CSS.
- `./tokens.css` → only token contract and default light/dark variables.
- `./brands.css` → all brand theme selectors, assuming tokens are already loaded.
- `./tailwind-preset` → optional JS preset for consumers that still use a Tailwind config. Keep it small and documented as optional.
- Optional per-brand CSS exports such as `./brands/ocean.css` if easy to maintain.

Create `packages/themes/tsup.config.ts` mirroring `packages/core/tsup.config.ts`, with entries for `index`, `tailwind-preset`, and any non-CSS TS helpers. Add a build step that copies CSS files into `dist`.

**Verify**: `pnpm --filter @kamod-ch/themes build` → initially may fail until later steps provide source files; by the end of Step 1 it should at least resolve the package config without JSON/schema errors.

### Step 2: Extract and formalize CSS variable tokens

Create a token contract under `packages/themes/src/tokens.css` that starts from `packages/core/src/theme.css` and expands it to match demo needs from `apps/demo/src/styles/foundation.css`.

Minimum semantic token groups:

- Surface/text: `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`.
- Actions: `--primary`, `--primary-foreground`, `--primary-accent`, `--secondary`, `--secondary-foreground`, `--secondary-accent`, `--accent`, `--accent-foreground`.
- Status: `--info`, `--info-foreground`, `--success`, `--success-foreground`, `--warning`, `--warning-foreground`, `--error`, `--error-foreground`, `--destructive`, `--destructive-foreground`.
- Form/focus: `--border`, `--input`, `--ring`, `--outline`.
- Radius: `--radius` and Tailwind radius mappings.
- Sidebar: `--sidebar-background`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border`, `--sidebar-outline`.

Also include Tailwind v4 mappings in `@theme inline`, for example `--color-background: var(--background);` and `--color-sidebar: var(--sidebar-background);`.

Create `packages/themes/src/theme.css` that imports tokens and brands in the correct order. Create `packages/themes/src/brands.css` as the aggregator for brand CSS.

**Verify**: `rg "--color-sidebar|--color-info|--color-background" packages/themes/src/tokens.css` → finds mappings for sidebar, status, and base colors.

### Step 3: Move brand themes out of the demo and reduce component-specific overrides

Move or copy the reusable brand CSS from `apps/demo/src/styles/themes/*.css` into `packages/themes/src/brands/*.css`.

Rules:

- Keep selectors based on `:root[data-theme="id"]` and `.dark[data-theme="id"]` so they match the existing demo pattern.
- Preserve brand ids exactly: `kamod`, `shadcn`, `ocean`, `sunset`, `cursor-warm`, `voltage`, `watson`, `professional`.
- Prefer semantic token assignments over component selectors.
- If a current brand file contains many component-specific selectors (notably `watson.css`), keep only the minimal token-based subset in the published package unless the selector is necessary for brand identity. Document any retained component selector in a comment.
- Leave demo-only decorative CSS in `apps/demo/src/styles` if it affects docs layout rather than theme tokens.

**Verify**: `find packages/themes/src/brands -type f -name '*.css' | wc -l` → at least 8. `rg "data-theme=\"(kamod|shadcn|ocean|sunset|cursor-warm|voltage|watson|professional)\"" packages/themes/src/brands` → each id appears.

### Step 4: Implement the ThemeProvider runtime API

Create `packages/themes/src/index.tsx` and supporting modules. API should be small and Preact-first:

```ts
export const THEME_STORAGE_KEY = "theme";
export const THEME_PRESET_STORAGE_KEY = "theme-preset";
export const DEFAULT_COLOR_SCHEME = "system";
export const DEFAULT_THEME_PRESET = "kamod";

export const THEME_PRESETS = [
  { id: "kamod", label: "Kamod" },
  // ...same ids as today
] as const;

export type ThemePresetId = (typeof THEME_PRESETS)[number]["id"];
export type ColorScheme = "light" | "dark" | "system";
```

Implement:

- `isThemePresetId(value: string): value is ThemePresetId`.
- `resolveInitialThemePreset()` and `resolveInitialColorScheme()` safe for SSR (`typeof window === "undefined"`).
- `applyThemePreset(preset)` → sets `document.documentElement.dataset.theme`.
- `applyColorScheme(scheme)` → toggles `.dark`; for `system`, follows `matchMedia("(prefers-color-scheme: dark)")`.
- `ThemeProvider` component with props: `children`, `defaultPreset`, `defaultScheme`, `storage`, `attributeTarget`, `nonce?` if you add an inline script helper.
- `useTheme()` hook returning `{ preset, setPreset, scheme, setScheme, resolvedScheme, presets }`.
- `ThemeScript` or `getThemeInitScript()` helper to prevent flash before hydration; if implemented, document CSP nonce behavior.

Persistence compatibility:

- Continue using `localStorage.theme` for light/dark so existing `ThemeToggle` users are not reset.
- Continue using `localStorage.theme-preset` for brand preset.
- Continue writing the `theme` cookie when setting explicit light/dark, matching current `ThemeToggle` behavior.

**Verify**: `pnpm --filter @kamod-ch/themes typecheck` → exit 0.

### Step 5: Add tests and token validation

Add Vitest setup for `packages/themes` using `jsdom`, following the pattern in `packages/core/vitest.config.ts`.

Test cases:

- `isThemePresetId` accepts all exported ids and rejects unknown ids.
- `applyThemePreset("ocean")` sets `document.documentElement.getAttribute("data-theme")` to `ocean`.
- `applyColorScheme("dark")` adds `.dark`; `applyColorScheme("light")` removes it.
- `resolveInitialThemePreset()` returns `kamod` on SSR/no window and honors valid localStorage values in jsdom.
- `ThemeProvider` renders children and updates DOM attributes when setters are called from a test child component.

Add a lightweight token validation script or test that reads `packages/themes/src/brands/*.css` and fails if any required brand id is missing a light or dark selector.

**Verify**: `pnpm --filter @kamod-ch/themes test` → all tests pass.

### Step 6: Wire the demo to consume `@kamod-ch/themes`

Update `apps/demo/package.json` dependencies:

- Add `@kamod-ch/themes: "workspace:*"`.

Update CSS imports:

- In `apps/demo/src/styles/index.css`, replace local `foundation.css` and `themes.css` imports with the package CSS import, unless demo-specific base utilities in `foundation.css` still need to remain. A safe target is:
  - keep `theme-fonts.css`, `tailwindcss`, plugins, `@source` entries, `app.css`, `pages.css`;
  - import `@kamod-ch/themes/theme.css` before app/page CSS;
  - move demo-only utility classes from `foundation.css` into a new clearly named demo file only if they are not provided by the package.

Update theme code:

- Replace `apps/demo/src/theme/theme-presets.ts` imports/usages with exports from `@kamod-ch/themes`.
- Keep `ThemePresetSelect.tsx` as a demo UI component if it is docs-specific, but have it import `THEME_PRESETS`, `applyThemePreset`, `isThemePresetId`, `resolveInitialThemePreset`, and `THEME_PRESET_STORAGE_KEY` from `@kamod-ch/themes`.
- Wrap the demo root or docs shell in `ThemeProvider` if the provider is needed to synchronize color scheme + preset state. If `ThemeToggle` remains from `@kamod-ch/ui`, verify it does not fight the provider over `.dark`.

**Verify**: `pnpm install && pnpm --filter demo typecheck` → exit 0.

### Step 7: Decide how `@kamod-ch/ui` and `@kamod-ch/themes` interact

Keep `@kamod-ch/ui/theme.css` working. Do not break the README quick start.

Recommended compatibility approach:

- Leave `packages/core/src/theme.css` as the minimal default theme for users who only install `@kamod-ch/ui`.
- In docs, recommend `@kamod-ch/themes/theme.css` when users want brand themes, ThemeProvider, status/sidebar tokens, or preset switching.
- Do not add `@kamod-ch/themes` as a dependency of `@kamod-ch/ui` in this plan unless there is a clear reason; keeping it optional avoids increasing the default install surface.

If you choose to import tokens from `@kamod-ch/themes` into `@kamod-ch/ui`, STOP and report before proceeding because that changes publish/runtime coupling.

**Verify**: `pnpm --filter @kamod-ch/ui build` → exit 0 and `@kamod-ch/ui/theme.css` still exists in `packages/core/dist`.

### Step 8: Update docs and examples

Update `apps/demo/src/docs/pages/theming-doc.tsx` to document the new package:

- Installation:
  - `pnpm add @kamod-ch/ui @kamod-ch/themes @preact/signals`
- CSS setup:
  - Tailwind v4: `@import "tailwindcss"; @import "@kamod-ch/themes/theme.css";`
  - Compatibility note: `@kamod-ch/ui/theme.css` remains enough for the default minimal theme.
- Runtime setup:
  - Example `ThemeProvider` around the app.
  - Example `ThemePresetSelect` or a minimal select using `useTheme()`.
- Brand theme customization:
  - Show overriding semantic tokens, not individual component selectors.
- Tailwind preset:
  - Explain that Tailwind v4 primarily uses CSS `@theme`; `@kamod-ch/themes/tailwind-preset` is optional for config-driven projects.

Optionally add a new doc page/section named `brand-themes` only if the current theming page becomes too large. If adding a page, register it in `apps/demo/src/docs/registry.ts` and ensure the generated route manifest includes it via the existing docs route generator.

**Verify**: `pnpm --filter demo check` → PreactPress reports routes and no issues.

### Step 9: Final verification and packaging checks

Run the broad checks that catch workspace/export issues:

1. `pnpm typecheck` → exit 0.
2. `pnpm --filter @kamod-ch/themes build` → exit 0.
3. `pnpm --filter @kamod-ch/themes test` → exit 0.
4. `pnpm --filter demo test` → exit 0.
5. `pnpm build` → exit 0.
6. If `publint` and `attw` are configured for the new package, run them and fix export issues.

**Verify**: `git status --short` → only files in this plan's scope are modified, plus generated lockfile/build artifacts that are intentionally tracked. `packages/themes/dist` should not be committed if the repo normally ignores package dist output; check existing `.gitignore` behavior before staging.

## Test plan

- New package unit tests under `packages/themes/src/**/*.test.tsx` or `packages/themes/src/__tests__/**`.
- Token validation test that required brand ids and selectors exist.
- Existing demo tests should continue to pass after import rewiring.
- Manual visual smoke test via `pnpm --filter demo dev`: toggle light/dark, switch each brand, reload page, confirm persisted `data-theme` and `.dark` state.

## Done criteria

All must hold:

- [ ] `packages/themes/package.json` exists and exports runtime TS, `theme.css`, `tokens.css`, `brands.css`, and `tailwind-preset`.
- [ ] `packages/themes/src/tokens.css` contains the full semantic token contract including status and sidebar tokens.
- [ ] At least 8 brand theme CSS files exist under `packages/themes/src/brands` and are aggregated by `brands.css`.
- [ ] `ThemeProvider`, `useTheme`, preset constants, and DOM apply/resolve utilities are exported from `@kamod-ch/themes`.
- [ ] Demo imports theme presets/runtime helpers from `@kamod-ch/themes`, not from a duplicated local registry.
- [ ] The theming docs explain CSS variable tokens, Tailwind v4 CSS import, optional Tailwind preset, ThemeProvider, and brand themes.
- [ ] `pnpm typecheck`, `pnpm --filter @kamod-ch/themes test`, `pnpm --filter demo test`, and `pnpm build` exit 0.
- [ ] Existing `@kamod-ch/ui/theme.css` remains available and documented as the minimal default path.
- [ ] `plans/README.md` status row updated.

## STOP conditions

Stop and report back if:

- The current code no longer has the files/excerpts listed above.
- `@kamod-ch/ui` would need to depend on `@kamod-ch/themes` to make the package build pass.
- Tailwind v4 cannot consume `@kamod-ch/themes/theme.css` from the demo without changing the demo build system substantially.
- Preserving all current brand CSS would require shipping large numbers of component-specific `!important` overrides; ask whether those belong in the public package or should stay demo-only.
- Tests require changing unrelated component behavior.
- A verification command fails twice after a reasonable fix attempt.

## Maintenance notes

- Treat `packages/themes/src/tokens.css` as the source of truth for future semantic tokens. If components start using new token names, add them there and update validation tests.
- Keep brand themes token-driven. Component-specific brand CSS should be rare, commented, and reviewed carefully.
- If the project later wants `@kamod-ch/ui` to re-export or depend on `@kamod-ch/themes`, do that in a separate migration plan with release notes because it changes package coupling.
- Add release notes explaining that `@kamod-ch/themes` is optional and that existing `@kamod-ch/ui/theme.css` users do not need to migrate unless they want brand themes/provider support.
