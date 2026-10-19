# docs(blocks): add setup, styling and theming guides

**Priority: Low.** Nice-to-have documentation improvement.

## Goal

Add shared guides that explain how to start using and customize Kamod blocks.
Users should have one clear starting point, with individual block pages linking
to common setup instructions.

Use Shadcnblocks' [Getting Started](https://www.shadcnblocks.com/docs/blocks/getting-started),
[Component Styles](https://www.shadcnblocks.com/docs/blocks/styles) and
[Theming](https://www.shadcnblocks.com/docs/blocks/theming) pages as structural references,
with examples adapted to Kamod's supported Preact APIs and source-copy workflow.

## Proposed pages

| Page                 | Suggested route                | Essential content                                                                                                                                                                                              |
| -------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Getting Started**  | `/docs/blocks/getting-started` | Preact/Tailwind prerequisites, Kamod dependencies and CSS setup, copying block files, local imports and a minimal working example. Include common missing-style/import problems.                               |
| **Component Styles** | `/docs/blocks/styles`          | Customize existing component variants, sizes, spacing, borders and radius through supported props and classes. Show a small before/after example and explain when to use local styling or shared theme tokens. |
| **Theming**          | `/docs/blocks/theming`         | Required theme imports, semantic tokens, Kamod presets, light/dark mode and a short custom-brand example applied to a block.                                                                                   |

## Implementation

- Reuse the existing PreactPress docs layout, code blocks and navigation. Add a
  **Guides** group to Blocks navigation on desktop and mobile, and links from
  `/blocks` and individual blocks' “Add this block” sections.
- Reuse or link to existing component/theming documentation for shared details.
  Keep block-specific instructions brief and contributor/workspace setup separate.
- Verify dependencies, imports and version requirements. Document existing Kamod
  styling capabilities; adding a CLI or new style system is separate work.

## Done when

- [ ] All three guides are reachable from Blocks navigation and site search.
- [ ] A new user can follow Getting Started to render a block in a Preact app.
- [ ] Styling and theme examples work, including light/dark mode.
- [ ] Copyable examples are verified; navigation works on mobile and under `/kamod-ui/`.

> Screenshot placeholder: the Guides navigation group and an example guide page.
