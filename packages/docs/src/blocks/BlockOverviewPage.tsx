import { withBasePath } from "../base-path";
import { DocsShell } from "../docs/components/DocsShell";
import { LibraryDirectory, LibraryGrid } from "../docs/components/LibraryDirectory";
import { LibraryJumpLinks } from "../docs/components/LibraryJumpLinks";
import { LibraryPageHeader } from "../docs/components/LibraryPageHeader";
import { LibrarySection } from "../docs/components/LibrarySection";
import { PathDisplay } from "../docs/components/PathDisplay";
import { BlockPageEnding } from "./BlockPageEnding";
import { type BlockCategory, blockCategories } from "./block-categories";
import { PLACEHOLDER_BLOCK_CATEGORIES, visibleBlockNavItems } from "./block-nav-config";
import { BlockGuideContents } from "./detail/BlockGuideContents";

const title = "Blocks for complete application layouts";
const contents = [
  { id: "library-items", label: "All block categories" },
  { id: "planned-collections", label: "On the horizon" },
  {
    id: "library-guides-title",
    label: "Make it your own",
    children: [
      { id: "connect-styles", label: "Connect your styles" },
      { id: "customize-theme", label: "Customize the theme" },
      { id: "explore-icons", label: "Explore the icon library" },
      { id: "library-source-title", label: "Work with the source" },
    ],
  },
];

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
      pageContents={
        <BlockGuideContents id="blocks-overview-contents" sections={contents} pageTitle={title} />
      }
      activeDoc={null}
      activeSection=""
      mainContent={
        <LibraryDirectory
          kind="blocks"
          footer={<BlockPageEnding page="overview" />}
          items={categories.map((item) => ({
            ...item,
            detail:
              blockCategories[item.key as BlockCategory].description
                .replace(/[`*]/g, "")
                .split(". ")[0] + ".",
          }))}
          header={
            <LibraryPageHeader
              parent={{ label: "Home", href: "/" }}
              label="Blocks"
              eyebrow="Block collections"
              focus="Explore · Preview · Build"
              title={title}
              description={
                <>
                  <p>
                    Browse {total} reusable Kamod UI blocks across {categories.length} collections.
                    Compare <strong>complete layouts</strong>, try different themes and screen sizes
                    in the live previews, and inspect the source before adding a variant to your{" "}
                    <code>Preact</code> app. Each block brings existing components together into a
                    working composition, giving you a starting point for navigation, authentication
                    screens and application shells.
                  </p>
                  <p>
                    Start with the{" "}
                    <a href={withBasePath("/blocks/getting-started")}>getting started guide</a>,
                    then use each variant’s <strong>Code tab and setup instructions</strong> for its
                    files and dependencies. Reuse <PathDisplay path={"@kamod-ch/ui"} />, connect
                    your own data and routes, and refine the result with the{" "}
                    <a href={withBasePath("/blocks/styles")}>component styles</a> and{" "}
                    <a href={withBasePath("/blocks/theming")}>theming guides</a>. The available
                    collections below are ready to explore; <strong>planned collections</strong>{" "}
                    show what’s on the horizon and do not yet contain usable variants.
                  </p>
                </>
              }
            >
              <LibraryJumpLinks class="block-guide-switcher" label="Directory sections">
                <li>
                  <a href="#library-items">Available collections</a>
                </li>
                <li>
                  <a href="#planned-collections">Planned collections</a>
                </li>
                <li>
                  <a href="#library-guides">Setup & theming</a>
                </li>
              </LibraryJumpLinks>
            </LibraryPageHeader>
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
