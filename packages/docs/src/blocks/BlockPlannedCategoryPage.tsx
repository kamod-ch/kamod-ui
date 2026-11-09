import { withBasePath } from "../base-path";
import { BrandText } from "../docs/components/brand/BrandText";
import { DocsShell } from "../docs/components/DocsShell";
import { LibraryGrid } from "../docs/components/LibraryDirectory";
import { LibraryPageHeader } from "../docs/components/LibraryPageHeader";
import { LibrarySection } from "../docs/components/LibrarySection";
import { plannedCategoryAlternatives, plannedCategoryTeaser } from "./block-library-metadata";
import { PLACEHOLDER_BLOCK_CATEGORIES } from "./block-nav-config";

/** Informative destination for planned-only URLs without implying installable blocks exist. */
export function BlockPlannedCategoryPage({ categoryKey }: { categoryKey: string }) {
  const planned = PLACEHOLDER_BLOCK_CATEGORIES.find((item) => item.key === categoryKey);
  const label = planned?.label ?? categoryKey;
  const alternatives = plannedCategoryAlternatives(categoryKey);
  return (
    <DocsShell
      sidebarScope="blocks"
      activeDoc={null}
      activeSection=""
      mainContent={
        <section class="docs-components-overview library-directory docs-blocks-overview">
          <LibraryPageHeader
            parent={{ label: "Blocks", href: "/blocks" }}
            label={label}
            eyebrow="Planned collection"
            title={`${label} — planned`}
            description={
              <>
                <p role="status">
                  <BrandText>
                    <strong>Status: Planned.</strong> {plannedCategoryTeaser(label)} This URL is
                    reserved for a future category page; it is not a dead link.
                  </BrandText>
                </p>
                <p>
                  Browse <a href={withBasePath("/blocks")}>available block collections</a> or open
                  the full <a href={withBasePath("/blocks/roadmap")}>block roadmap</a> to compare
                  planned and published categories.
                </p>
              </>
            }
          />
          {alternatives.length ? (
            <LibrarySection
              headingId="alternatives"
              title="Start with these instead"
              label="Available alternatives"
              meta={`${alternatives.length} published ${alternatives.length === 1 ? "collection" : "collections"}`}
            >
              <LibraryGrid
                label="Suggested available block collections"
                items={alternatives.map((item) => ({
                  label: item.label,
                  href: item.href,
                  count: item.count,
                  detail: item.description,
                }))}
              />
            </LibrarySection>
          ) : null}
        </section>
      }
    />
  );
}
