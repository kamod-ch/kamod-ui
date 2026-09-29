import { DocsShell } from "./components/DocsShell";
import { LibraryDirectory, LibraryGrid } from "./components/LibraryDirectory";
import { docsShowMotion } from "./docs-feature-flags";
import { componentOverviewItems, motionOverviewItems } from "./registry";

export const DocsOverviewContent = () => (
  <DocsShell
    sidebarScope="components"
    isSectionOverview
    activeDoc={null}
    activeSection=""
    mainContent={
      <LibraryDirectory
        kind="components"
        items={componentOverviewItems.map(({ label, slug }) => ({
          label,
          href: slug ? `/docs/${slug}/installation` : undefined,
        }))}
        description={
          <>
            Compose your interface with Kamod’s <code>Preact</code> components. Start with a single
            control, explore its examples and API, then style it with shared theme tokens. The
            source stays readable and ready to adapt.
          </>
        }
      >
        {docsShowMotion && motionOverviewItems.length > 0 && (
          <section class="library-directory-planned">
            <div class="library-directory-section-heading">
              <h2>Motion</h2>
              <span>Optional enhancements</span>
            </div>
            <p>
              Add entry and exit animations with <code>@kamod-ch/ui-motion</code>.
            </p>
            <LibraryGrid
              label="Motion components"
              items={motionOverviewItems.map(({ label, slug }) => ({
                label,
                href: `/docs/${slug}/installation`,
              }))}
            />
          </section>
        )}
      </LibraryDirectory>
    }
  />
);
