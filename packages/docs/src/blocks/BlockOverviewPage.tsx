import { DocsShell } from "../docs/components/DocsShell";
import { LibraryDirectory, LibraryGrid } from "../docs/components/LibraryDirectory";
import { type BlockCategory, blockCategories } from "./block-categories";
import { PLACEHOLDER_BLOCK_CATEGORIES, visibleBlockNavItems } from "./block-nav-config";

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
        <LibraryDirectory
          kind="blocks"
          items={categories.map((item) => ({
            ...item,
            detail:
              blockCategories[item.key as BlockCategory].description
                .replace(/[`*]/g, "")
                .split(". ")[0] + ".",
          }))}
          description={
            <>
              Browse {total} reusable Kamod UI blocks. Compare complete layouts, try their live
              previews and bring the source into your <code>Preact</code> app. Each variant includes
              its own setup guide and integration examples.
            </>
          }
        >
          <section class="library-directory-planned" aria-labelledby="planned-collections">
            <div class="library-directory-section-heading">
              <h2 id="planned-collections">On the horizon</h2>
              <span>{PLACEHOLDER_BLOCK_CATEGORIES.length} planned categories</span>
            </div>
            <p>
              These collections have no variants yet. Their links are placeholders; the pages are
              not available.
            </p>
            <LibraryGrid
              label="Planned block categories"
              items={PLACEHOLDER_BLOCK_CATEGORIES.map(({ key, label }) => ({
                label,
                href: `/blocks/${key}`,
                count: 0,
                planned: true,
              }))}
            />
          </section>
        </LibraryDirectory>
      }
    />
  );
}
