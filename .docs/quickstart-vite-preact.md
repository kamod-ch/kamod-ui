# Kamod UI quickstart draft

## Summary

Kamod UI is a small, Preact-first component library for Vite apps. The fastest path is to install the package, import the theme CSS once, and render a first component like `Button`.

## Affected repositories

- `kamod-ui`
- published package: `@kamod-ch/ui`

## Current problems

- New users may miss the required `@preact/signals` peer dependency.
- Tailwind v4 setup is easy to wire incorrectly if the CSS import order is wrong.
- The README needs a short, copyable starter for fresh Vite + Preact apps.

## Installation

```bash
pnpm create vite@latest my-app -- --template preact-ts
cd my-app
pnpm add @kamod-ch/ui @preact/signals
pnpm add -D tailwindcss @tailwindcss/vite
```

Enable the Tailwind v4 plugin in `vite.config.ts`.

## Import example

```css
@import "tailwindcss";
@import "@kamod-ch/ui/theme.css";
```

## First component usage

```tsx
import { Button } from "@kamod-ch/ui";

export function App() {
  return <Button>Click me</Button>;
}
```

## Styling notes

- Keep `@import "tailwindcss";` before `@import "@kamod-ch/ui/theme.css";`.
- Put theme overrides after `theme.css`.
- Install `@preact/signals` even if you only use presentational components.

## Risks

- Tailwind v3 users may copy the snippet and get broken styles.
- Omitting `@preact/signals` can create runtime duplication later.
- If the app does not use Vite, the plugin-specific guidance should be adjusted.

## How to test or verify

- Run `pnpm docs:readme:check`.
- Create a fresh Vite Preact app and confirm the `Button` renders with styles.
- Confirm the CSS order is `tailwindcss` first, `@kamod-ch/ui/theme.css` second.

## Next suggested tasks

- Promote this draft into a short public quickstart section if needed.
- Add one troubleshooting example for missing styles.
- Keep the README example minimal and copy/paste friendly.
