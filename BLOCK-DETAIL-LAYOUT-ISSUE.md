# feat(docs): refine block headers and preview controls

**Priority: Low.** Visual polish; not urgent or a blocker for new blocks.

## Problem

Individual block pages have a weak visual hierarchy: the title is small, actions
sit beside the description, Preview/Code tabs stretch across the card, and viewport
controls float over the demo. The result feels fragmented and unnecessarily busy.

## Proposed improvement

Use the [Shadcnblocks block page](https://www.shadcnblocks.com/block/application-shell1)
as a layout reference, adapted to Kamod's existing styling and features:

- A distinct page header above the showcase, with a prominent block title,
  subdued description and clear navigation back to the category.
- One compact toolbar directly above the preview: Preview/Code on the left;
  viewport selection, refresh and open-in-new-tab actions grouped on the right.
- Consistent spacing, control sizes and subtle separators, with fewer nested
  borders. Keep controls outside the demo so they cannot cover its content.
- Stack or wrap the toolbar cleanly on small screens.

## Implementation

Share the header and toolbar layout across individual block pages, starting with
Sidebar and Application Shell. Reuse existing Kamod controls and preview behavior.

Start with `BlocksSidebarContent.tsx`, `BlocksApplicationShellContent.tsx` and
`BlockPreviewPanel.tsx` in `packages/docs/src/blocks/`, plus `src/styles/blocks.css`.
The category overview/detail migration remains a
[separate issue](BLOCKS-DOCUMENTATION-ISSUE.md).

## Done when

- [ ] Individual block pages use a consistent header and showcase toolbar.
- [ ] Mobile/desktop layouts and light/dark themes look balanced, without overlap.
- [ ] Preview, source, copy, refresh and viewport controls still work with keyboard
      access and accessible labels.
- [ ] Existing block names, routes and demo behavior are preserved.

## Screenshots

**Current Kamod layout**

> Screenshot placeholder: block heading, scattered controls and preview frame.

**Shadcnblocks reference**

> Screenshot placeholder: distinct header and grouped toolbar above the preview.
