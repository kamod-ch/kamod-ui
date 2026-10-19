# feat(docs): improve block browsing and discovery

**Priority: Low.** Nice-to-have browsing and appearance improvement.

## Goal

Improve `/blocks` and category overview pages, closely following the layout of
the [Shadcnblocks category page](https://www.shadcnblocks.com/blocks/accept-invite).
Make it easier to find, compare and navigate block variants.

## Proposed design and behavior

- **Header:** clear page/category title, short description and variant count.
  Category headers can include a small representative live preview.
- **Breadcrumbs:** `Home → Blocks` on `/blocks`, and
  `Home → Blocks → Category` on category pages, above the browsing toolbar.
- **Category sidebar:** an “All blocks” link, variant counts beside each category
  and a clear active state. Add the reference's category sort menu:
  **Alphabetical** or **Count** (most variants first).
- **Search and sort toolbar:** always shown on `/blocks` and every category
  overview, including on mobile and when there are no results. Keep controls
  directly available rather than hidden in a menu.
- **Search:** match block names, IDs and descriptions. Search all visible categories
  on `/blocks`; search only the current category on its overview. Show a result
  count and an empty state with a clear-search action.
- **Block sorting:** offer **Default** (registry order), **Name A–Z** and
  **Name Z–A**, separately from sidebar category sorting.
- **Layout:** follow the reference's spacing, separators and sidebar/grid balance
  using Kamod styling. On mobile, provide a category drawer and wrap the toolbar.

## Implementation

Use one shared overview layout and lightweight catalog metadata for titles,
counts, search and sorting. Derive category counts from documented variants,
preserve existing category visibility and keep sidebar totals independent of search.
Store search and sort choices in the URL for reloads, sharing and Back navigation.

Add a proper `/blocks` overview for all visible categories and point the main
Blocks link there; it currently points to `/blocks/sidebar`. Reuse
`block-nav-config.ts`, the category registries and existing navigation components.

Coordinate with the separate [category migration](BLOCKS-DOCUMENTATION-ISSUE.md)
and [live overview previews](BLOCK-OVERVIEW-PREVIEWS-ISSUE.md) proposals. The
[individual block header redesign](BLOCK-DETAIL-LAYOUT-ISSUE.md) stays separate.

## Done when

- [ ] Root and category overviews share the layout, breadcrumbs and visible toolbar.
- [ ] Category counts, both sorting controls and scoped search produce correct results.
- [ ] Empty results, reloads and Back navigation preserve a usable browsing state.
- [ ] Mobile, keyboard navigation and both themes work; links support `/kamod-ui/`.

## Screenshots

**Current Kamod overview**

> Screenshot placeholder: current category sidebar and block listing.

**Shadcnblocks reference**

> Screenshot placeholders: full overview, category counts/sort menu and breadcrumb/search toolbar.
