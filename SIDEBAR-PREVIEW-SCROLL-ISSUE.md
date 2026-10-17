# fix(docs): prevent sidebar clipping when scrolling previews

**Status:** implemented locally with the Application Shell 1 specification audit
on 2026-09-18. Not yet committed or published.

## Problem

Scrolling a block detail page in Safari/WebKit makes the upper sidebar turn blank.
Navigation and header controls disappear and stop receiving clicks, as if covered
by an overlay. This affects both `application-shell-01` and the deployed
[`sidebar-01`](https://kamod-ch.github.io/kamod-ui/blocks/sidebar/sidebar-01/).

**Expected:** sidebar content stays visible and usable within the preview while
scrolling the page or the navigation list.

## Reproduce before the fix

1. Open either block's detail page in Safari, using the desktop preview.
2. Scroll the **documentation page** down about 160px while keeping the preview visible.
3. Notice the blank upper sidebar. Try its brand control or search field.

Reproduced in Playwright WebKit 26.0 at 1440 × 1100. The blank area grew with page
scrolling; the same Chromium comparison did not show it.

> Screenshot: attach the sidebar with its upper navigation hidden.

## Cause and location

This is a clipping/hit-testing problem involving the shared docs preview and the
core sidebar's fixed positioning. No modal overlay is covering the links.

- `packages/core/src/components/sidebar/Sidebar.tsx`: the desktop
  `sidebar-container` uses `fixed inset-y-0 ... h-svh`.
- `packages/docs/src/styles/blocks.css`: `.blocks-preview-inline` applies
  containment, inside a frame with `overflow: hidden`.
- `packages/docs/src/blocks/BlockPreview.tsx`: wraps the inline block in another
  scroll container, `.blocks-preview-host` (`overflow-auto`).

The relevant effective styles are:

```css
[data-slot="sidebar-container"] {
  position: fixed;
  height: 100svh;
}
.blocks-preview-inline {
  contain: layout paint style;
  isolation: isolate;
}
```

[CSS containment changes the containing block for fixed descendants](https://www.w3.org/TR/css-contain-1/#paint-containment).
In this nested layout, WebKit clips the sidebar incorrectly after page scrolling.
Also, `100svh` measures the browser window, which can exceed the preview's height.
The previous Application Shell height override addressed only that sizing mismatch.

## Fix

In `packages/docs/src/styles/blocks.css`, the Application Shell-only height override
is replaced with a rule for all inline block previews:

```css
.blocks-preview-inline [data-slot="sidebar-container"] {
  position: absolute;
  height: 100%;
  max-height: calc(100% - var(--header-height, 0px));
}
```

The preview frame already has `position: relative`, so the sidebar stays anchored
inside it. The maximum height also respects the sticky-header variant's offset.
Containment and the scrollable `SidebarContent` are retained. The rule is scoped
to docs previews; core sidebars keep fixed positioning in standalone applications.

**Verification:** three focused preview tests pass in both Chromium and WebKit.
They check pointer access after page scrolling, scrolling to the final link, and
container bounds for floating, icon-capable, inset, right, dual and sticky-header
variants. WebKit used the compatible temporary runner already installed locally.
The main Playwright WebKit project now includes this regression suite.

## Verified

- [x] Page/sidebar scrolling keeps the affected controls clickable in Chromium and WebKit.
- [x] Six other sidebar variants stay within their preview bounds, including the sticky-header offset.
- [x] Application Shell keyboard, collapse, account-menu and mobile/standalone preview checks pass.
- [x] Regression coverage checks actual hit testing and captures screenshots after scrolling.
