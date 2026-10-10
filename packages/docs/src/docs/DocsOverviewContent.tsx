import { withBasePath } from "../base-path";
import { BlockPageEnding } from "../blocks/BlockPageEnding";
import { BlockGuideContents } from "../blocks/detail/BlockGuideContents";
import { BrandText } from "./components/brand/BrandText";
import {
  ComponentOverviewGuide,
  ComponentOverviewReview,
} from "./components/ComponentOverviewGuide";
import { DocsShell } from "./components/DocsShell";
import { LibraryGrid } from "./components/LibraryDirectory";
import { LibraryDirectoryResources } from "./components/LibraryDirectoryResources";
import { LibraryGuideSection } from "./components/LibraryGuideSection";
import { LibraryPageHeader } from "./components/LibraryPageHeader";
import { PathDisplay } from "./components/PathDisplay";
import { docsShowMotion } from "./docs-feature-flags";
import { componentOverviewItems, motionOverviewItems } from "./overview-metadata";

const showMotion = docsShowMotion && motionOverviewItems.length > 0;
const title = "Components for flexible Preact interfaces";
const contents = [
  { id: "library-items", label: "All Components" },
  {
    id: "choose-components",
    label: "Choose Your Building Blocks",
    children: [{ id: "components-or-blocks", label: "Components or blocks?" }],
  },
  { id: "compose-components", label: "Compose an Interface" },
  {
    id: "component-behavior",
    label: "State & Behavior",
    children: [
      { id: "component-state", label: "State Ownership" },
      { id: "component-accessibility", label: "Labels & Focus" },
      { id: "component-feedback", label: "Feedback & Recovery" },
    ],
  },
  ...(showMotion ? [{ id: "motion-components", label: "Motion" }] : []),
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
  { id: "component-review", label: "Review before Shipping" },
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
          eyebrow="Component Library"
          focus="Choose · Compose · Refine"
          title={title}
          description={
            <>
              <p>
                <BrandText>
                  Explore {componentOverviewItems.length} components for forms, navigation, feedback
                  and content. Start with <strong>One Useful Interaction</strong>, read its examples
                  and API, then combine the pieces into a working screen. Kamod’s{" "}
                  <code>Preact</code> components share theme tokens and familiar patterns while your
                  application owns the data, routes and service callbacks.
                </BrandText>
              </p>
              <p>
                <BrandText>
                  Use the index below to find a control, or follow the practical guidance to choose
                  components, connect <strong>State and Accessible Labels</strong>, and adapt the
                  result with <code>Tailwind CSS</code>. New to the setup? Begin with the{" "}
                  <a href={withBasePath("/docs/getting-started#components")}>
                    Getting Started Guide
                  </a>{" "}
                  and <a href={withBasePath("/docs/theming/css-setup")}>Global CSS</a>. For a
                  complete starting layout, <a href={withBasePath("/blocks")}>Explore Blocks</a>{" "}
                  built from the same <PathDisplay path={"@kamod-ch/ui"} /> primitives. Follow the{" "}
                  <a href={withBasePath("/docs/theming/css-setup")}>CSS Guide</a> to connect the
                  shared styles.
                </BrandText>
              </p>
            </>
          }
        />
        <div class="block-guide-documentation">
          <div class="blocks-doc-body">
            <LibraryGuideSection id="library-items" title="Find Your Next Component">
              <div class="block-guide-prose">
                <p>
                  <strong>Browse the Complete Library.</strong> Each entry opens its installation
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
                label="All Components"
                items={componentOverviewItems.map(({ label, slug }) => ({
                  label,
                  href: slug ? `/docs/${slug}/installation` : undefined,
                }))}
              />
            </LibraryGuideSection>
            <ComponentOverviewGuide />
            {showMotion && (
              <LibraryGuideSection id="motion-components" title="Add Purposeful Motion">
                <div class="block-guide-prose">
                  <p>
                    <strong>Build the Interaction First, Then Add Motion.</strong> Explore{" "}
                    <PathDisplay path={"@kamod-ch/ui-motion"} /> when a transition helps explain
                    what changed. Keep content usable without animation, check focus through state
                    changes and respect <code>prefers-reduced-motion</code>.
                  </p>
                </div>
                <LibraryGrid
                  label="Motion Components"
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
