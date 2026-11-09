# Kamod UI — shareable launch note (local)

Use this as a factual English intro when sharing the docs site or repository. Verify links after deploy (GitHub Pages base path vs `ui.kamod.ch`).

## One-liner

Kamod UI is a **Preact 11** component library for **Tailwind CSS v4** with live docs, copy-ready package snippets, and a **SaaS team demo** you can run locally or download as a starter ZIP.

## Three features you can verify

1. **Live SaaS team demo** — [ui.kamod.ch/demo/saas-team](https://ui.kamod.ch/demo/saas-team): Application Shell 1, overview metrics, team search/filter/sort, invite dialog, reset to seed data (no backend).
2. **Package-ready docs snippets** — Component example **Code** tabs copy `@kamod-ch/ui/*` imports; smoke-tested consumer path via `pnpm smoke:consumer` in the monorepo.
3. **Starter template** — Home page **Use this template** downloads `saas-team-demo.zip` (also built under `packages/docs/public/starters/` during `pnpm dev` / `pnpm build`).

## Direct demo link

https://ui.kamod.ch/demo/saas-team

## Manual path checklist (local QA)

1. **Landing** — `/` shows Explore demo, Use this template, and Star on GitHub in the top bar (desktop).
2. **Demo** — `/demo/saas-team` loads overview; `#team` search/invite works; `#settings` reset works.
3. **Code / starter** — Copy a component example; download starter ZIP from home (button, not raw `<a download>`).
4. **GitHub** — Star invitation appears after successful copy or template delivery (rate-limited); header **Star on GitHub** opens the repo.

Refresh social images after UI changes:

```bash
cd packages/docs
node ./scripts/capture-growth-screenshots.mjs
```
