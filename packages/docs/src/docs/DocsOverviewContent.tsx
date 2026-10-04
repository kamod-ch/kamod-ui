import { withBasePath } from "../base-path";
import { BlockPageEnding } from "../blocks/BlockPageEnding";
import { BlockGuideContents } from "../blocks/detail/BlockGuideContents";
import {
  ComponentOverviewGuide,
  ComponentOverviewReview,
} from "./components/ComponentOverviewGuide";
import { DocsShell } from "./components/DocsShell";
import { LibraryGrid } from "./components/LibraryDirectory";
import { LibraryDirectoryResources } from "./components/LibraryDirectoryResources";
import { LibraryGuideSection } from "./components/LibraryGuideSection";
import { LibraryJumpLinks } from "./components/LibraryJumpLinks";
import { LibraryPageHeader } from "./components/LibraryPageHeader";
import { PathDisplay } from "./components/PathDisplay";
import { docsShowMotion } from "./docs-feature-flags";
import { componentOverviewItems, motionOverviewItems } from "./registry";

const showMotion = docsShowMotion && motionOverviewItems.length > 0;
const title = "Components for flexible Preact interfaces";
const contents = [
  { id: "library-items", label: "All components" },
  {
    id: "choose-components",
    label: "Choose your building blocks",
    children: [{ id: "components-or-blocks", label: "Components or blocks?" }],
  },
  { id: "compose-components", label: "Compose an interface" },
  {
    id: "component-behavior",
    label: "State & behavior",
    children: [
      { id: "component-state", label: "State ownership" },
      { id: "component-accessibility", label: "Labels & focus" },
      { id: "component-feedback", label: "Feedback & recovery" },
    ],
  },
  ...(showMotion ? [{ id: "motion-components", label: "Motion" }] : []),
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
  { id: "component-review", label: "Review before shipping" },
];

/** The component index and practical reading guide share the block guides' complete shell. */
export const DocsOverviewContent = () => (
  <DocsShell
    sidebarScope="components"
    activeDoc={null}
    activeSection=""
    pageContents={
      <BlockGuideContents id="components-overview-contents" sections={contents} pageTitle={title} />
    }
    mainContent={
      <article
        class="block-guide library-directory docs-components-overview components-guide library-overview-guide"
        id="top"
      >
        <LibraryPageHeader
          parent={{ label: "Home", href: "/" }}
          label="Components"
          eyebrow="Component library"
          focus="Choose · Compose · Refine"
          title={title}
          description={
            <>
              <p>
                Explore {componentOverviewItems.length} components for forms, navigation, feedback
                and content. Start with <strong>one useful interaction</strong>, read its examples
                and API, then combine the pieces into a working screen. Kamod’s <code>Preact</code>{" "}
                components share theme tokens and familiar patterns while your application owns the
                data, routes and service callbacks.
              </p>
              <p>
                Use the index below to find a control, or follow the practical guidance to choose
                components, connect <strong>state and accessible labels</strong>, and adapt the
                result with <code>Tailwind CSS</code>. New to the setup? Begin with the{" "}
                <a href={withBasePath("/docs/theming/installation")}>installation guide</a> and{" "}
                <a href={withBasePath("/docs/theming/css-setup")}>global CSS</a>. For a complete
                starting layout, <a href={withBasePath("/blocks")}>explore blocks</a> built from the
                same <PathDisplay path={"@kamod-ch/ui"} /> primitives.
              </p>
            </>
          }
        >
          <LibraryJumpLinks class="block-guide-switcher" label="Directory sections">
            <li>
              <a href="#library-items">All components</a>
            </li>
            <li>
              <a href="#compose-components">Composition & state</a>
            </li>
            <li>
              <a href="#library-guides">Setup & theming</a>
            </li>
          </LibraryJumpLinks>
        </LibraryPageHeader>
        <BlockGuideContents
          id="components-overview-mobile-contents"
          sections={contents}
          pageTitle={title}
          mobile
        />
        <div class="block-guide-documentation">
          <div class="blocks-doc-body">
            <LibraryGuideSection id="library-items" title="Find your next component">
              <div class="block-guide-prose">
                <p>
                  <strong>Browse the complete library.</strong> Each entry opens its installation
                  documentation, with examples and API references available from that page. Check
                  the props and supported composition before copying an example; similarly named
                  controls can serve different interaction patterns.
                </p>
                <p>
                  Start small: render the simplest example in your app before connecting services or
                  changing its appearance. Keep imports on the public{" "}
                  <PathDisplay path={"@kamod-ch/ui"} /> API and follow your project’s existing
                  conventions for files and state.
                </p>
              </div>
              <LibraryGrid
                label="All components"
                items={componentOverviewItems.map(({ label, slug }) => ({
                  label,
                  href: slug ? `/docs/${slug}/installation` : undefined,
                }))}
              />
            </LibraryGuideSection>
            <ComponentOverviewGuide />
            {showMotion && (
              <LibraryGuideSection id="motion-components" title="Add purposeful motion">
                <div class="block-guide-prose">
                  <p>
                    <strong>Build the interaction first, then add motion.</strong> Explore{" "}
                    <PathDisplay path={"@kamod-ch/ui-motion"} /> when a transition helps explain
                    what changed. Keep content usable without animation, check focus through state
                    changes and respect <code>prefers-reduced-motion</code>.
                  </p>
                </div>
                <LibraryGrid
                  label="Motion components"
                  items={motionOverviewItems.map(({ label, slug }) => ({
                    label,
                    href: `/docs/${slug}/installation`,
                  }))}
                />
              </LibraryGuideSection>
            )}
            <LibraryDirectoryResources guide />
            <ComponentOverviewReview />
            <BlockPageEnding page="components" />
          </div>
        </div>
      </article>
    }
  />
);
