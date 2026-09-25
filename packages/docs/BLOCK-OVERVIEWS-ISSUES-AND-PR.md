# Block overviews: issues #51 and #56 and combined PR scope

This document brings the two issue proposals and complete PR description together.
It explains the original problems, the chosen implementation, related fixes and
verification. It covers the changes since base commit `99b8493` on
`feat/block-overviews-and-live-previews`.

**Recorded:** 24 September 2026. This branch includes the original implementation and the category navigation,
compact preview and variant-count refinements described below.
This is a record of the proposed contribution, not a claim that GitHub has merged
it or closed the issues. Screenshot cards are the agreed replacement for #56's
original request for live previews.

- [Issue 51: consistent overviews and detail pages](#issue-51-consistent-overviews-and-detail-pages)
- [Issue 56: visual preview cards](#issue-56-visual-preview-cards)
- [Combined PR scope](#pr-scope)
- [Implementation commits](#implementation-commits)

## Issue 51: consistent overviews and detail pages

> **Issue:** [#51](https://github.com/kamod-ch/kamod-ui/issues/51) · **Status:** implemented in this branch.

### Initial problem

Block categories use different browsing patterns. **Sidebar** and **Application
Shell** have overview cards leading to individual detail pages. **Login** and
**Signup** instead render every full demo and its source controls on one long page.

This makes navigation inconsistent, loads more demo code than browsing requires,
and duplicates the overview, preview controls and source-file layout across pages.

### Expected experience

**Category → overview cards → one block's detail page.**

Use this pattern for every visible category, even a category with only one block.
Each detail page keeps its live preview, source files, refresh/new-tab controls and
return link. Application Shell keeps its existing header and detailed guide.

```text
/blocks/login/                    Overview of five variants
/blocks/login/login-01/           One variant, with Preview and Code
/blocks/login/login-01/preview/   Existing standalone demo
```

### Implementation

#### Share the page structure

- `BlockCategoryPage` renders metadata-driven overviews for Sidebar, Application
  Shell, Login and Signup.
- `BlockDetailPage` provides the common site layout and category backlink, with an
  optional custom header.
- `BlockVariantDetail` combines the showcase and setup guide for Sidebar, Login
  and Signup. Category modules supply their registry entry and lazy source loader.
- `BlockShowcase` owns preview controls; `BlockShowcaseCode` retains selected-file
  and copy feedback across tab switches. `BlockSourceFiles` handles loading and retry.
- `BlockBreadcrumbs`, repository URL helpers and `DocsTopbarActions` share navigation
  and theme controls between overview and detail pages.
- Add **ten detail routes**: `login-01`–`login-05` and `signup-01`–`signup-05`.

#### Load only what the visitor needs

Separate component-free `metadata.ts` files from the four runtime registries.
Overviews import metadata; browser detail routes load their demo modules on demand;
source text loads when the Code tab is opened.

```tsx
// Define once per category module; the import runs only when a file is requested.
const loadSource: VariantSourceLoader<AuthBlockId> = async (id, file) =>
  (await import("./auth-source")).getAuthBlockSource(id, file);

<BlockVariantDetail category={category} block={block} loadSource={loadSource} />;
```

PreactPress needs synchronous server rendering. A small Vite plugin supplies eager
modules to the static renderer and lazy modules to the browser, preserving complete
HTML without pulling all demos into the overview's browser dependencies.

#### Preserve existing links

Category URLs and standalone preview routes stay valid. Registered legacy anchors
redirect to their new detail page, preserving the query string and deployment base:

```text
/blocks/login/?example=1#login-01
→ /blocks/login/login-01?example=1#login-01
```

Use `location.replace` so browser Back does not repeatedly revisit the redirect.
Unknown or malformed fragments stay on the overview. Without JavaScript, retained
card IDs still provide a useful destination for old anchors.

### Related fix

An inline Dropdown could read `trigger.ownerDocument` even when portal placement
was disabled, crashing a composite sidebar trigger. Move the disabled check ahead
of all DOM reads. A regression test reproduces the failure before the fix.

```ts
if (!enabled) return;
const content = contentRef.current;
const trigger = triggerRef.current;
const view = trigger?.ownerDocument.defaultView;
```

This is a small core fix required by the affected previews, not a dropdown redesign.

### Acceptance and verification

- [x] All four visible categories share the overview/detail flow.
- [x] Direct detail loads, standalone previews, source selection and return links work.
- [x] Old anchors preserve queries and work with the `/kamod-ui/` base path.
- [x] Overviews avoid demo/source imports; static detail HTML remains complete.
- [x] Source loading handles stale responses, failures and retries.
- [x] Relevant unit tests, Chromium checks, typechecks and builds pass.

The shared flow was checked on narrow and desktop layouts, in light/dark mode and
with keyboard navigation. See [PR verification](#7-tests-and-verification) for results and the pending
WebKit verification.

### Scope and related work

Preserve block APIs, form behavior, preview routes and existing hidden-category
visibility. This work follows the already merged Application Shell feature.

[#56](https://github.com/kamod-ch/kamod-ui/issues/56) adds generated visual previews
and card styling on top of this shared structure. General setup guides, search/sort controls and a full reusable documentation
template remain separate proposals.

### Screenshots

**Before — Login/Signup:** <!-- Add screenshot of the inline demo list. -->

**After — category:** <!-- Add screenshot of the shared overview. -->

**After — detail:** <!-- Add screenshot of a single variant and its controls. -->

---

## Issue 56: visual preview cards

> **Issue:** [#56](https://github.com/kamod-ch/kamod-ui/issues/56) · **Status:** implemented and verified in this branch.
>
> The remote issue title refers to _live previews_. This document records the
> agreed screenshot approach; the original GitHub title has not been changed.

### Initial problem

Text-only cards require visitors to open each detail page just to see the block's
layout. Live rendering inside every card would improve comparison but also mount
many independent demos: **Sidebar alone contains 16 variants**, including menus,
dialogs, state and layout behavior that a browsing card does not need.

### Chosen approach

**Generate screenshots from the real blocks; keep live interaction on detail pages.**

This gives visitors an accurate visual overview while avoiding demo components and
preview iframes in the card grid. It trades automatic visual freshness for a small,
explicit regeneration step when block designs change.

| Overview card                                                  | Detail page                                                    |
| -------------------------------------------------------------- | -------------------------------------------------------------- |
| Optimized screenshot, title, description, tags and import path | Interactive block, responsive preview controls and source code |
| One accessible link                                            | Existing full demo interactions                                |
| Light/dark images using the standard Kamod preset              | Live exploration of the available theme presets                |

### Proposed experience

- Refine the category header with breadcrumbs, a variant-count badge and a
  preview-theme note. Keep the existing category sidebar and titles.
- Use a compact **16:9 preview frame** filled with a top-aligned screenshot, readable
  display names plus code identifiers, detailed descriptions and tagged feature badges.
- Keep one main preview/detail link with separate footer links for GitHub source and
  setup instructions. Keep dependencies in the setup guide and preserve keyboard focus without
  nested controls. Reuse core **Card, Badge, Button and Breadcrumb** components.
- Adapt the grid to usable content width: one column, two at **640px**, three at
  **1120px**. Expand only category-page layouts to **1680px** on wide screens.
- Keep card text and links usable when an image fails or JavaScript is unavailable.

### Implementation plan

#### 1. Capture the existing demos

Add a local Playwright/Chromium generator that discovers visible categories and
variants from a production build, then visits their existing standalone preview
routes. There is no second manually maintained block list.

Capture at **1280 × 800**, in light and dark mode, with the Kamod preset, fixed date,
English/UTC and fresh storage. Wait for hydration, fonts and images; disable motion.
Open Sidebar 13's settings dialog so its sidebar is visible in the capture.

#### 2. Publish small, versioned assets

Produce **480 × 300** and **960 × 600** WebP images per theme. Store content-hashed
assets in `packages/docs/public/block-previews/` and dimensions/URLs in
`src/blocks/generated/block-thumbnails.json`.

Only publish after every requested capture succeeds. Prune obsolete generated
filenames while retaining unrelated files. Support `--block category/id` for a
single variant; normal documentation builds use the checked-in assets.

#### 3. Render a shared, lightweight card

`BlockThumbnail.tsx` selects the active light/dark set after the saved theme is
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

#### 4. Document maintenance and verify

```sh
pnpm build:docs
pnpm --filter @kamod-ch/ui-docs blocks:thumbnails
pnpm --filter @kamod-ch/ui-docs build
```

For subpath builds, pass `--base /kamod-ui/`. Install Chromium once and regenerate
images after visual changes; the [generator guide](scripts/README.md)
contains the complete workflow. CI regeneration is future work, not a requirement
of ordinary builds.

### Acceptance and current results

- [x] All **27 variants** have both sizes in both themes: **108 WebP assets**, about **677 KiB total**.
- [x] A complete second generation reproduced the same asset bytes and manifest.
- [x] Overviews mount no live demos or preview iframes and request no demo/source chunks.
- [x] Saved-theme selection avoids downloading the opposite image set on initial load.
- [x] Keyboard, mobile/wide layouts, image failure, no-JavaScript and subpath links are covered.
- [x] Docs build/typecheck, scoped lint/Biome, formatting, **42 docs unit tests** and **64 Chromium checks** are verified.

Accessible names were also added to the shared theme toggle and footer brand link.
Automated accessibility checks exclude only the official logo's wordmark contrast
under the logo exemption. **WebKit remains unverified**: the installed browser/driver
fails before page creation with `Unknown setting: PushAPIEnabled`.

### Boundaries and references

Depends on [#51's shared pages](#issue-51-consistent-overviews-and-detail-pages). No new dependencies,
image service, theme-per-preset image matrix or root `/blocks` route are introduced. The “Blocks” breadcrumb uses the existing `/blocks/sidebar`
entry page.

See the [PR scope below](#pr-scope) for the complete change description, source
inventory and verification details.

### Screenshots

**Before:** <!-- Add screenshot of the text-only category cards. -->

**After:** <!-- Add screenshot of the desktop overview with thumbnails. -->

**Responsive / dark:** <!-- Add mobile and dark-mode examples. -->

---

## PR scope

Consistent category pages, individual block documentation and screenshot cards
for Sidebar, Application Shell, Login and Signup.

**Intended PR closing references:** `Closes #51` and `Closes #56`.

### Why

Login and Signup previously stacked all their demos on one page, while Sidebar
and Application Shell used category cards and individual detail pages. The
implementations also repeated preview controls, file trees and page structure.

This change gives all four visible categories the same **overview → detail → live
preview/source** flow. Cards show generated screenshots so visitors can compare
layouts without mounting every demo—particularly the 16 Sidebar variants.

### 1. Consistent categories and individual block pages

- Introduce shared `BlockCategoryPage` and `BlockDetailPage` components.
- Add **ten detail pages** for `login-01`–`login-05` and `signup-01`–`signup-05`.
- Keep category navigation, standalone previews and existing Sidebar/Application
  Shell detail URLs. Even the single Application Shell variant uses an overview.
- Forward registered legacy category anchors to their new detail pages, preserving
  query strings and the deployment base. Use history replacement so Back does not
  loop; leave unknown or malformed fragments alone.

```text
/blocks/login/#login-01 → /blocks/login/login-01#login-01
```

Application Shell keeps its custom header and complete guide, API reference,
accessibility section, table of contents and footer. Its existing composition now
uses the shared page/showcase wrappers.

### 2. Visual overview cards and responsive layout

Add one shared `BlockOverviewCard`, using core **Card** and **Badge** components.
Each card pairs a readable display name with its code-styled component identifier,
a more detailed muted description and up to three feature badges with tag icons.
The preview and description form the main detail link. A separate footer lists
the block path and core icon-button
links to the exact GitHub source folder and the detail page’s **Add this block**
section. These are sibling links with accessible names, never nested controls.
Hover gently lifts the card while the preview retains its scale; the arrow fades
in and changes color.
Motion is limited to precise hover pointers and respects reduced-motion preferences.
Previews sit inside padded, rounded frames with a compact arrow inset at the
top-right, above the image. Centered title rows and softly tinted
badges lead into descriptions limited to two lines (three from 1260px). A subtle
divider separates the footer, with a subdued source path and compact actions
using subdued theme backgrounds and icon colors, with clearer hover/focus states. Card dependency lists are omitted;
setup guides retain the package requirements. Paths
truncate only their middle, preserving the scope and variant name, with a 12px
minimum action gap. The full path stays available to assistive technology and
in the hover title; centered 24px actions use 13px icons.

Sidebar, Login and Signup details gain a compact shared setup section so every
card’s setup link has a real destination. Application Shell retains its existing
guide. Setup links use native same-tab navigation to preserve cross-page fragment
scrolling; source links open a new tab. Setup instructions explain copying shared
files, installing missing dependencies and connecting application callbacks.

The category sidebar now shares the detail page contents navigation's quiet left
border, generous link spacing and a nearly full-height active marker. A **Categories** heading
shows the total block count, with registry-derived variant counts aligned beside
each category. Links use **0.85rem** text and an active marker inset **2px** at each end while retaining
34px compact link rows. They sit indented beneath the heading; the navigation itself
aligns left in wider desktop sidebar columns, leaving more room beside the cards.
Desktop and mobile use `BlockCategoryNavigation`; mobile links
retain the core Sheet dismissal behavior. Counts have accessible descriptions,
and active links expose `aria-current="page"`. Categories with variants gain a
separate core Collapsible toggle and an indented list of direct variant links.
Groups start collapsed and expand independently; category names still navigate to
their overview. Empty categories show no toggle or icon. Mobile toggles and variant
links have 44px targets; expanding keeps the sheet open, while selecting a link
closes it. No artificial subcategories are added.

Categories now starts level with the first card row; the introduction remains in
the content column. An optional `contentHeader` slot in the shared shell keeps
this alignment responsive without measured offsets and preserves one main landmark.
A compact random preview fills the space above Categories beside the header on desktop.
It links to one variant from the current group, selected after hydration and retained
across theme changes. It reuses the shared thumbnail renderer and stays hidden below
980px; its image loads lazily. A simple linked image fills nearly the entire width,
with a small, muted “From this collection” label above it and a fine image outline.
There is no outer card background, shadow or overlay control. The link retains an
accessible variant name and a visible keyboard focus outline. The
optional `sidebarHeader` slot preserves the grid alignment.
Categories sort by block count, highest first, with alphabetical ties in both desktop
and mobile navigation. Twenty alphabetically sorted planned categories link to unimplemented pages, each
with zero variants; the real total stays 27. Both desktop and mobile navigation
include them. The thumbnail generator reads only category links, skipping nested
variant links and the marked placeholders.

The category header adds core **Breadcrumb** navigation, a Preact/Kamod UI label,
more descriptive titles and practical introductions with highlighted inline API
names. A variant-count badge sits beside the heading and above it below 640px,
matching the detail header. The introduction aligns with the random preview at
the top; breadcrumbs sit below it in the row directly above the cards.
The screenshot-theme guidance is a second introduction paragraph with matching
typography and a small gap. It is no longer repeated below the cards. The Blocks breadcrumb uses the existing
`/blocks/sidebar` entry page.

- Fill the **16:9 preview frame** using `object-fit: cover` and top alignment.
  Existing 8:5 screenshots are slightly cropped instead of letterboxed or stretched;
  thumbnails remain unchanged. Keep titles, metadata and actions usable on narrow cards.
- Use one, two or three columns based on usable content width (**640px / 1120px**
  container breakpoints), accounting for the sidebar.
- Allow category layouts up to **1680px** wide on large screens.
- Share responsive heading typography with block detail pages and tighten mobile header spacing. Narrow cards
  use smaller insets while preserving both path ends and the gap before footer actions.
  The mobile category sheet keeps 44px tap targets; desktop links stay compact.
- Size thumbnail downloads for the capped desktop grid and the revised column transitions.
- Below **640px**, place category-page branding and theme/actions on separate rows
  to avoid overlap. These rules do not change detail-page headers or widths.
- Use current theme tokens for borders, colors, hover/focus and reduced-motion styling.

A compact **Showing N of N variants** count sits to the right of the breadcrumbs,
followed by a dot separator and two source/report-issue links with generous spacing.
The row aligns along the bottom edge and stacks on narrow screens, keeping the
count and actions together. Issue links prefill the category and source URL.
Cards remain in registry order. There is no search/sort
toolbar, patterned band or extra divider between the header and cards.

Overview styling moves into `block-overviews.css`, imported by the main stylesheet;
the superseded overview-grid rules are removed from `blocks.css`.

### 3. Screenshot generation and loading

**27 variants × 2 themes × 2 sizes = 108 WebP assets, approximately 677 KiB total.**

The new `blocks:thumbnails` command captures the existing standalone preview routes
from a local production build. It discovers blocks through visible category/card
links, avoiding a second manually maintained registry.

- Capture at **1280×800**, with fresh state, a fixed date, English/UTC and motion
  disabled. Wait for hydration, fonts and images; reject failed routes, required
  assets and browser exceptions. Capture Sidebar 13 with its settings dialog open.
- Decode each capture once and encode **480×300** and **960×600** WebP images using Chromium.
  Store content-hashed files in `public/block-previews/` and URLs/dimensions in a
  generated manifest. Publish after successful captures, then prune obsolete
  generated filenames.
- Support a single-variant `--block` filter and deployment `--base`; the generator
  manages its own temporary preview server and browser.
- Serve only the active light/dark set after the stored theme is available. Use
  `srcSet`, `sizes`, explicit dimensions and async decoding; the first three cards
  load eagerly and the remainder use native lazy loading.
- Keep the frame and detail link usable if an image fails. Without JavaScript,
  static cards retain their text and links with a preview placeholder.

Thumbnails use the **standard Kamod preset in light/dark mode**. Card styling
follows the selected preset; other live theme combinations remain on detail pages.

```sh
pnpm build:docs
pnpm --filter @kamod-ch/ui-docs blocks:thumbnails
pnpm --filter @kamod-ch/ui-docs build
```

The new `packages/docs/scripts/README.md` explains browser installation, subpath
builds, single-block updates and when to regenerate. Check in images and manifest
together. Normal builds consume these assets without running Chromium; CI
regeneration is deferred. A complete repeat generated identical assets locally.

### 4. Shared showcase controls and reliable source loading

`BlockShowcase` provides Preview/Code tabs and refresh/new-tab controls.
`BlockShowcaseCode` keeps path-copy feedback and selected-file state separate from
preview state, preserving selection across tab switches. Both reuse core Tabs/Button,
existing preview/code components, Kamod Icons and Hooks' `useTimeout`.

`BlockSourceFiles` provides grouped or flat file navigation, selected-file
accessibility state, loading feedback and retryable errors. Source modules load
only when Code is opened. An earlier asynchronous response cannot replace the
currently selected file; cleanup prevents updates after unmount. Results are bound
to both the loader and filename, so switching blocks cannot expose stale code for
an identically named file. Synchronous loader errors also show the retry UI.
Full paths avoid collisions between filenames in different directories.

Application Shell retains its `h2` permalink, flat file labels and existing
path-copy behavior. Other detail showcases use an `h1` with paragraph descriptions.

### 5. Metadata and route loading

Extract component-free `metadata.ts` records for all four visible categories.
Their runtime registries compose the same data with their existing demo components;
public exports and block APIs remain unchanged.

Overviews import only metadata. Detail/preview modules load on demand in the
browser, including modules for hidden categories whose eager imports otherwise
pulled demos into the shared dependency graph. Hidden-category visibility and
routes are preserved.

A small Vite plugin provides separate server/browser versions of
`virtual:kamod-block-pages`: **eager modules for PreactPress's synchronous static
renderer, lazy loaders for the browser**. The typed route wrapper retains complete
static HTML and supplies loading/error states with a reload action.

This avoids overview requests for demo/source chunks and preview iframes. No new
runtime dependencies, package exports or lockfile changes are introduced.

### 6. Related shared fixes

#### Inline dropdown placement

`useDropdownPlacement` read the trigger's document before checking whether placement
was enabled. Inline menus with a composite sidebar trigger could crash even though
they required no portal measurement. Return before DOM access when disabled:

```ts
if (!enabled) return;
const content = contentRef.current;
const trigger = triggerRef.current;
const view = trigger?.ownerDocument.defaultView;
```

A regression test failed against the unchanged implementation and passes with the
fix. This is a narrowly scoped **core component change supporting the previews**;
portal placement behavior is otherwise unchanged.

#### Accessible names

Add an explicit label to the shared DocsShell theme toggle and footer brand link.
These small shared-documentation fixes address missing names found during overview
accessibility checks and also benefit other pages using those components.

### 7. Tests and verification

New/updated tests cover registry/route consistency, old anchors and browser history,
static detail/preview HTML, source request races and retries, screenshot integrity,
keyboard navigation, theme selection, responsive layouts, image failure and no-JS
links. The thumbnail integrity test enforces both sizes/themes and a 100 KiB/image cap.

Overview tests verify the displayed variant count for all four categories. The
sidebar test expects the new **Categories** heading. Focused browser checks also
verified the smaller links and active marker on mobile and desktop in both themes.

The existing Sidebar 10 test was corrected to exercise **More actions → Copy link**,
the menu already present in the unchanged baseline, instead of expecting an absent
popover trigger. The block was not changed to satisfy that stale assertion.

| Validation                        | Current result                                                                                   |
| --------------------------------- | ------------------------------------------------------------------------------------------------ |
| Docs unit tests                   | **45 passed**, including loader changes and synchronous source failures                          |
| Combined Chromium suites          | **74 passed** before committing: overview, auth, sidebar and Application Shell documentation     |
| Latest overview/disclosure checks | **26 passed**, including keyboard expansion, empty categories and mobile variant navigation      |
| Blocks suite                      | **159 passed**                                                                                   |
| Targeted DropdownContent suite    | **6 passed**                                                                                     |
| Docs production build             | Passed under `/kamod-ui/`                                                                        |
| Scoped formatting/lint            | Oxfmt, Oxlint, Biome and diff checks passed                                                      |
| Generator comparison              | Original and refactored generators produced identical 108 assets and manifests on the same build |
| Docs typecheck                    | Same existing `DocsShell 2.tsx` error before and after this refactor; no new diagnostics         |

Chromium coverage includes all four categories across mobile, tablet and desktop,
light/dark schemes, keyboard operation, source/setup links, lazy loading, image
failure and static no-JS navigation. Boundary checks cover 16 widths from 320–1920px,
including path/action spacing, sidebar alignment and mobile badge placement. The
random header preview is checked for category membership, theme stability, keyboard
focus and responsive visibility.

The typecheck failure belongs to an untouched local duplicate: `pageHeader` is not
a `DemoShell` prop in `DocsShell 2.tsx`. Its diagnostic was recorded before editing
and reproduced afterward with the same diagnostic. It is not counted as a passing
check. A separate compiler run using the same project configuration and excluding
only the untracked duplicate copies passed for all 215 remaining source files; no
local copies were edited or included in the commits.

Generator verification found an existing image difference for Sidebar 15 relative to
the stored assets; both generators produced the same result. The pre-review assets
were restored, keeping this refactor free of unrelated screenshot changes.

**Verification limits:** WebKit could not create a page because the installed
browser/driver rejects `PushAPIEnabled`; Safari is not marked as verified. Full-page
axe checks exclude only the official `.kamod-logo__suffix` wordmark contrast under
the logo exemption. No whole-repository release-gate pass is claimed.

### Scope and maintenance

[#51](https://github.com/kamod-ch/kamod-ui/issues/51) and
[#56](https://github.com/kamod-ch/kamod-ui/issues/56) share the same category/card
structure, so they are delivered together. The screenshot implementation is the
agreed alternative to #56's original live-preview title.

A root `/blocks` landing page, general block guides and a full
shared template for all detailed documentation remain separate proposals. Future
visual changes require regenerating affected thumbnails.

Personal notes, root development guides, `.docs/`, `AGENTS.md`, local `.gitignore`
and formatter configuration edits, and duplicate working files are excluded.

### Screenshots

**Before:** <!-- Add the Login/Signup inline list and text-only Sidebar cards. -->

**After — desktop:** <!-- Add the new category header and visual card grid. -->

**After — mobile / dark:** <!-- Add narrow and dark-mode examples. -->

**Detail:** <!-- Add a Login/Signup detail page with Preview/Code controls. -->

<details>
<summary><strong>Complete changed-file inventory</strong> — implementation files, 108 generated images and this scope record</summary>

Paths below are relative to the repository root. This covers the complete feature
diff relative to `99b8493`, plus this combined issue/PR document.

#### Block metadata and registries

- `packages/blocks/src/application-shell/metadata.ts`
- `packages/blocks/src/application-shell/registry.ts`
- `packages/blocks/src/login/metadata.ts`
- `packages/blocks/src/login/registry.ts`
- `packages/blocks/src/sidebar/metadata.ts`
- `packages/blocks/src/sidebar/registry.ts`
- `packages/blocks/src/signup/metadata.ts`
- `packages/blocks/src/signup/registry.ts`

#### Core fix and regression

- `packages/core/src/components/dropdown/DropdownContent.test.tsx`
- `packages/core/src/components/dropdown/useDropdownPlacement.ts`

#### Docs routing and shared footer

- `packages/docs/.preactpress/block-pages-plugin.ts`
- `packages/docs/.preactpress/config.ts`
- `packages/docs/.preactpress/theme/Footer.tsx`
- `packages/docs/.preactpress/theme/Layout.tsx`
- `packages/docs/.preactpress/theme/block-page.tsx`
- `packages/docs/.preactpress/theme/block-pages.d.ts`

#### New detail routes

- `packages/docs/blocks/login/login-01/index.md`
- `packages/docs/blocks/login/login-02/index.md`
- `packages/docs/blocks/login/login-03/index.md`
- `packages/docs/blocks/login/login-04/index.md`
- `packages/docs/blocks/login/login-05/index.md`
- `packages/docs/blocks/signup/signup-01/index.md`
- `packages/docs/blocks/signup/signup-02/index.md`
- `packages/docs/blocks/signup/signup-03/index.md`
- `packages/docs/blocks/signup/signup-04/index.md`
- `packages/docs/blocks/signup/signup-05/index.md`

#### Browser coverage

- `packages/docs/e2e/application-shell-docs.spec.ts`
- `packages/docs/e2e/block-overviews.spec.ts`
- `packages/docs/e2e/blocks-auth.spec.ts`
- `packages/docs/e2e/blocks-sidebar.spec.ts`

#### Generator workflow

- `packages/docs/scripts/README.md`
- `packages/docs/scripts/BLOCK-PREVIEW-IMAGES.md`
- `packages/docs/scripts/generate-block-thumbnails.mjs`

#### Shared docs components, metadata and unit tests

- `packages/docs/src/blocks/ApplicationShellShowcase.tsx`
- `packages/docs/src/blocks/BlockCategoryNavigation.tsx`
- `packages/docs/src/blocks/BlockCategoryPage.tsx`
- `packages/docs/src/blocks/BlockCategoryHeader.tsx`
- `packages/docs/src/blocks/BlockDetailPage.tsx`
- `packages/docs/src/blocks/BlockOverviewCard.tsx`
- `packages/docs/src/blocks/BlockThumbnail.tsx`
- `packages/docs/src/blocks/BlockCategoryPreview.tsx`
- `packages/docs/src/blocks/BlockInstallation.tsx`
- `packages/docs/src/blocks/BlockShowcase.tsx`
- `packages/docs/src/blocks/BlockShowcaseCode.tsx`
- `packages/docs/src/blocks/BlockVariantDetail.tsx`
- `packages/docs/src/blocks/BlockBreadcrumbs.tsx`
- `packages/docs/src/blocks/block-links.ts`
- `packages/docs/src/blocks/ApplicationShellHeader.tsx`
- `packages/docs/src/blocks/application-shell-config.ts`
- `packages/docs/src/blocks/BlockSourceFiles.test.tsx`
- `packages/docs/src/blocks/BlockSourceFiles.tsx`
- `packages/docs/src/blocks/BlocksApplicationShellContent.tsx`
- `packages/docs/src/blocks/BlocksAuthContent.tsx`
- `packages/docs/src/blocks/BlocksSidebarContent.tsx`
- `packages/docs/src/blocks/block-categories.test.ts`
- `packages/docs/src/blocks/block-categories.ts`
- `packages/docs/src/blocks/block-nav-config.ts`
- `packages/docs/src/blocks/block-overview-details.ts`
- `packages/docs/src/blocks/block-overview-details.test.ts`
- `packages/docs/src/blocks/block-thumbnails.test.ts`
- `packages/docs/src/blocks/generated/block-thumbnails.json`

#### Shared accessibility and styles

- `packages/docs/src/docs/components/DocsShell.tsx`
- `packages/docs/src/layout/DemoShell.tsx`
- `packages/docs/src/layout/DocsTopbarActions.tsx`
- `packages/docs/src/styles/app.css`
- `packages/docs/src/styles/application-shell.css`
- `packages/docs/src/styles/block-overviews.css`
- `packages/docs/src/styles/blocks.css`
- `packages/docs/src/styles/index.css`

#### Package script, scope document and generated images

- `packages/docs/package.json` — adds `blocks:thumbnails`.
- `packages/docs/BLOCK-OVERVIEWS-ISSUES-AND-PR.md` — this combined issue and PR scope record.
- `packages/docs/public/block-previews/*.webp` — all **108** generated files,
  mapped individually by `packages/docs/src/blocks/generated/block-thumbnails.json`.

</details>

## Implementation commits

The existing #51 commits are followed by four focused #56 implementation commits;
this combined document is committed separately after the code. Follow-up commits
keep category navigation, card presentation and documentation changes separate.

| Commit    | Scope                                                                             |
| --------- | --------------------------------------------------------------------------------- |
| `22d98ec` | Inline dropdown guard and regression test                                         |
| `ec4897e` | Component-free block metadata and registry composition                            |
| `42b23ec` | Shared overview/detail/showcase components, routes and lazy source loading        |
| `7d53772` | Navigation, static rendering and source-loading regression coverage               |
| `53f7345` | Accessible names for the theme toggle and footer brand link                       |
| `5631e48` | Screenshot generator, maintenance guide, 108 images, manifest and integrity tests |
| `fb22422` | Themed visual cards, category header and responsive layout                        |
| `14d8a08` | Overview browser regression tests                                                 |

The normal formatting/lint commit hooks passed without modifying the verified
implementation. Personal issue drafts and local context files remain outside the
commits; this combined document is the explicitly requested shared record.

### Latest refinement commits

1. **`1e8b270` — `feat(docs): refine block category navigation with variant counts`** — shared
   desktop/mobile links, total and per-category counts, accessible active state,
   compact text/marker and wider sidebar spacing; updated sidebar regression.
2. **`8f1b4f1` — `style(docs): compact overview previews and show variant totals`** — shorter
   16:9 frames without image cropping, simple count, cleaner header-to-grid spacing
   and count assertions for each category.
3. **`docs(blocks): update overview PR scope and validation`** — bring this shared
   issue/PR record up to date. Personal planning files remain local.

The full-width category header was reverted. The later sidebar alignment keeps
the introduction in the content column and starts Categories beside the first cards.

### Category, setup and card refinement series

These follow-up commits capture the final design, without recording superseded
experiments such as dependency lists inside cards or the removed browsing hint.

| Commit    | Scope                                                                          |
| --------- | ------------------------------------------------------------------------------ |
| `6591ed8` | Match detail breadcrumbs to compact overview sizing                            |
| `e2bfe2e` | Category titles, responsive badges, introductions and theme guidance           |
| `d714382` | Shared display/source/setup metadata and contract tests                        |
| `324c9f6` | Shared Sidebar/Login/Signup installation guides                                |
| `bb863c6` | Inset preview cards, tagged metadata, source/setup actions and truncated paths |
| `6c57adc` | Slow preview zoom, card lift, translucent arrow and reduced-motion behavior    |
| `c4e16d0` | Source-action and cross-page setup navigation browser coverage                 |

A final documentation commit updates this shared issue/PR record and validation.
