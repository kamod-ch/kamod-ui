import { withBasePath } from "../base-path";
import { DocsShell } from "../docs/components/DocsShell";
import { type BlockCategory, blockCategories } from "./block-categories";
import { visibleBlockNavItems } from "./block-nav-config";

// Keep the directory aligned with published collections, without loading their demos.
const categories = visibleBlockNavItems
  .flatMap((item) => {
    const category = blockCategories[item.key as BlockCategory];
    return category ? [{ ...item, count: category.blocks.length }] : [];
  })
  .sort((a, b) => a.label.localeCompare(b.label));
const total = categories.reduce((sum, category) => sum + category.count, 0);

/** The entry point to block collections, using the same shell and grid as Components. */
export function BlockOverviewPage() {
  return (
    <DocsShell
      sidebarScope="blocks"
      isSectionOverview
      isBlocksOverview
      activeDoc={null}
      activeSection=""
      docs={[]}
      mainContent={
        <section class="docs-components-overview docs-blocks-overview">
          <h1>Blocks</h1>
          <p class="docs-components-intro">
            Browse {total} reusable Kamod UI blocks. Choose a category to compare layouts and
            explore each variant’s live preview, source code and setup guide.
          </p>
          <h2 class="docs-components-grid-heading">All block categories</h2>
          <nav class="docs-components-grid" aria-label="Block categories">
            {categories.map(({ key, label, href, count }) => (
              <a
                class="docs-component-item docs-block-category-item"
                href={withBasePath(href)}
                key={key}
              >
                <span>{label}</span>
                <span class="docs-block-category-count">
                  {count} {count === 1 ? "variant" : "variants"}
                </span>
              </a>
            ))}
          </nav>
        </section>
      }
    />
  );
}
