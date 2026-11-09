# Kamod UI — SaaS team demo starter

This archive contains a minimal Vite + Preact app that runs the same team-management demo as the docs site (`/demo/saas-team`).

## Prerequisites

- Node.js 20+
- pnpm 9+ (or npm)

## Quick start

```bash
cd saas-team-demo
pnpm install
pnpm dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Packages

The demo uses published Kamod packages:

- `@kamod-ch/ui` — components and shell primitives
- `@kamod-ch/blocks` — `ApplicationShell1`
- `@kamod-ch/icons` — navigation icons
- `@kamod-ch/themes` — optional preset CSS

When working inside the `kamod-ui` monorepo, replace version ranges with `workspace:*` and run `pnpm install` from the repository root.

## Source layout

- `src/App.tsx` — mounts the demo page
- `src/demo/saas-team/` — copied from `packages/docs/src/demo/saas-team` in the main repository

## CSS

Import your theme stylesheet in `src/main.tsx` (see `main.tsx` for the default `@kamod-ch/themes` import). Tailwind v4 is configured via `@tailwindcss/vite`.

## License

Same license as [kamod-ui](https://github.com/kamod-ch/kamod-ui).
