import { DocsShell } from "./components/DocsShell";
import { LibraryDirectory, LibraryGrid } from "./components/LibraryDirectory";
import { LibrarySection } from "./components/LibrarySection";
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
            Compose your interface with Kamod’s <code>Preact</code> components. Explore
            <strong> working examples and API references</strong> to understand each control’s props
            and behavior before using it in your app. Combine the pieces you need, connect your own
            state and callbacks, and use <code>Tailwind CSS</code> with shared theme tokens to keep{" "}
            <strong>styling consistent across your interface</strong>.
          </>
        }
      >
        {docsShowMotion && motionOverviewItems.length > 0 && (
          <LibrarySection
            headingId="motion-components"
            title="Motion"
            label="Add interaction"
            meta="Optional enhancements"
            description={
              <>
                <p>
                  Add entry and exit animations with <code>@kamod-ch/ui-motion</code> when a
                  transition helps explain what changed. Explore the examples to choose an effect
                  that supports the interaction, then tune its timing to the surrounding interface.
                </p>
                <p>
                  <strong>Build the interaction first, then add motion.</strong> Keep important
                  content usable without an animation, check keyboard focus through each state
                  change, and respect <code>prefers-reduced-motion</code> when adapting examples.
                </p>
              </>
            }
          >
            <LibraryGrid
              label="Motion components"
              items={motionOverviewItems.map(({ label, slug }) => ({
                label,
                href: `/docs/${slug}/installation`,
              }))}
            />
          </LibrarySection>
        )}
      </LibraryDirectory>
    }
  />
);
