# Block Preview Images: Generation and Maintenance Guide

Block overview cards use small **generated screenshots** so visitors can compare
layouts without loading every interactive demo. The actual blocks remain
interactive on their detail and standalone preview pages.

This guide explains the complete image workflow: what runs automatically, how to
regenerate images yourself, what to commit, and how to diagnose common problems.
All commands below run **from the repository root** using its pinned pnpm version.

## Contents

- [1. How the pieces fit together](#1-how-the-pieces-fit-together)
- [2. What happens automatically](#2-what-happens-automatically)
- [3. When to regenerate](#3-when-to-regenerate)
- [4. First-time setup](#4-first-time-setup)
- [5. Generate images manually](#5-generate-images-manually)
- [6. Review, validate and commit](#6-review-validate-and-commit)
- [7. What the generator does internally](#7-what-the-generator-does-internally)
- [8. How cards display the images](#8-how-cards-display-the-images)
- [9. Add or remove a block](#9-add-or-remove-a-block)
- [10. Troubleshooting](#10-troubleshooting)
- [11. Future CI regeneration](#11-future-ci-regeneration)
- [12. Source map](#12-source-map)

## 1. How the pieces fit together

The generator captures the **real standalone preview routes in a local production
build**. It does not maintain a second set of mockups and does not screenshot the
public website, your running development server, or the detail page's controls.

```text
Block source + registry + docs routes
                  ↓
         Build the documentation
                  ↓
 Discover visible categories and variant links
                  ↓
 Capture each /preview/ route in light and dark
                  ↓
      WebP images + JSON manifest
                  ↓
      Rebuild docs → review → commit
                  ↓
      Normal deployment ships the images
```

The generated files live in two places:

| Output                                                                                                      | Purpose                                                                   |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [`packages/docs/public/block-previews/`](../public/block-previews/)                                         | Optimized WebP files copied into the published site.                      |
| [`packages/docs/src/blocks/generated/block-thumbnails.json`](../src/blocks/generated/block-thumbnails.json) | Maps each `category/variant` to its light/dark image URLs and dimensions. |

**Commit the images and manifest together.** The manifest is an index, not the
image itself; either half alone can leave a card without a working preview.

## 2. What happens automatically

There are two different kinds of automation here: the generator's work and the
repository workflows that decide when to run it.

| Action                                     | Current behavior                                                                                                                                                                                                          |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Run `blocks:thumbnails`                    | Automatically starts a temporary local server, discovers visible variants, captures both schemes, encodes images, updates the manifest and prunes obsolete generated assets.                                              |
| Edit a block or start the docs dev server  | Does **not** regenerate screenshots.                                                                                                                                                                                      |
| Run `build`, `build:docs` or `build:pages` | Builds the site using the already committed images; does **not** run the generator.                                                                                                                                       |
| Open/update a PR                           | [CI](../../../.github/workflows/ci.yml) runs tests and builds. Its docs unit tests check manifest coverage and asset integrity, but do **not** capture new images or compare screenshots with the latest block rendering. |
| Deploy documentation                       | [The Pages workflow](../../../.github/workflows/deploy.yml) builds and publishes the existing images. It does **not** regenerate or commit them.                                                                          |

**The trigger is currently manual; the capture process is automated.** Changing a
block's appearance can therefore leave its screenshot outdated until someone
regenerates and commits it. Passing CI does not prove that existing screenshots
match the latest visual design.

This separation keeps normal builds free of screenshot-browser requirements and
makes image changes reviewable in the same PR as their source changes.

## 3. When to regenerate

| Change                                                                | Recommended action                                                                   |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| One variant's layout, content or assets                               | Regenerate that variant with `--block`.                                              |
| A shared component used by several variants                           | Regenerate all affected variants; a full run is simplest when the impact is broad.   |
| Theme tokens, shared fonts or common preview styling                  | Regenerate the full set.                                                             |
| Add a variant                                                         | Register/build it, then generate its images; a full run also checks discovery.       |
| Remove a variant or hide a category                                   | Run the full generator to remove obsolete manifest entries and assets.               |
| Change only the overview card's border, hover effect, badges or text  | No regeneration needed: those elements surround the screenshot.                      |
| Change only detail-page documentation or controls outside `/preview/` | Usually no regeneration needed. Check whether the standalone preview itself changed. |

An image with empty space inside a centered login layout may be correct: it shows
the actual preview page. Inspect the standalone route before treating that space
as a capture defect.

## 4. First-time setup

Install the repository dependencies using its lockfile, then install Chromium for
the repository's Playwright version:

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm --filter @kamod-ch/ui-docs exec playwright install chromium
```

Repeat the browser installation after a Playwright upgrade if its expected
browser binary changes. On a Linux machine missing browser system libraries, use:

```sh
corepack pnpm --filter @kamod-ch/ui-docs exec playwright install --with-deps chromium
```

Use the package manager version in the root `package.json`. If your shell already
provides that exact pnpm version, `pnpm` and `corepack pnpm` are interchangeable
in these examples.

## 5. Generate images manually

### Generate every visible variant

This root-base example explicitly uses `/` so the build and generator agree:

```sh
# 1. Build current shared packages and documentation.
VITE_BASE_PATH=/ corepack pnpm build:docs

# 2. Capture all visible variants in both schemes and sizes.
corepack pnpm --filter @kamod-ch/ui-docs blocks:thumbnails

# 3. Include the new images and manifest in the deployable site.
VITE_BASE_PATH=/ corepack pnpm --filter @kamod-ch/ui-docs build
```

**Keep that order.** The first build supplies the pages being photographed; the
second includes the newly generated photographs in the site. Generation reads
`packages/docs/dist`, so unbuilt source edits are not reflected in screenshots.

The generator starts and stops its own Vite preview server on a free local port.
You do not need to start another server. Avoid rebuilding `dist` or running a
second generator while capture is in progress.

### Update only one variant

Build first, then select the exact **category/route ID**:

```sh
VITE_BASE_PATH=/ corepack pnpm build:docs
corepack pnpm --filter @kamod-ch/ui-docs blocks:thumbnails --block sidebar/sidebar-01
VITE_BASE_PATH=/ corepack pnpm --filter @kamod-ch/ui-docs build
```

For Application Shell 1, the key is:

```sh
corepack pnpm --filter @kamod-ch/ui-docs blocks:thumbnails \
  --block application-shell/application-shell-1
```

Its displayed component name is `application-shell-01`, but its route/source ID
is **`application-shell-1`**. Use the route ID after the category, not the card's
display label.

A selected run still discovers the visible categories first, then captures only
the matching variant. It updates that entry in the existing manifest and keeps
other entries. It does **not** build the source for you or detect which variants
have changed. There is currently no scheme-only, size-only, or multi-value
`--block` option; repeat the command or use a full run.

### Generate from a GitHub Pages-style build

The generator's `--base` must match the base used for the production build:

```sh
VITE_BASE_PATH=/kamod-ui/ corepack pnpm build:docs

corepack pnpm --filter @kamod-ch/ui-docs blocks:thumbnails \
  --base /kamod-ui/

VITE_BASE_PATH=/kamod-ui/ corepack pnpm --filter @kamod-ch/ui-docs build
```

You can combine the two options:

```sh
corepack pnpm --filter @kamod-ch/ui-docs blocks:thumbnails \
  --base /kamod-ui/ --block sidebar/sidebar-01
```

The generated manifest URLs remain `/block-previews/...`. The card component adds
the site's deployment base when displaying them; do not manually insert
`/kamod-ui/` into the manifest.

### Read the result

The console reports each captured key and then the generated file count and size:

```text
Captured sidebar/sidebar-01
Generated 4 WebP assets (... KiB). Rebuild docs to publish the updated images.
```

Each variant produces **four files**: two image widths × two color schemes. The
current 27-variant catalog therefore has 108 assets. Counts will change as the
visible catalog grows.

## 6. Review, validate and commit

### Review the output

1. Open the changed light and dark WebP files. Check that the intended UI is
   visible, fonts and images have loaded, and no loader or error page was captured.
2. Rebuild the docs, then inspect the affected overview cards at narrow and wide
   widths. Confirm both color schemes and the detail-page link work.
3. Inspect the Git diff. Changed screenshots normally produce new hashed filenames,
   manifest changes, and deletion of the replaced image files.

```sh
git status --short -- packages/docs/public/block-previews \
  packages/docs/src/blocks/generated/block-thumbnails.json

git diff -- packages/docs/src/blocks/generated/block-thumbnails.json
```

A successful run can produce **no Git diff** when the final image bytes are
unchanged. That is expected, not evidence that the command failed.

### Run the existing checks

The focused unit tests verify the generated artifact contract:

```sh
corepack pnpm --filter @kamod-ch/ui-docs exec vitest run \
  src/blocks/block-thumbnails.test.ts
```

They check catalog coverage, both schemes and widths, file existence, WebP
signatures, the expected aspect ratio, and a **100 KiB per-file limit**. The
encoder does not enforce that size limit itself; the tests catch oversized files.

The overview browser suite checks loading, responsive layout, theme selection,
keyboard navigation and fallbacks:

```sh
corepack pnpm --filter @kamod-ch/ui-docs exec playwright test \
  e2e/block-overviews.spec.ts --project=chromium
```

The checked-in Playwright configuration starts or reuses a local **development**
server on port 4173. It is separate from the generator's temporary production
server. Use the normal root-base development configuration for this command;
production-subpath checks need a matching server and test configuration.

These checks complement visual review; they do not compare the current block
rendering pixel-for-pixel with its saved thumbnail.

### Commit the matching assets

Stage the generated images and manifest explicitly, including deletions:

```sh
git add -A -- packages/docs/public/block-previews \
  packages/docs/src/blocks/generated/block-thumbnails.json

git diff --cached --stat
```

Commit them with the relevant source changes or in a clearly related follow-up:

```sh
git commit -m "docs(blocks): refresh sidebar previews after navigation changes"
```

Do not commit `dist`, temporary screenshots or browser reports. If a selected
run changes unrelated assets, inspect the manifest and environment before
including them.

## 7. What the generator does internally

### Discover the live catalog

[`generate-block-thumbnails.mjs`](generate-block-thumbnails.mjs) opens the built
`/blocks/sidebar/` page and reads the visible category links from the desktop
sidebar (`a.blocks-category-link`), excluding nested variant links. It visits each category and reads `a.blocks-overview-card` links, then
appends `/preview/` to each detail URL.

There is no separate list of screenshot targets. Hidden navigation categories and
planned links marked `data-block-placeholder` are excluded. These placeholder
links deliberately lead to unimplemented pages and have no screenshot targets. The sidebar navigation selector, card link class, route shape and
standalone preview pages are therefore part of the generator's discovery contract.
If those structures change, update discovery too. Preserve the placeholder filter
when changing the sidebar selector so a 404 page cannot interrupt generation.

### Use a repeatable capture environment

Each light/dark capture uses a fresh browser context with:

| Setting           | Value                                                              |
| ----------------- | ------------------------------------------------------------------ |
| Browser           | Chromium from the installed Playwright version                     |
| Viewport          | 1280 × 800 CSS pixels; device scale factor 1                       |
| Theme preset      | `kamod`                                                            |
| Color scheme      | Separate `light` and `dark` captures                               |
| Locale / timezone | `en-US` / `UTC`                                                    |
| Fixed date        | `2026-01-15T12:00:00Z`                                             |
| Motion            | Reduced motion, animations/transitions disabled, hidden text caret |

The script waits for network idle, the docs preloader to disappear, fonts to be
ready, and preview images to finish loading successfully. It rejects known
loading/error placeholders and checks that the requested dark/light class is
active. Browser exceptions and failed script, stylesheet or font requests are
recorded as capture errors; failed images prevent the readiness check from passing.

It captures the **viewport**, not a full scrolling page. For `sidebar/sidebar-13`,
it first clicks **Open settings** and waits for the dialog so the actual sidebar
layout appears in the screenshot. Similar future variants may need a small,
explicit setup action here.

These controls reduce accidental differences. They do not guarantee identical
bytes across operating systems, browser versions, changed fonts, random demo data
or external assets. Compare results in the same environment when investigating
unexpected churn.

### Encode and name the files

The 1280 × 800 capture is resized by Chromium's canvas encoder into:

- **480 × 300 WebP** for smaller cards.
- **960 × 600 WebP** for larger cards and higher pixel densities.

Both retain the original **8:5** aspect ratio. WebP quality is `0.84`; there is no
additional image-processing dependency. Each PNG is decoded once, then both sizes
are encoded from that bitmap before it is released.

Filenames contain the category, route ID, scheme, width and the first ten hex
characters of a SHA-256 hash of the encoded bytes:

```text
sidebar--sidebar-01-light-480-<10-character-hash>.webp
```

Changed image bytes produce a new URL, avoiding reuse of a stale cached image.
Unchanged bytes keep the same name. Manifest entries record each asset's URL,
width and height, grouped by `category/variant` and then light/dark scheme.

### Publish only after capture succeeds

All requested captures and encodes finish before output publication starts.
If a capture fails, the script exits unsuccessfully without replacing the
manifest with an incomplete set of captured variants.

On success it writes image files, writes the sorted manifest, and then removes
unreferenced files that match **this generator's filename pattern**. Unrelated
files in the output directory are left alone.

A full run builds a fresh manifest; a selected run merges into the existing one.
This is why removing a block requires a **full run**. Publication is sequential
filesystem I/O, not an atomic transaction: an interruption or disk failure during
writing may still require a rerun and an integrity check.

## 8. How cards display the images

[`BlockThumbnail.tsx`](../src/blocks/BlockThumbnail.tsx) reads the manifest
and waits for the stored light/dark preference before assigning image URLs. This
avoids downloading the wrong scheme first when the saved setting differs from
the system preference.

- `srcSet` and `sizes` let the browser choose the image resolution.
- Overview cards and the random desktop header preview share the thumbnail renderer.
  The header chooses one current-category variant after hydration, keeps it when themes
  change, and uses lazy loading so its hidden mobile image does not load unnecessarily.
- The first three cards load eagerly; remaining cards use native lazy loading.
- A reserved frame and image dimensions keep the layout stable while loading.
- An unavailable or failed card image falls back to **Explore the live demo**; text
  and navigation remain usable. Without JavaScript, card links and metadata still work.
- Screenshots always show the **Kamod preset** in light/dark mode. Other selected
  presets style the surrounding page, not the captured pixels. Detail pages are
  the place to explore other themes and viewport sizes interactively.

The card frame is **16:9**, while saved images are **8:5**. `object-fit: cover` with
top alignment slightly crops the image vertically to fill the frame without
stretching or letterboxing. The inset spacing and card hover lift belong to the card's
CSS, not the generated image. A CSS-only change to those effects needs no capture.

## 9. Add or remove a block

For a new variant:

1. Add its block implementation, registry metadata, detail route and standalone
   preview route using the category's existing conventions.
2. Confirm it appears as a card in a visible category. For a new category, also
   update the category metadata and navigation; merely adding a source folder is
   not enough for discovery. If it was a planned category, remove its entry from
   `PLACEHOLDER_BLOCK_CATEGORIES` and register it as an implemented category.
3. Build the documentation and generate the new key, or run the full generator.
4. Rebuild, review both schemes, run the integrity/browser checks, and commit
   the source, routes, images and manifest together.

For a removed variant or hidden category, update the registry/navigation first,
rebuild, and run the **full** generator. Check that old entries and their generated
files disappear. Keep the visible catalog, category metadata and integrity-test
expectations aligned when changing category visibility.

## 10. Troubleshooting

| Symptom                                                         | Likely cause and next step                                                                                                                                                   |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Missing `dist/blocks/sidebar/index.html`                        | No usable production build. Run `build:docs` first.                                                                                                                          |
| Routes/assets fail or the homepage appears instead of a preview | Build/generator base mismatch or missing routes. Rebuild with the intended base and pass the same `--base`. The generator uses trailing slashes for static directory routes. |
| Chromium executable missing                                     | Run the Playwright Chromium installation command using this checkout's dependencies.                                                                                         |
| `No visible block categories found` / `No overview cards found` | Stale build or changed navigation/card markup. Confirm visible links and inspect the discovery selectors.                                                                    |
| `No matching blocks`                                            | Incorrect `category/route-id`, a hidden category, or an unbuilt new variant. Check the detail URL and rebuild.                                                               |
| Timeout during image readiness                                  | A preview image, font, request or hydration step may be stuck. Inspect the built standalone route and its browser console/network errors.                                    |
| `Incorrect theme`                                               | Theme initialization or stored-setting behavior changed. Inspect the capture's preset/scheme setup before accepting images.                                                  |
| Screenshot is unchanged after editing source                    | Generation read an old `dist`, or the edit does not affect the standalone preview. Build first and inspect that route.                                                       |
| New images exist but the published page still looks old         | Rebuild docs after generation and ensure both images and manifest were committed and deployed.                                                                               |
| Many unexpected hashed filenames change                         | Compare browser versions, fonts, theme changes and external/random content. Review the actual images before assuming the changes are harmless.                               |
| Integrity test finds an extra/missing variant                   | Align registry/navigation/category metadata, then rebuild and regenerate. Use a full run after removals.                                                                     |
| A selected run fails reading the manifest                       | It requires an existing manifest to preserve other entries. Use a full run to recreate it.                                                                                   |

After a failed run, inspect `git status` before committing. Fix the cause, rerun
the requested capture, and run the integrity tests. Do not hand-edit a manifest
entry to point at another variant's screenshot just to make a check pass.

## 11. Future CI regeneration

There is **no regeneration workflow currently enabled**. If one is added, keep
it separate from ordinary docs builds and use the same sequence:

```text
Install locked dependencies → install Chromium → build docs
→ generate images → run integrity checks → review/upload the diff
```

A manually dispatched job that uploads the generated files or opens a reviewable
update PR would keep maintainers in control of visual changes. Pin the capture
environment, match the deployment base and avoid concurrent generation into the
same output. Any credentials, write permissions, PR creation or scheduled trigger
would need to be explicitly configured; none is provided by the generator itself.

## 12. Source map

| File                                                                                                  | Responsibility                                                   |
| ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [`generate-block-thumbnails.mjs`](generate-block-thumbnails.mjs)                                      | Discovery, capture state, encoding, publication and cleanup.     |
| [`package.json`](../package.json)                                                                     | `blocks:thumbnails` command.                                     |
| [`block-nav-config.ts`](../src/blocks/block-nav-config.ts)                                            | Visible/hidden categories and navigation links.                  |
| [`block-categories.ts`](../src/blocks/block-categories.ts)                                            | Category metadata and registered overview variants.              |
| [`BlockThumbnail.tsx`](../src/blocks/BlockThumbnail.tsx)                                              | Shared theme-aware image loading and fallback.                   |
| [`BlockOverviewCard.tsx`](../src/blocks/BlockOverviewCard.tsx)                                        | Overview card navigation and metadata.                           |
| [`block-overviews.css`](../src/styles/block-overviews.css)                                            | Preview frame, crop, spacing and hover effects.                  |
| [`block-thumbnails.test.ts`](../src/blocks/block-thumbnails.test.ts)                                  | Catalog and generated-file integrity checks.                     |
| [`block-overviews.spec.ts`](../e2e/block-overviews.spec.ts)                                           | Browser coverage for overview behavior and accessibility.        |
| [`playwright.config.ts`](../playwright.config.ts)                                                     | Default browser test server and projects.                        |
| [`ci.yml`](../../../.github/workflows/ci.yml) / [`deploy.yml`](../../../.github/workflows/deploy.yml) | Existing validation and publication; no screenshot regeneration. |
