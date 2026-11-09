---
title: Growth analytics — weekly review
description: How to read Kamod UI docs funnel events without treating GitHub CTA clicks as new stars.
---

# Growth analytics — weekly review

This page documents **Prompt 6** events emitted from the docs app. They use the same Matomo host as the existing page-view pixel (`matomo.kamod.ch`, site `3`) when `VITE_GROWTH_ANALYTICS=matomo` or in production builds (unless `VITE_GROWTH_ANALYTICS=noop`).

## Event names and triggers

| Event | When it fires | Does **not** mean |
| --- | --- | --- |
| `demo_open` | SaaS team demo app mounted after navigation (once per session per demo) | User stayed on the demo or shipped code |
| `code_copy_success` | Clipboard write succeeded on a docs code block | User pasted or ran the snippet elsewhere |
| `template_download_click` | User started the starter ZIP download (fetch handoff) | File finished downloading to disk |
| `template_download_prepared` | Blob URL created and browser download triggered | Confirmed write to disk |
| `github_star_cta_click` | User clicked **Star on GitHub** on the star-invitation toast | A new GitHub star (no per-user attribution) |

Allowed metadata: `location` (`header`, `landing`, `post_copy`, `post_download`), `example_id`, `template_id`, `display_mode`. No copied code, form data, search text, or full URLs with arbitrary query strings.

## Weekly checklist (English labels for Matomo)

1. **Visits** — Matomo standard visit report (existing image tracker).
2. **Demo usage** — Events `demo_open` (filter `e_a=demo_open`), segment by `dimension1` location.
3. **Successful copies** — `code_copy_success`; use `dimension2` for example paths.
4. **Template requests** — `template_download_click` vs `template_download_prepared` (drop-off between click and prepared).
5. **GitHub invitation clicks** — `github_star_cta_click` by `dimension1` (`post_copy` vs `post_download`).
6. **GitHub stars (repository)** — Compare public star count week over week in GitHub **separately**. **Do not** equate invitation CTA clicks with new stars; clicks are not attributable to individual visitors and do not prove starring.

## Local / CI

- Default in dev and Vitest: **no-op** adapter (events are deduped but not sent).
- Force Matomo in dev: `VITE_GROWTH_ANALYTICS=matomo pnpm dev`
- Disable in production build: `VITE_GROWTH_ANALYTICS=noop`
