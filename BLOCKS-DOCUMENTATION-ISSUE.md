# feat(docs, blocks): unify overviews and detail pages

> **Issue:** [#51](https://github.com/kamod-ch/kamod-ui/issues/51) · **Local status:** implemented and committed; publication/merge is not implied.

## Initial problem

Block categories use different browsing patterns. **Sidebar** and **Application
Shell** have overview cards leading to individual detail pages. **Login** and
**Signup** instead render every full demo and its source controls on one long page.

This makes navigation inconsistent, loads more demo code than browsing requires,
and duplicates the overview, preview controls and source-file layout across pages.

## Expected experience

**Category → overview cards → one block's detail page.**

Use this pattern for every visible category, even a category with only one block.
Each detail page keeps its live preview, source files, refresh/new-tab controls and
return link. Application Shell keeps its existing header and detailed guide.

```text
/blocks/login/                    Overview of five variants
/blocks/login/login-01/           One variant, with Preview and Code
/blocks/login/login-01/preview/   Existing standalone demo
```

## Implementation

### Share the page structure

- `BlockCategoryPage` renders metadata-driven overviews for Sidebar, Application
  Shell, Login and Signup.
- `BlockDetailPage` provides the common site layout and category backlink, with an
  optional custom header.
- `BlockShowcase` owns preview/code tabs and controls; `BlockSourceFiles` owns the
  source selector, loading feedback and retry behavior.
- Add **ten detail routes**: `login-01`–`login-05` and `signup-01`–`signup-05`.

### Load only what the visitor needs

Separate component-free `metadata.ts` files from the four runtime registries.
Overviews import metadata; browser detail routes load their demo modules on demand;
source text loads when the Code tab is opened.

```tsx
<BlockShowcase
  block={block}
  loadSource={async (file) => (await import("./auth-source")).getAuthBlockSource(block.id, file)}
/>
```

PreactPress needs synchronous server rendering. A small Vite plugin supplies eager
modules to the static renderer and lazy modules to the browser, preserving complete
HTML without pulling all demos into the overview's browser dependencies.

### Preserve existing links

Category URLs and standalone preview routes stay valid. Registered legacy anchors
redirect to their new detail page, preserving the query string and deployment base:

```text
/blocks/login/?example=1#login-01
→ /blocks/login/login-01?example=1#login-01
```

Use `location.replace` so browser Back does not repeatedly revisit the redirect.
Unknown or malformed fragments stay on the overview. Without JavaScript, retained
card IDs still provide a useful destination for old anchors.

## Related fix

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

## Acceptance and verification

- [x] All four visible categories share the overview/detail flow.
- [x] Direct detail loads, standalone previews, source selection and return links work.
- [x] Old anchors preserve queries and work with the `/kamod-ui/` base path.
- [x] Overviews avoid demo/source imports; static detail HTML remains complete.
- [x] Source loading handles stale responses, failures and retries.
- [x] Relevant unit tests, Chromium checks, typechecks and builds pass.

The shared flow was checked on narrow and desktop layouts, in light/dark mode and
with keyboard navigation. See the [execution and validation record](.docs/BLOCK-OVERVIEWS-IMPLEMENTATION.md)
for exact results and the pending WebKit verification.

## Scope and related work

Preserve block APIs, form behavior, preview routes and existing hidden-category
visibility. This work follows the already merged Application Shell feature.

[#56](https://github.com/kamod-ch/kamod-ui/issues/56) adds generated visual previews
and card styling on top of this shared structure. Search, sorting, general setup
guides and a full reusable documentation template remain separate proposals.

## Screenshots

**Before — Login/Signup:** <!-- Add screenshot of the inline demo list. -->

**After — category:** <!-- Add screenshot of the shared overview. -->

**After — detail:** <!-- Add screenshot of a single variant and its controls. -->
