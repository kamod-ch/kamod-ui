import { BrandText } from "./components/brand/BrandText";
import { libraryResourceContents } from "./components/LibraryDirectoryResources";
import { LibraryGuideSection } from "./components/LibraryGuideSection";
import { LibraryOverviewGuide } from "./components/LibraryOverviewGuide";
import { PathDisplay } from "./components/PathDisplay";
import { PackageDirectory, PackageFoundations } from "./overview/PackageOverviewResources";
import { PackagesOverviewGuide, PackagesOverviewReview } from "./overview/PackagesOverviewGuide";
import { packageDocPages } from "./package-pages";

const contents = [
  { id: "library-items", label: "All Packages" },
  {
    id: "choose-packages",
    label: "Choose Your Packages",
    children: [{ id: "package-boundaries", label: "Clear Responsibilities" }],
  },
  { id: "package-examples", label: "Working Examples" },
  {
    id: "package-integration",
    label: "Project Integration",
    children: [
      { id: "package-installation", label: "Versions & Peers" },
      { id: "package-imports", label: "Public Imports" },
    ],
  },
  {
    id: "package-lifecycle",
    label: "Persistence & Lifecycle",
    children: [
      { id: "package-persistence", label: "Storage Decisions" },
      { id: "package-ssr", label: "Server & First Render" },
      { id: "package-cleanup", label: "Cleanup & Ownership" },
    ],
  },
  { id: "package-review", label: "Review the Integration" },
  { ...libraryResourceContents, label: "Connect the Interface" },
];

/** Package discovery and integration guidance use the same shell as Components and block guides. */
export const DocsPackagesOverviewContent = () => (
  <LibraryOverviewGuide
    scope="packages"
    label="Packages"
    title="Focused Packages for the Rest of Your Preact App"
    focus="Choose · Integrate · Verify"
    contents={contents}
    description={
      <>
        <p>
          <BrandText>
            Explore {packageDocPages.length} standalone Kamod packages for{" "}
            <strong>Behavior, State, Icons and Localization</strong>. Add the capability your
            project needs without replacing the rest of your stack. Each entry leads to installation
            steps, usage guidance and the package’s dedicated documentation, with{" "}
            <code>Preact</code> as the common UI foundation.
          </BrandText>
        </p>
        <p>
          <strong>Choose One Package, Try One Example, Then Connect It to Your App.</strong> Use the{" "}
          <a href="#choose-packages">Selection Guide</a> to separate local behavior from shared
          state and persistence. Each package guide includes setup, working patterns and links to
          its own source and API documentation.
        </p>
      </>
    }
  >
    <LibraryGuideSection id="library-items" title="Find the Capability Your App Needs">
      <div class="block-guide-prose">
        <p>
          These libraries are <strong>Independent Companions</strong> to{" "}
          <PathDisplay path={"@kamod-ch/ui"} />. Choose the responsibility you need below; each
          guide takes you from installation to practical examples. You do not need to install the
          whole collection.
        </p>
      </div>
      <PackageDirectory />
    </LibraryGuideSection>
    <PackagesOverviewGuide />
    <PackagesOverviewReview />
    <PackageFoundations />
  </LibraryOverviewGuide>
);
