# feat(blocks, docs): add application-shell-01

## Goal

Add a reusable Preact application shell built from existing Kamod UI components,
following the supplied `Kamod UI – Application Shell 1.md` specification and the
[Shadcnblocks design reference](https://www.shadcnblocks.com/block/application-shell1).

## Feature

- A 16rem desktop sidebar that collapses to icons, plus an accessible mobile sheet.
- Branding, grouped navigation and expandable submenus. Nested destinations remain
  available in icon mode; active links use `aria-current="page"`.
- User avatar/fallback initials and Account, Billing, Notifications and Log out
  actions supplied through callbacks.
- A header matching `sidebar-01`: toggle button, separator, breadcrumbs and borders.
- Arbitrary `children` in the main content area, with demo data and four placeholder
  panels kept separate from the reusable shell.

Use a small, typed API: `brand`, `navigationGroups`, `user`, `breadcrumbs`,
`children`, `currentPath`, `onNavigate`, `onUserAction`, `open`, `defaultOpen`,
`onOpenChange`, and `class`/`className`. Routing and authentication belong to the
consumer. `onOpenChange` can observe uncontrolled changes or accompany controlled
`open` state.

Reuse Kamod Sidebar, Collapsible, Dropdown, Breadcrumb, Avatar and Separator
primitives, Preact types and Tailwind v4 semantic tokens. Add no React/Radix runtime
or new state library.

## Documentation

Use the existing **category overview → individual detail → standalone preview** flow:

- `/blocks/application-shell`
- `/blocks/application-shell/application-shell-1`
- `/blocks/application-shell/application-shell-1/preview`

The showcase title is **application-shell-01**, with the same styling as other
blocks. Keep the existing `application-shell-1` route/import spelling. Above it,
add an unframed header with the category back link above its descriptive page title,
a readable Application Shell 1 heading, a larger filled Preact native badge using
the active theme's core info variant, gray introduction and core breadcrumbs.
Use compact gray icon buttons with clear hover/focus states for previous/next variants,
reporting a bug and viewing the upstream source folder opposite the breadcrumbs.
Use registry order for variants and disable missing neighbours. Hide the action
group when the header cannot fit it beside the breadcrumbs with a comfortable gap;
leave a small gap before the showcase.

Include a real interactive demo, mobile/tablet/desktop controls, refresh/open
actions, all nine copyable source files, and a return link. Below the showcase,
use a full-width documentation layout with **Add this block**, Usage, Props and
data, and a detailed **About this block** guide. Add a sticky right-hand contents
sidebar with Overview and Showcase first, followed by section and subsection anchors;
hide the contents below 980px and give the guide one column with balanced side
padding and no empty sidebar space. Highlight the current
section and support keyboard links, direct URLs and Back/Forward navigation.
Heading permalinks reveal a link icon on their left on hover or keyboard focus,
without underlining the text or shifting the layout.
For the flush page title, keep that icon inside its right edge below 1440px to
avoid clipping. On phones, place the site's theme/repository controls below the
brand and account for the taller bar when navigating to sections.
Use a compact 16rem contents sidebar from 980px, expanding its width and column
gap from 1260px. Keep readable link sizes throughout. About text should fill the
same content column as other sections.
Keep footer links to the category and showcase aligned with the main content column;
omit the outer frame and Documentation header.
Follow the site's 640px/980px/1260px layout breakpoints; keep narrow code samples
and the props table keyboard-scrollable inside their containers.

Document source copying, missing dependencies, theme setup, local imports,
native links/router callbacks, active states, user actions and responsive behavior.
Include a reusable-file checklist, integration guidance and a props table with a
default-value column. Link the navigationGroups description to a typed navigation
example subsection, also listed in the contents. Use Kamod's core package-manager
tabs. Add a separate Design reference main section after About, with an h2 and a
top-level contents link. Include an attribution card with a core badge, adaptation details, linked external icon
and setup guidance below. Preserve its fragment URL and contents entry. Give main
heading permalink icons a larger size and text gap than subsection icons.
End the guide with a centered, unframed note in small gray text and subtle icon
links to the repository and issue form, below the existing footer navigation.
Support the `/kamod-ui/` base path and include the routes in the generated search.

`@kamod-ch/blocks` is currently a private workspace package. Public users copy the
source and need a UI release exporting `useDropdown` and containing the shared
fixes below; the docs retain this compatibility note.

## Required shared fixes

- Export the existing `useDropdown` hook for menu composition.
- Keep modal focus on visible controls and restore focus after mobile dismissal.
- Recognize custom-slot sidebar portals so inside clicks do not close the sheet.
- Preserve uncontrolled sidebar updates when `onOpenChange` is supplied.
- Respect reduced motion in the shell, menus, mobile panel and backdrop.
- Fix sidebar clipping after scrolling inline previews using docs-scoped positioning.
  Keep standalone application sidebars fixed; cover both this block and `sidebar-01`.

## Acceptance criteria

- [x] Consumer data/content, controlled and uncontrolled collapse, nested navigation,
      active links, breadcrumbs and all user actions work.
- [x] Keyboard operation, accessible names, visible focus, Escape and focus return
      work; public ESM imports render without browser globals during SSR.
- [x] Layout and long labels/email addresses are checked at 320, 768, 1024 and
      1440px in light and dark themes; reduced-motion behavior is verified.
- [x] Category/detail/back navigation, direct preview routes, source display and
      responsive preview controls pass browser checks.
- [x] Inline sidebar scrolling stays visible and clickable in Chromium and WebKit.
- [x] Typecheck, production build, Oxlint, Oxfmt, Biome and relevant tests pass.
      Report existing warnings separately.

## Scope and agreed refinements

Keep the later requested `Workspace / Overview` breadcrumbs and 64px
`sidebar-01` header. These supersede the initial example labels and approximate
header height. Cursor-specific workflow references do not affect implementation;
the work is performed with Codex.

Login/Signup migration, mobile site-wide navigation, overview redesign, live card
previews, general block guides and the detail-page redesign remain separate issues.

## Verification

Local implementation audited on 2026-09-18. Core: 111 tests; blocks: 142; docs: 7.
Chromium: 13 shell, 3 preview and 2 existing modal checks. WebKit: 3 preview
regressions, plus direct reduced-motion checks with a compatible local runner.
Existing theme/calendar lint warnings and the docs bundle-size warning remain.

## Screenshots

> Screenshot placeholder: desktop expanded and collapsed layouts.

> Screenshot placeholder: mobile navigation and light/dark themes.
