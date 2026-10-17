# feat(docs): add visual previews to block overview cards

> **Issue:** [#56](https://github.com/kamod-ch/kamod-ui/issues/56) · **Local status:** implemented and verified; changes are not yet committed.
>
> The remote issue title refers to _live previews_. This local proposal records the
> agreed screenshot approach; it does not update the issue on GitHub.

## Initial problem

Text-only cards require visitors to open each detail page just to see the block's
layout. Live rendering inside every card would improve comparison but also mount
many independent demos: **Sidebar alone contains 16 variants**, including menus,
dialogs, state and layout behavior that a browsing card does not need.

## Chosen approach

**Generate screenshots from the real blocks; keep live interaction on detail pages.**

This gives visitors an accurate visual overview while avoiding demo components and
preview iframes in the card grid. It trades automatic visual freshness for a small,
explicit regeneration step when block designs change.

| Overview card                                                  | Detail page                                                    |
| -------------------------------------------------------------- | -------------------------------------------------------------- |
| Optimized screenshot, title, description, tags and import path | Interactive block, responsive preview controls and source code |
| One accessible link                                            | Existing full demo interactions                                |
| Light/dark images using the standard Kamod preset              | Live exploration of the available theme presets                |

## Proposed experience

- Refine the category header with breadcrumbs, a variant-count badge and a short
  browsing hint. Keep the existing category sidebar and titles.
- Use a consistent **8:5 image frame**, clear title/description, up to three useful
  feature tags and a footer showing the import path and “View block”.
- Make the whole card one link, with visible keyboard focus and subtle themed
  hover styling. Reuse core **Card, Badge and Breadcrumb** components.
- Adapt the grid to usable content width: one column, two at **580px**, three at
  **1120px**. Expand only category-page layouts to **1680px** on wide screens.
- Keep card text and links usable when an image fails or JavaScript is unavailable.

## Implementation plan

### 1. Capture the existing demos

Add a local Playwright/Chromium generator that discovers visible categories and
variants from a production build, then visits their existing standalone preview
routes. There is no second manually maintained block list.

Capture at **1280 × 800**, in light and dark mode, with the Kamod preset, fixed date,
English/UTC and fresh storage. Wait for hydration, fonts and images; disable motion.
Open Sidebar 13's settings dialog so its sidebar is visible in the capture.

### 2. Publish small, versioned assets

Produce **480 × 300** and **960 × 600** WebP images per theme. Store content-hashed
assets in `packages/docs/public/block-previews/` and dimensions/URLs in
`src/blocks/generated/block-thumbnails.json`.

Only publish after every requested capture succeeds. Prune obsolete generated
filenames while retaining unrelated files. Support `--block category/id` for a
single variant; normal documentation builds use the checked-in assets.

### 3. Render a shared, lightweight card

`BlockOverviewCard.tsx` selects the active light/dark set after the saved theme is
available. It reserves image space and supplies `srcSet`, `sizes` and asynchronous
decoding. **The first three cards load eagerly; the rest use native lazy loading.**

```tsx
<img
  width={largest.width}
  height={largest.height}
  alt=""
  loading={eager ? "eager" : "lazy"}
  decoding="async"
  // src/srcSet use the selected theme and deployment base path.
/>
```

The image is decorative: the enclosing link is named by the block heading and
description. An image failure keeps the same frame and offers “Explore the live
demo”. Without JavaScript, visitors see the fallback and usable text links.

### 4. Document maintenance and verify

```sh
pnpm build:docs
pnpm --filter @kamod-ch/ui-docs blocks:thumbnails
pnpm --filter @kamod-ch/ui-docs build
```

For subpath builds, pass `--base /kamod-ui/`. Install Chromium once and regenerate
images after visual changes; the [generator guide](packages/docs/scripts/README.md)
contains the complete workflow. CI regeneration is future work, not a requirement
of ordinary builds.

## Acceptance and current results

- [x] All **27 variants** have both sizes in both themes: **108 WebP assets**, about **677 KiB total**.
- [x] A complete second generation reproduced the same asset bytes and manifest.
- [x] Overviews mount no live demos or preview iframes and request no demo/source chunks.
- [x] Saved-theme selection avoids downloading the opposite image set on initial load.
- [x] Keyboard, mobile/wide layouts, image failure, no-JavaScript and subpath links are covered.
- [x] Docs build/typecheck, scoped lint/Biome, formatting, **40 docs unit tests** and **64 Chromium checks** pass.

Accessible names were also added to the shared theme toggle and footer brand link.
Automated accessibility checks exclude only the official logo's wordmark contrast
under the logo exemption. **WebKit remains unverified**: the installed browser/driver
fails before page creation with `Unknown setting: PushAPIEnabled`.

## Boundaries and references

Depends on [#51's shared pages](BLOCKS-DOCUMENTATION-ISSUE.md). No new dependencies,
image service, theme-per-preset image matrix, search/sort controls or root `/blocks`
route are introduced. The “Blocks” breadcrumb uses the existing `/blocks/sidebar`
entry page.

See the [implementation record](.docs/BLOCK-OVERVIEWS-IMPLEMENTATION.md) for execution,
source references and validation details, and the [combined PR body (archived)](.docs/archive/previous-pr-notes-2026-10-04.tar.gz)
for the complete change description.

## Screenshots

**Before:** <!-- Add screenshot of the text-only category cards. -->

**After:** <!-- Add screenshot of the desktop overview with thumbnails. -->

**Responsive / dark:** <!-- Add mobile and dark-mode examples. -->
