import { withBasePath } from "../base-path";
import { BrandText } from "../docs/components/brand/BrandText";
import { DocsShell } from "../docs/components/DocsShell";
import { LibraryGrid } from "../docs/components/LibraryDirectory";
import { LibraryPageHeader } from "../docs/components/LibraryPageHeader";
import { LibrarySection } from "../docs/components/LibrarySection";
import { BlockPageEnding } from "./BlockPageEnding";
import {
  blockLibraryCounts,
  PLACEHOLDER_BLOCK_CATEGORIES,
  publishedBlockNavigationEntries,
} from "./block-library-metadata";

const title = "Block library roadmap";
const counts = blockLibraryCounts();
const published = publishedBlockNavigationEntries();

/** Planned block categories live outside the primary sidebar so default navigation stays actionable. */
export function BlockRoadmapPage() {
  return (
    <DocsShell
      sidebarScope="blocks"
      isSectionOverview
      activeDoc={null}
      activeSection=""
      mainContent={
        <section class="docs-components-overview library-directory docs-blocks-overview">
          <LibraryPageHeader
            parent={{ label: "Blocks", href: "/blocks" }}
            label="Roadmap"
            eyebrow="Block Library"
            title={title}
            description={
              <>
                <p>
                  <BrandText>
                    <strong>{counts.availableVariants} usable variants</strong> ship today across{" "}
                    {counts.availableCategories} published collections.{" "}
                    <strong>{counts.plannedCategories} additional categories</strong> are listed
                    here with <strong>Planned</strong> status only — they do not yet include
                    installable blocks or guides.
                  </BrandText>
                </p>
                <p>
                  Use the <a href={withBasePath("/blocks#library-items")}>Blocks overview</a> for
                  live previews and source you can copy now. Each planned row links to a status page
                  that explains what is missing and where to start instead.
                </p>
              </>
            }
          />
          <LibrarySection
            headingId="available-collections"
            title="Available today"
            label="Published collections"
            meta={`${counts.availableVariants} variants across ${counts.availableCategories} collections`}
          >
            <LibraryGrid
              label="Published block collections"
              items={published.map((entry) => ({
                label: entry.label,
                href: entry.href,
                count: entry.variantCount,
              }))}
            />
          </LibrarySection>
          <LibrarySection
            class="library-directory-planned"
            headingId="planned-collections"
            title="On the horizon"
            label="Planned collections"
            meta={`${counts.plannedCategories} categories · 0 variants each`}
            description={
              <p>
                These names reserve future collections. Status is shown in text and counts —
                availability is never indicated by color alone. Pages document the gap and link back
                to usable alternatives.
              </p>
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
          <BlockPageEnding page="overview" />
        </section>
      }
    />
  );
}
