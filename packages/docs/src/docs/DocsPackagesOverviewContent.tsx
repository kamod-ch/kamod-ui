import { withBasePath } from "../base-path";
import { LibraryGrid } from "./components/LibraryDirectory";
import {
  LibraryDirectoryResources,
  libraryResourceContents,
} from "./components/LibraryDirectoryResources";
import { LibraryGuideSection } from "./components/LibraryGuideSection";
import { LibraryOverviewGuide } from "./components/LibraryOverviewGuide";
import { PackagesOverviewGuide, PackagesOverviewReview } from "./overview/PackagesOverviewGuide";
import { packageDocPages } from "./registry";

const packages = [...packageDocPages].sort((a, b) => a.title.localeCompare(b.title));
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
  libraryResourceContents,
  { id: "package-review", label: "Review the integration" },
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
      { id: "library-guides", label: "Setup & theming" },
    ]}
    description={
      <>
        <p>
          Explore {packages.length} standalone Kamod packages for{" "}
          <strong>behavior, state, icons and localization</strong>. Add the capability your project
          needs without replacing the rest of your stack. Each entry leads to installation steps,
          usage guidance and the package’s dedicated documentation, with <code>Preact</code> as the
          common UI foundation.
        </p>
        <p>
          Use the selection guide to separate local behavior from shared state and persistence, then
          try a small example with <code>@kamod-ch/hooks</code>, <code>@kamod-ch/icons</code> or{" "}
          <code>@kamod-ch/signals</code>. Keep imports and peer dependencies explicit, check the
          first render and cleanup, and combine the result with the{" "}
          <a href={withBasePath("/docs/components")}>component library</a> and{" "}
          <a href={withBasePath("/docs/theming/usage")}>shared theme</a>.
        </p>
      </>
    }
  >
    <LibraryGuideSection id="library-items" title="Find the capability your app needs">
      <div class="block-guide-prose">
        <p>
          <strong>Explore the documented packages.</strong> These libraries address different
          responsibilities and can be adopted independently. Open an entry for its install command,
          quick start and links to the full API. Check the documentation against the version
          recorded in your project’s <code>package.json</code> and lockfile.
        </p>
        <p>
          These are companions to <code>@kamod-ch/ui</code>, not an all-or-nothing bundle. Hooks
          help with reusable behavior; Icons supplies visual details; Signals, State and i18n
          address persistence, coordinated transitions and language. The comparison below helps you
          choose where each belongs.
        </p>
      </div>
      <LibraryGrid
        label="All packages"
        items={packages.map((doc) => ({
          label: doc.title,
          href: `/docs/${doc.slug}/installation`,
          detail: doc.usageLabel,
          packagePath: doc.packagePath,
        }))}
      />
    </LibraryGuideSection>
    <PackagesOverviewGuide />
    <LibraryDirectoryResources guide />
    <PackagesOverviewReview />
  </LibraryOverviewGuide>
);
