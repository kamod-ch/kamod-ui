# Block overview thumbnails

Overview cards use generated screenshots. Interactive demos remain on the detail
pages. The source of truth is the **visible category navigation and its registry
cards**, discovered from a local production build; no second block list is needed.

## Regenerate

From the repository root, after installing dependencies:

```sh
# Once per machine (or after a Playwright upgrade):
pnpm --filter @kamod-ch/ui-docs exec playwright install chromium

# Build current block implementations, shared UI, styles and preview routes:
pnpm build:docs

# Generate every visible block in light and dark mode:
pnpm --filter @kamod-ch/ui-docs blocks:thumbnails

# Rebuild to include the new images in the deployable site:
pnpm --filter @kamod-ch/ui-docs build
```

The generator starts and stops its own local Vite preview server. It never uses
the public site or your development server. Do not run it against an outdated
build, or rebuild `dist` while generation is running.

For a build made with `VITE_BASE_PATH=/kamod-ui/`, pass `--base /kamod-ui/` to the
thumbnail command. To update one variant:

```sh
pnpm --filter @kamod-ch/ui-docs blocks:thumbnails --block sidebar/sidebar-01
# Add --base /kamod-ui/ if that is the base used to build dist.
```

Commit the generated `public/block-previews/*.webp` files and
`src/blocks/generated/block-thumbnails.json` together. Normal builds only copy
these assets; they do not need Chromium. Regenerate all thumbnails after shared
component, theme, font or layout changes; regenerate the affected variant after a
block-specific change. Review the resulting images before committing.

## Capture contract

- Chromium, 1280 × 800 viewport, Kamod preset in both light and dark mode.
- English/UTC, fixed date, fresh storage per capture, reduced motion, no animation.
- Wait for hydration, fonts and images. Route/asset failures and browser exceptions
  stop generation. The manifest is only replaced after every requested capture succeeds.
- Sidebar 13 is captured with its settings dialog open so the actual layout is visible.
  Add similarly small, explicit setup steps if future variants require an initial action.
- Produce 480 × 300 and 960 × 600 WebP images using Chromium's encoder. The manifest
  records dimensions and content-hashed URLs; obsolete generated images are pruned.
- Cards load only the active light/dark set after the stored theme is available.
  The first three cards load eagerly; remaining images use native lazy loading.
  Explicit dimensions reserve space. If an image is missing (or JavaScript is
  unavailable), card text and the detail link remain usable.
- Thumbnails show the standard Kamod preset, even if another color preset is selected.
  The surrounding cards follow the selected theme; full theme exploration is on the
  detail page. This avoids maintaining an image set for every theme permutation.

CI screenshot regeneration can be added later; it is intentionally separate from
normal builds to avoid browser requirements and unreviewed asset changes on every build.
