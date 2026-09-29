import { DocsShell } from "../docs/components/DocsShell";
import { LibraryDirectory, LibraryGrid } from "../docs/components/LibraryDirectory";
import { LibrarySection } from "../docs/components/LibrarySection";
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
      activeDoc={null}
      activeSection=""
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
              Browse {total} reusable Kamod UI blocks. Compare <strong>complete layouts</strong>,
              try different themes and screen sizes in the live previews, and inspect the source
              before adding a variant to your <code>Preact</code> app. Each setup guide explains the
              required files and dependencies, so you can{" "}
              <strong>connect your own data and navigation</strong> with a clear starting point.
            </>
          }
        >
          <LibrarySection
            class="library-directory-planned"
            headingId="planned-collections"
            title="On the horizon"
            label="Planned collections"
            meta={`${PLACEHOLDER_BLOCK_CATEGORIES.length} planned categories`}
            description={
              <>
                <p>
                  Explore the planned categories for future additions to the library, from content
                  sections and marketing pages to checkout and community layouts. These entries show
                  the intended collection structure;{" "}
                  <strong>they do not yet include usable blocks</strong> or an installation guide.
                </p>
                <p>
                  Every planned collection currently has <strong>0 variants</strong>. Its link is a
                  placeholder, and the destination page is not available yet. For a layout you can
                  use today, return to the <a href="#library-items">available collections</a> above
                  and compare their previews and source files.
                </p>
              </>
            }
          >
            <LibraryGrid
              label="Planned block categories"
              items={PLACEHOLDER_BLOCK_CATEGORIES.map(({ key, label }) => ({
                label,
                href: `/blocks/${key}`,
                count: 0,
                planned: true,
              }))}
            />
          </LibrarySection>
        </LibraryDirectory>
      }
    />
  );
}
