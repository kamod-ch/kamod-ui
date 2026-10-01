<p align="center">
  <img src="https://raw.githubusercontent.com/kamod-ch/kamod-ui/main/.github/assets/logo-kamod-ui-dark.svg#gh-light-mode-only" alt="Kamod UI" width="280" />
  <img src="https://raw.githubusercontent.com/kamod-ch/kamod-ui/main/.github/assets/logo-kamod-ui-light.svg#gh-dark-mode-only" alt="Kamod UI" width="280" />
</p>

# Kamod UI

A lightweight, accessible component system built natively for **Preact 11** and **Tailwind CSS v4**. Kamod UI provides composable TypeScript primitives, tree-shakeable subpath exports, signals-based interaction, and themes you can customize without pulling in a heavy runtime.

<p align="center">
  <a href="https://www.npmjs.com/package/@kamod-ch/ui"><img src="https://img.shields.io/npm/v/@kamod-ch/ui" alt="npm version" /></a>
  <img src="https://img.shields.io/badge/Preact-11-673ab8?logo=preact&logoColor=white" alt="Preact 11" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06b6d4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <a href="https://github.com/kamod-ch/kamod-ui/actions/workflows/ci.yml"><img src="https://github.com/kamod-ch/kamod-ui/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://github.com/kamod-ch/kamod-ui/stargazers"><img src="https://img.shields.io/github/stars/kamod-ch/kamod-ui?style=social" alt="GitHub stars" /></a>
  <a href="https://github.com/kamod-ch/kamod-ui/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/kamod-ch/kamod-ui" alt="license" /></a>
</p>

**[Demo](https://ui.kamod.ch/)** · **[Component docs](https://ui.kamod.ch/docs/button)** · **[npm](https://www.npmjs.com/package/@kamod-ch/ui)** · **[GitHub](https://github.com/kamod-ch/kamod-ui)** · **[Issues](https://github.com/kamod-ch/kamod-ui/issues)**

> **Kamod UI 2 is the Preact 11 release.** It requires Preact 11, `@preact/signals` 2.11+, Tailwind CSS v4, and Node.js 20+. Preact 10 users should stay on Kamod UI 1.x until they can upgrade.

> Demo snippets in this repo use local aliases like `@/components/kamod-ui/*`. In your app, install `@kamod-ch/ui` and import from the package.

> If Kamod UI saves you time, **[star the repo](https://github.com/kamod-ch/kamod-ui)** — it helps others discover the project.

![hero](https://raw.githubusercontent.com/kamod-ch/kamod-ui/main/.github/assets/kitchen-sink.png)

## Why Kamod UI?

Many UI kits are heavier than necessary, overly opinionated, or tied to React. Kamod UI targets a smaller stack instead:

- **Preact 11 native** — designed and tested against Preact 11 instead of relying on a React compatibility layer.
- **Tailwind v4 native** — import-based setup, semantic CSS tokens, dark mode, and brand presets.
- **Accessible interaction** — keyboard navigation, focus management, overlays, and controlled state are built into the primitives.
- **Tree-shakeable** — import from the root barrel or one of 66 per-component subpaths.
- **Composable and readable** — small TypeScript primitives that are straightforward to theme, extend, or fork.

## When to use Kamod UI

|                | Kamod UI                                      | Radix UI / shadcn       | Heavy design systems         |
| -------------- | --------------------------------------------- | ----------------------- | ---------------------------- |
| Preact         | Yes                                           | React only              | Varies                       |
| Tailwind-first | Yes                                           | Partial / yes           | Often custom tokens          |
| Bundle weight  | Per-component, typically 0.4–10 KB gzip       | Larger runtime          | Platform overhead            |
| Best for       | Preact + Tailwind apps you can read and adapt | React + Tailwind stacks | Org-wide token/CMS platforms |

**Choose Kamod UI when** you want Preact, Tailwind CSS v4, composable primitives, and source you can fork or extend without a heavy runtime.

**Choose something else when** you need React-only ecosystems (Radix/shadcn), no Tailwind, or a full design-system platform with CMS-driven tokens.

## Quick start

### New project?

```bash
npm create kamod@latest
```

Choose a starter:

- **Preact** → lightweight Preact applications
- **Astro** → content-first sites with Preact Islands
- **Otok** → full-stack Preact applications

### Vite + Preact + Tailwind v4 starter

```bash
pnpm create vite@latest my-app -- --template preact-ts
cd my-app
pnpm add @kamod-ch/ui @kamod-ch/themes preact@^11 @preact/signals@^2.11.3
pnpm add -D tailwindcss@^4 @tailwindcss/vite
```

```ts
// vite.config.ts
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [preact(), tailwindcss()],
});
```

```css
/* src/app.css */
@import "tailwindcss";
@import "@kamod-ch/ui/theme.css";

:root {
  font-family: Inter, system-ui, sans-serif;
}
```

```tsx
// src/main.tsx
import { render } from "preact";
import { App } from "./app";
import "./app.css";

render(<App />, document.getElementById("app")!);
```

```tsx
// src/app.tsx
import { Button } from "@kamod-ch/ui";

export function App() {
  return (
    <main class="p-6">
      <Button>Click me</Button>
    </main>
  );
}
```

This is the smallest full setup. If you already have a Vite app, keep the `@kamod-ch/ui/theme.css` import and install all runtime peers (`preact`, `@preact/signals`, and `@kamod-ch/themes`).

Browse the [live component docs](https://ui.kamod.ch/docs/button) for variants, composition, and RTL examples.

## Troubleshooting (Tailwind v4)

### Components look unstyled

Make sure your global CSS imports both files, in this order:

```css
@import "tailwindcss";
@import "@kamod-ch/ui/theme.css";
```

If `theme.css` is missing, Kamod's component classes and semantic tokens will not compile.

### Tailwind works in CSS but utility classes are missing in Vite

If you're using Vite, make sure the Tailwind v4 plugin is installed and enabled:

```ts
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

Without the plugin, Vite may not process the Tailwind v4 import pipeline correctly.

### You're on Tailwind v3

Kamod UI requires Tailwind CSS v4. Tailwind v3 does not support the import-based setup used here.

### Theme overrides do not apply

Override CSS variables after importing `theme.css`, not before it:

```css
@import "tailwindcss";
@import "@kamod-ch/ui/theme.css";

:root {
  --primary: var(--color-fuchsia-700);
  --radius: 0.75rem;
}
```

Browse the [live component docs](https://ui.kamod.ch/docs/button) for variants, composition, and RTL examples.

## Using Kamod UI

### Requirements

- **Preact** `^11.0.0` (Preact 10 is not supported by Kamod UI 2)
- **`@preact/signals`** `^2.11.3` (required peer dependency — see below)
- **`@kamod-ch/themes`** `^0.2.2` (theme runtime used by components such as `ThemeToggle`)
- **Tailwind CSS v4** (v3 is not supported)
- **Node.js** 20 or newer for development and package tooling
- An ESM-friendly bundler (Vite, Rolldown, esbuild, …). Kamod UI is **ESM-only**; it does not ship a CommonJS build.
- SSR: client components guard `document` / `window` access and re-render safely on the client.

### Install

```bash
pnpm add @kamod-ch/ui @kamod-ch/themes preact@^11 @preact/signals@^2.11.3
```

The published library on npm is **[`@kamod-ch/ui`](https://www.npmjs.com/package/@kamod-ch/ui)**. This monorepo root and `packages/docs` are not published. The former package [`@kamod-ui/core`](https://www.npmjs.com/package/@kamod-ui/core) and the unscoped [`kamod-ui`](https://www.npmjs.com/package/kamod-ui) name are legacy — install `@kamod-ch/ui` instead.

Import the default theme once so Tailwind compiles component classes and semantic CSS tokens:

```css
@import "tailwindcss";
@import "@kamod-ch/ui/theme.css";
```

### `@preact/signals`

`@preact/signals` is a **required peer dependency** — install it in every app, even when you only use presentational components like `Button`. That keeps a single signal runtime and avoids duplicate instances when you add interactive components later.

**In your app code**, you usually do **not** import signals yourself. Components manage open state, selection, and stores internally.

**Import signals yourself** when you use Kamod's lower-level helpers:

| Use case                            | Import                                                                         |
| ----------------------------------- | ------------------------------------------------------------------------------ |
| Custom controlled primitives        | `@kamod-ch/ui/lib/signals` → `createControllableSignal`                        |
| Overlay dismiss / roving focus      | `@kamod-ch/ui/lib/interactive` → `createDismissableLayer`, `createRovingFocus` |
| Advanced toast / sonner integration | `@kamod-ch/ui/toast` or `@kamod-ch/ui/sonner` stores                           |

See the [**Signals** column in the component reference](https://github.com/kamod-ch/kamod-ui/blob/main/.docs/COMPONENTS.md) for which exports use signals internally (direct, indirect via Dialog/Popover, or none).

### Per-component imports (tree-shaking)

Both styles are supported:

```ts
import { Button } from "@kamod-ch/ui"; // root barrel
import { Button } from "@kamod-ch/ui/button"; // per-component subpath
```

The demo docs in `packages/docs` rewrite the same examples to local aliases like `@/components/kamod-ui/button`. That alias only exists inside the demo app; in your app, install `@kamod-ch/ui` and import from the package.

The package ships a minimal `sideEffects` list (progress indeterminate keyframes and CSS only), so modern bundlers tree-shake the root barrel reliably.

### Component sizes

Each `@kamod-ch/ui/<name>` subpath is a separate export. Current gzip sizes range from **0.4–14.4 KB** (Kamod JS only; excludes peer dependencies and CSS).

See **[Component sizes & signals reference](https://github.com/kamod-ch/kamod-ui/blob/main/.docs/COMPONENTS.md)** for all 66 exports with min/gzip sizes and signal usage. Regenerate after core changes:

```bash
pnpm docs:components
```

### Customize the theme

Override semantic tokens after importing the default theme:

```css
@import "tailwindcss";
@import "@kamod-ch/ui/theme.css";

:root {
  --primary: var(--color-fuchsia-700);
  --primary-foreground: var(--color-white);
  --radius: 0.75rem;
}

.dark {
  --primary: var(--color-fuchsia-400);
  --primary-foreground: var(--color-neutral-950);
}
```

For full control, copy from [`packages/core/src/theme.css`](https://github.com/kamod-ch/kamod-ui/blob/main/packages/core/src/theme.css) or see the demo's [`foundation.css`](https://github.com/kamod-ch/kamod-ui/blob/main/packages/docs/src/styles/foundation.css) and [`themes.css`](https://github.com/kamod-ch/kamod-ui/blob/main/packages/docs/src/styles/themes.css).

## Documentation

**Live demo:** [ui.kamod.ch](https://ui.kamod.ch/) (custom domain; same deploy as [GitHub Pages](https://kamod-ch.github.io/kamod-ui/))

Interactive API docs live under `/docs/*` in the demo app (e.g. [`/docs/button`](https://ui.kamod.ch/docs/button)).

Run locally from the repo root:

```bash
pnpm install
pnpm dev
```

Open the URL printed in the terminal for the kitchen sink and component docs. Quality gates: `pnpm test`, `pnpm test:e2e`, `pnpm check`.

## Contributing

| Workspace             | Path                | Role                                                |
| --------------------- | ------------------- | --------------------------------------------------- |
| `@kamod-ch/ui`        | `packages/core/`    | Published component library (66 subpath exports)    |
| `@kamod-ch/themes`    | `packages/themes/`  | Theme tokens, brand presets, and Preact runtime     |
| `@kamod-ch/ui-motion` | `packages/motion/`  | Optional motion-enhanced compositions               |
| `@kamod-ch/openui`    | `packages/openui/`  | Typed OpenUI adapter for generative interfaces      |
| `@kamod-ch/typeset`   | `packages/typeset/` | Framework-independent content and typography styles |
| `@kamod-ch/ui-docs`   | `packages/docs/`    | Kitchen sink and interactive documentation          |

- Open issues for bugs and ideas; PRs welcome for components, docs, and examples.
- Key scripts: `pnpm dev`, `pnpm check`, `pnpm format`, `pnpm lint`, `pnpm docs:components`
- Tooling details: [`.docs/interna.md`](https://github.com/kamod-ch/kamod-ui/blob/main/.docs/interna.md)

Maintainers: see [`.docs/MAINTAINERS.md`](https://github.com/kamod-ch/kamod-ui/blob/main/.docs/MAINTAINERS.md) for npm release workflow.

## Support

- **[Star the repository](https://github.com/kamod-ch/kamod-ui)** — improves visibility in search and community lists.
- Share the project with others who use Preact or Tailwind.
- Watch the repo for release notifications (optional).
