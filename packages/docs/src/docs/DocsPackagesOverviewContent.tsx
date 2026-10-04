import { libraryResourceContents } from "./components/LibraryDirectoryResources";
import { LibraryGuideSection } from "./components/LibraryGuideSection";
import { LibraryOverviewGuide } from "./components/LibraryOverviewGuide";
import { PathDisplay } from "./components/PathDisplay";
import { PackageDirectory, PackageFoundations } from "./overview/PackageOverviewResources";
import { PackagesOverviewGuide, PackagesOverviewReview } from "./overview/PackagesOverviewGuide";
import { packageDocPages } from "./registry";

const contents = [
  { id: "library-items", label: "All packages" },
  {
    id: "choose-packages",
    label: "Choose your packages",
    children: [{ id: "package-boundaries", label: "Clear responsibilities" }],
  },
  { id: "package-examples", label: "Working examples" },
  {
    id: "package-integration",
    label: "Project integration",
    children: [
      { id: "package-installation", label: "Versions & peers" },
      { id: "package-imports", label: "Public imports" },
    ],
  },
  {
    id: "package-lifecycle",
    label: "Persistence & lifecycle",
    children: [
      { id: "package-persistence", label: "Storage decisions" },
      { id: "package-ssr", label: "Server & first render" },
      { id: "package-cleanup", label: "Cleanup & ownership" },
    ],
  },
  { id: "package-review", label: "Review the integration" },
  { ...libraryResourceContents, label: "Connect the interface" },
];

/** Package discovery and integration guidance use the same shell as Components and block guides. */
export const DocsPackagesOverviewContent = () => (
  <LibraryOverviewGuide
    scope="packages"
    label="Packages"
    title="Focused packages for the rest of your Preact app"
    focus="Choose · Integrate · Verify"
    contents={contents}
    jumps={[
      { id: "library-items", label: "All packages" },
      { id: "package-examples", label: "Working examples" },
      { id: "package-integration", label: "Integration guide" },
    ]}
    description={
      <>
        <p>
          Explore {packageDocPages.length} standalone Kamod packages for{" "}
          <strong>behavior, state, icons and localization</strong>. Add the capability your project
          needs without replacing the rest of your stack. Each entry leads to installation steps,
          usage guidance and the package’s dedicated documentation, with <code>Preact</code> as the
          common UI foundation.
        </p>
        <p>
          <strong>Choose one package, try one example, then connect it to your app.</strong> Use the{" "}
          <a href="#choose-packages">selection guide</a> to separate local behavior from shared
          state and persistence. Each package guide includes setup, working patterns and links to
          its own source and API documentation.
        </p>
      </>
    }
  >
    <LibraryGuideSection id="library-items" title="Find the capability your app needs">
      <div class="block-guide-prose">
        <p>
          These libraries are <strong>independent companions</strong> to{" "}
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
