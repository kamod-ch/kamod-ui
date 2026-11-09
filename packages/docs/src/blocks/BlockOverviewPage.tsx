import { withBasePath } from "../base-path";
import { BrandText } from "../docs/components/brand/BrandText";
import { DocsShell } from "../docs/components/DocsShell";
import { LibraryDirectory, LibraryGrid } from "../docs/components/LibraryDirectory";
import { LibraryPageHeader } from "../docs/components/LibraryPageHeader";
import { LibrarySection } from "../docs/components/LibrarySection";
import { PathDisplay } from "../docs/components/PathDisplay";
import { BlockPageEnding } from "./BlockPageEnding";
import {
  blockOverviewIntroCounts,
  overviewTeaser,
  PLACEHOLDER_BLOCK_CATEGORIES,
} from "./block-library-metadata";
import { publishedBlockOverviewItems } from "./block-overview-items";
import { BlockGuideContents } from "./detail/BlockGuideContents";

const title = "Blocks for complete application layouts";
const contents = [
  { id: "library-items", label: "All Block Categories" },
  { id: "planned-collections", label: "On the Horizon" },
  {
    id: "library-guides-title",
    label: "Make It Your Own",
    children: [
      { id: "connect-styles", label: "Connect Your Styles" },
      { id: "customize-theme", label: "Customize the Theme" },
      { id: "explore-icons", label: "Explore the Icon Library" },
      { id: "library-source-title", label: "Work with the Source" },
    ],
  },
];

const categories = publishedBlockOverviewItems();
const { availableVariants, availableCategories, plannedCategories } = blockOverviewIntroCounts();
const total = availableVariants;

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
            detail: overviewTeaser(item.description),
          }))}
          header={
            <LibraryPageHeader
              parent={{ label: "Home", href: "/" }}
              label="Blocks"
              eyebrow="Block Collections"
              title={title}
              description={
                <>
                  <p>
                    <BrandText>
                      Browse {total} reusable Kamod UI blocks across {availableCategories} published
                      collections. Compare <strong>Complete Layouts</strong>, try different themes
                      and screen sizes in the live previews, and inspect the source before adding a
                      variant to your <code>Preact</code> app. Each block brings existing components
                      together into a working composition, giving you a starting point for
                      navigation, authentication screens and application shells.
                    </BrandText>
                  </p>
                  <p>
                    New to Kamod? Read the{" "}
                    <a href={withBasePath("/docs/getting-started#blocks")}>Getting Started Guide</a>
                    , then follow the{" "}
                    <a href={withBasePath("/blocks/getting-started")}>Block Setup Guide</a> and each
                    variant’s <strong>Code Tab and Setup Instructions</strong> for its files and
                    dependencies. Reuse <PathDisplay path={"@kamod-ch/ui"} />, connect your own data
                    and routes, and refine the result with the{" "}
                    <a href={withBasePath("/blocks/styles")}>Component Styles</a> and{" "}
                    <a href={withBasePath("/blocks/theming")}>Theming Guides</a>. The available
                    collections below are ready to explore. Planned names below open{" "}
                    <strong>status pages</strong> with alternatives — see the{" "}
                    <a href={withBasePath("/blocks/roadmap")}>block roadmap</a> for the full list.
                    Follow the <a href={withBasePath("/docs/theming/css-setup")}>CSS Guide</a> to
                    connect the shared styles.
                  </p>
                </>
              }
            />
          }
        >
          <LibrarySection
            class="library-directory-planned"
            headingId="planned-collections"
            title="On the Horizon"
            label="Planned Collections"
            meta={`${plannedCategories} planned categories · 0 variants each`}
            description={
              <>
                <p>
                  Explore planned categories for future library additions, from content sections and
                  marketing pages to checkout and community layouts. Each name opens a{" "}
                  <strong>status page</strong> with <strong>Planned</strong> in the title — they do
                  not yet include installable blocks or guides.
                </p>
                <p>
                  For a layout you can use today, return to the{" "}
                  <a href="#library-items">Available Collections</a> above or browse the{" "}
                  <a href={withBasePath("/blocks/roadmap")}>full roadmap</a>.
                </p>
              </>
            }
          >
            <LibraryGrid
              label="Planned Block Categories"
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
