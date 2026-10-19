# fix(docs): add missing mobile section navigation

## Problem

On small screens, the documentation hides the desktop navigation without providing
the same main links in the mobile menu:

- [Components](https://kamod-ch.github.io/kamod-ui/docs/components)
- [Blocks](https://kamod-ch.github.io/kamod-ui/blocks/sidebar)
- [Forms](https://kamod-ch.github.io/kamod-ui/docs/forms)
- [Packages](https://kamod-ch.github.io/kamod-ui/docs/packages)

Visitors cannot reliably switch between these sections. The home page has a
**View Components** button and its menu includes **Components overview**, but it
still lacks navigation to all four section landing pages.

## Reproduce

1. Open the [home page](https://kamod-ch.github.io/kamod-ui/) at mobile width, e.g. 390px.
2. Open the navigation menu: the four main section links are not available together.
3. Open Components or Blocks: the menu only lists the current section's content.

## Proposed fix

Add the four main links at the top of a shared mobile navigation menu, available
from the home page and every documentation page. Keep section-specific links below.

Reuse `demoTopNavItems` from `packages/docs/src/layout/DemoShell.tsx` so desktop
and mobile destinations stay consistent. Currently, `styles/app.css` hides the
desktop links below **980px**, while `DocsShell.tsx` and `KitchenSinkPage.tsx`
build separate, incomplete mobile menus.

## Done when

- [ ] All four sections are reachable through the mobile menu from home and documentation pages.
- [ ] Links work under `/kamod-ui/`, and selecting one closes the menu.
- [ ] Touch and keyboard navigation work; desktop navigation remains intact.

> Screenshot placeholder: mobile menu with the main section links missing.
