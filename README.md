<p align="center">
  <img src="docs/images/logo-kamod-ui-dark.svg#gh-light-mode-only" alt="Kamod UI" width="162" />
  <img src="docs/images/logo-kamod-ui-light.svg#gh-dark-mode-only" alt="Kamod UI" width="162" />
</p>

<h1 align="center">Kamod UI</h1>

Lightweight UI components for **Preact** and **Tailwind**: composable primitives you can customize, extend, and ship without a heavy runtime. Open source; source is meant to be read and adapted.

<p align="center">
  <a href="https://www.npmjs.com/package/@kamod-ui/core"><img src="https://img.shields.io/npm/v/@kamod-ui/core" alt="npm version" /></a>
  <a href="https://github.com/kamod-ch/kamod-ui/stargazers"><img src="https://img.shields.io/github/stars/kamod-ch/kamod-ui?style=social" alt="GitHub stars" /></a>
  <a href="https://github.com/kamod-ch/kamod-ui/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/kamod-ch/kamod-ui" alt="license" /></a>
</p>

- **Live demo:** [ui.kamod.ch](https://ui.kamod.ch/)
- **Repository:** [github.com/kamod-ch/kamod-ui](https://github.com/kamod-ch/kamod-ui/)

If Kamod UI saves you time, consider **[starring the repo](https://github.com/kamod-ch/kamod-ui)** — it helps others discover the project.

![hero](docs/images/kitchen-sink.png)

## Why Kamod UI?

Many UI kits are heavier than necessary, overly opinionated, or tied to React. Kamod UI targets a smaller stack instead:

- **Preact-first** — tiny runtime and familiar patterns if you already use React-like APIs.
- **Tailwind-native** — style with utilities instead of a separate theme layer.
- **Composable** — build UIs from small pieces without extra abstraction.
- **Practical** — ship only what you need; the codebase stays easy to follow.

## Comparison

| Feature | Kamod UI | Radix UI | shadcn/ui |
| --- | :---: | :---: | :---: |
| Preact support | ✅ | ❌ | ❌ |
| Tailwind-first | ✅ | ⚠️ | ✅ |
| Lightweight | ✅ | ⚠️ | ⚠️ |

## Live demo (GitHub Pages)

The deployed kitchen sink and docs live at the **repository root URL** of GitHub Pages, not under `apps/demo` (that path exists only in this monorepo):

**[https://kamod-ch.github.io/kamod-ui/](https://kamod-ch.github.io/kamod-ui/)**

## Documentation

Run the demo app from the repo root:

```bash
pnpm install
pnpm dev
```

Then open the local URL printed in the terminal to browse the kitchen sink and component docs.

## Using Kamod UI

### Requirements

- **Preact** `>= 10.26`
- **`@preact/signals`** `>= 2.0` (peer dependency)
- **Tailwind CSS v4** (v3 is not supported)
- An ESM-friendly bundler (Vite, Rolldown, esbuild, Next.js, …). Kamod UI is **ESM-only** (`"type": "module"`); it does not ship a CommonJS build.
- SSR: all client components guard `typeof document` / `window` access and re-render safely on the client. Importing components in a Node SSR context is fine.

### Install

```bash
pnpm add @kamod-ui/core preact @preact/signals
```

The published library on npm is **[`@kamod-ui/core`](https://www.npmjs.com/package/@kamod-ui/core)** only. This monorepo root (`kamod-ui`) and `apps/demo` are not published (`private` in the root `package.json`). If you find the legacy unscoped package [`kamod-ui`](https://www.npmjs.com/package/kamod-ui) on npm, do not use it — install `@kamod-ui/core` instead.

Kamod UI components ship JSX and Tailwind utility classes. Import the default theme once so Tailwind can compile the component classes and the components can read their semantic CSS tokens.

For Tailwind CSS v4, add this to the CSS file where you import Tailwind:

```css
@import "tailwindcss";
@import "@kamod-ui/core/theme.css";
```

The theme import includes the required Tailwind source scan, dark variant and default semantic tokens.

### Per-component imports (tree-shaking)

Both styles below are supported. Use the per-component path if you want to be defensive about your bundle:

```ts
import { Button } from "@kamod-ui/core";          // root barrel
import { Button } from "@kamod-ui/core/button";    // per-component subpath
```

The package is published with a minimal `sideEffects` list (progress indeterminate keyframes and CSS only), so modern bundlers tree-shake the root barrel reliably.

### Customize The Theme

Override the semantic tokens after importing the default theme:

```css
@import "tailwindcss";
@import "@kamod-ui/core/theme.css";

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

If you want full control instead of the default theme, define the Tailwind mapping and token blocks yourself:

```css
@import "tailwindcss";
@source "../node_modules/@kamod-ui/core/dist/**/*.{js,mjs}";

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

:root {
  --background: var(--color-white);
  --foreground: var(--color-neutral-950);
  --card: var(--color-white);
  --card-foreground: var(--color-neutral-950);
  --popover: var(--color-white);
  --popover-foreground: var(--color-neutral-950);
  --primary: var(--color-neutral-950);
  --primary-foreground: var(--color-neutral-50);
  --secondary: var(--color-neutral-100);
  --secondary-foreground: var(--color-neutral-950);
  --muted: var(--color-neutral-100);
  --muted-foreground: var(--color-neutral-600);
  --accent: var(--color-neutral-100);
  --accent-foreground: var(--color-neutral-900);
  --destructive: var(--color-red-700);
  --destructive-foreground: var(--color-neutral-50);
  --border: var(--color-neutral-200);
  --input: var(--color-neutral-200);
  --ring: var(--color-neutral-400);
  --outline: var(--color-neutral-400);
  --radius: 0.625rem;
}

.dark {
  --background: var(--color-neutral-950);
  --foreground: var(--color-neutral-50);
  --card: var(--color-neutral-900);
  --card-foreground: var(--color-neutral-50);
  --popover: var(--color-neutral-800);
  --popover-foreground: var(--color-neutral-50);
  --primary: var(--color-neutral-50);
  --primary-foreground: var(--color-neutral-950);
  --secondary: var(--color-neutral-800);
  --secondary-foreground: var(--color-neutral-50);
  --muted: var(--color-neutral-800);
  --muted-foreground: var(--color-neutral-400);
  --accent: var(--color-neutral-800);
  --accent-foreground: var(--color-neutral-50);
  --destructive: var(--color-red-800);
  --destructive-foreground: var(--color-neutral-50);
  --border: --alpha(var(--color-neutral-50) / 10%);
  --input: --alpha(var(--color-neutral-50) / 15%);
  --ring: var(--color-neutral-500);
  --outline: var(--color-neutral-500);
}
```

The demo app keeps its extended token setup in `apps/demo/src/styles/foundation.css` and theme presets in `apps/demo/src/styles/themes.css`.

## Publishing `@kamod-ui/core`

For maintainers publishing the library to npm from the monorepo root.

Only **`packages/core`** (`@kamod-ui/core`) is published. The root workspace is `"private": true` so `npm publish` from the repo root cannot accidentally republish the unscoped `kamod-ui` name. Publishing requires the npm organization **`kamod-ui`** (scope `@kamod-ui`); the GitHub/npm org **`kamod-ch`** is separate and can host other packages (e.g. `@kamod-ch/...`).

1. Bump the version in `packages/core/package.json` (and update `CHANGELOG.md` if you keep one).
2. Authenticate with npm once per machine (or set `NODE_AUTH_TOKEN` for CI-style auth):

```bash
npm login
# or: export NODE_AUTH_TOKEN=<your-npm-token>
```

3. Run the release script:

```bash
pnpm release
```

`pnpm release` runs, in order: `pnpm install` → full pre-publish checks (`test:ci`, `build`, `qa:publint`, `qa:attw`) → npm auth check → `pnpm publish` for `@kamod-ui/core` with `--access public --no-git-checks`. Supply-chain provenance (`--provenance`) is enabled only in [`.github/workflows/publish.yml`](.github/workflows/publish.yml) on tag pushes (requires GitHub Actions OIDC); local `pnpm release` does not pass `--provenance` because npm cannot detect a CI provider on your machine.

For a faster local run that skips tests and the full monorepo build (only builds core and runs publint/attw):

```bash
pnpm release:quick
```

You can also run individual steps:

| Script | What it does |
| --- | --- |
| `release:check` | `test:ci` + `build` + `qa:publint` + `qa:attw` |
| `release:check:package` | `qa:package` (core build + publint + attw) |
| `release:auth` | Verifies `npm whoami` against the npm registry |
| `release:publish` | Publishes `@kamod-ui/core` to npm |

Tagged pushes (`v*`) also trigger [`.github/workflows/publish.yml`](.github/workflows/publish.yml) on GitHub Actions.

## Contributing

- Open issues for bugs and ideas.
- Suggest new components or patterns.
- Improve docs and examples.

## Support

If you find Kamod UI useful:

- **[Star the repository on GitHub](https://github.com/kamod-ch/kamod-ui)** — a quick way to support the project; stars improve visibility in search and community lists.
- Share the project with others who use Preact or Tailwind.
- Watch the repo for release notifications (optional).
