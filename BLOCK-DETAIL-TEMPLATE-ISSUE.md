# Share block detail layout and documentation structure into reusable components

## Goal

Turn the **Application Shell 1 detail page** into a reusable documentation layout,
giving block pages consistent navigation, spacing and guide sections.

[Local reference](http://localhost:5173/blocks/application-shell/application-shell-1)
— requires the dev server. The implementation is in
[`BlocksApplicationShellContent.tsx`](packages/docs/src/blocks/BlocksApplicationShellContent.tsx)
and [`ApplicationShellProps.tsx`](packages/docs/src/blocks/ApplicationShellProps.tsx).

## Problem

Application Shell 1 combines a detailed guide with a header, showcase and right-hand
contents sidebar. Other detail pages, such as Sidebar, mainly provide the showcase.
The richer layout is coupled to Application Shell names, routes, IDs and styles,
encouraging duplicated markup and behavior.

Headings and contents links are maintained separately and can fall out of sync.

## Reference layout and content

The page follows **header → showcase → guide with contents sidebar → footer**.
The guide aligns with the showcase and uses section separators, clear headings,
numbered setup steps, callouts and copyable examples.

| Area                 | What the shared pattern should provide                                                                                                                                                                                                                                       |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Page header**      | Category backlink, readable title, meaningful optional badge and short introduction. Breadcrumbs sit opposite previous/next variant, bug-report and source links. Missing variants are disabled; actions hide when space is limited.                                         |
| **Showcase**         | The existing bordered preview/source container, including Preview/Code, refresh, responsive sizes, source files, Copy and standalone preview. Preserve its behavior during extraction.                                                                                       |
| **On this page**     | Sticky right-hand navigation below the showcase, with active-section highlighting, nested subsections and independent scrolling in short windows. Overview links to the page top; Showcase is its sublink. Hide the sidebar when the guide cannot comfortably fit beside it. |
| **Add this block**   | **1. Copy the block**, including any required assets; **2. Install missing dependencies**, with package-manager tabs and compatibility notes; **3. Set up styles and import**, with theme/Tailwind guidance and the local import.                                            |
| **Usage**            | A minimal working example and the app integration points: supplied data, callbacks and page content. Link to shared setup guides where available rather than repeating unrelated installation detail.                                                                        |
| **Props and data**   | Component props, required indicators, typed examples and expandable definitions with field documentation. Application Shell also covers navigation data, routing/account callbacks and separate desktop/mobile state.                                                        |
| **About this block** | Explain composition, interactions, responsive behavior, accessibility, styling and customization. Application Shell additionally explains its account menu, content area and demo data.                                                                                      |
| **Design reference** | Optional attribution, source link and useful adaptation notes when a block has an external reference.                                                                                                                                                                        |
| **Footer**           | Return to the category and showcase, with centered repository/feedback links.                                                                                                                                                                                                |

Keep the existing theme-derived colors, subtle inline-code highlighting, heading
permalinks and visible keyboard focus. On small screens use a single content column
and contain code/table overflow instead of widening the page.

## Proposed implementation

1. **Extract `BlockDetailLayout`** under `packages/docs/src/blocks/detail/`, reusing
   the site shell. Share its header, guide, contents navigation and footer; accept
   the existing showcase as a Preact content slot.
2. **Pass typed metadata:** title, description, category/breadcrumb links,
   repository/issue URLs, separate attribution links and adjacent variants. Adapt
   registry entries in the docs layer, keeping documentation markup out of the
   blocks package. The registry's `sourceUrl` currently identifies the design reference.
3. **Define sections once:** `id`, `title`, optional section label, Preact content
   and child sections. The shared renderer owns headings, IDs and contents links;
   supplied content omits those wrappers. Omitted sections leave no empty panels
   or broken links.
4. **Share presentation, keep content specific.** Reuse heading links,
   `RequiredIndicator`, code blocks and API cards. Each block supplies its own
   dependencies, examples and type excerpts. Keep the current `types.ts` extractor
   local rather than introducing a generic documentation generator.
5. **Use an explicit shared detail-page CSS class** instead of feature-specific
   selectors. Retain breakpoints, theme tokens, anchor offsets, active-section
   tracking and browser history. Type deep links must continue revealing collapsed
   definitions.

Illustrative usage after extraction:

```tsx
<BlockDetailLayout
  metadata={applicationShellPage}
  showcase={<ApplicationShellShowcase block={block} />}
  sections={applicationShellSections}
/>
```

These are proposed names. Section content remains ordinary Preact components;
adding a subsection should not require another layout flag.

## Migration and scope

Extract Application Shell 1 while preserving URLs, anchor IDs and appearance.
Then migrate **sidebar-01** with its own setup, usage and behavior notes to prove
reuse before adopting the layout more widely.

This belongs in **kamod-ui's documentation package**. Showcase toolbar redesigns,
category overviews and general setup guides remain separate proposals. Coordinate
with the [header/preview-controls issue](BLOCK-DETAIL-LAYOUT-ISSUE.md) to avoid
overlapping work.

## Done when

- [ ] Application Shell 1 and at least one Sidebar variant use the shared layout.
- [ ] Page headings and nested contents links use the same section definitions.
- [ ] Each page documents its own setup, usage and relevant API/behavior; optional sections can be omitted cleanly.
- [ ] Existing preview, copy, variant navigation, anchor links and browser history still work.
- [ ] Mobile/tablet/desktop, light/dark themes, short windows and keyboard navigation are covered by focused checks.

## Screenshots

**Reference — Application Shell header, showcase and guide**

> Add a desktop screenshot showing the right-hand contents sidebar.

**Responsive reference**

> Add a mobile screenshot showing the single-column guide and code examples.

create an issue:
I found a "bug" for the tooltip core component when I built the required icon component. When quickly hovering over the tooltip trigger and then quickly unhover it again before the tooltip even appears (a simple continuous movement over the trigger is also enough) , the tooltip actually stays visible right there over the trigger without
