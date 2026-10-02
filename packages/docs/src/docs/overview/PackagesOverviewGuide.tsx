import { withBasePath } from "../../base-path";
import { BlockHeadingLink } from "../../blocks/BlockHeadingLink";
import { CodeBlock } from "../components/CodeBlock";
import { LibraryGuideSection } from "../components/LibraryGuideSection";
import { OverviewExamples } from "../components/OverviewExamples";
import { PackageOverviewPreview } from "./OverviewPreviews";
import { packageExamples } from "./overview-examples";

/** Package guidance distinguishes responsibilities without prescribing an entire stack. */
export function PackagesOverviewGuide() {
  return (
    <>
      <LibraryGuideSection id="choose-packages" title="Choose the smallest useful package set">
        <div class="block-guide-prose">
          <p>
            <strong>Start with a capability, not a dependency list.</strong> The packages can be
            used independently. A local boolean does not require a store, and an icon does not
            require a persistence layer. Identify the problem your application has today, then
            follow that package’s installation and usage documentation.
          </p>
          <p>
            The directory above separates responsibilities. Keep those boundaries clear when you
            combine libraries: a hook manages nearby behavior, a store coordinates domain changes,
            and persistence decides what survives beyond the current session.
          </p>
        </div>
        <div class="block-guide-prose">
          <h3 id="package-boundaries">
            <BlockHeadingLink id="package-boundaries">
              Keep one owner for each responsibility
            </BlockHeadingLink>
          </h3>
          <dl class="package-decision-list">
            <div>
              <dt>Is the behavior local?</dt>
              <dd>
                Start with <code>useState</code>. Reach for{" "}
                <a href={withBasePath("/docs/hooks-package/installation")}>Hooks</a> when the same
                behavior repeats across components.
              </dd>
            </div>
            <div>
              <dt>Does it need to survive a reload?</dt>
              <dd>
                Explore <a href={withBasePath("/docs/signals-package/installation")}>Signals</a>.
                Define the storage key, initial value and reset behavior together.
              </dd>
            </div>
            <div>
              <dt>Do several actions change one model?</dt>
              <dd>
                Explore <a href={withBasePath("/docs/state-package/installation")}>State</a>. Make
                transitions explicit and keep derived values out of storage.
              </dd>
            </div>
          </dl>
          <p>
            These approaches can coexist, but do not mirror the same value in several places without
            a clear synchronization contract.{" "}
            <strong>One source of truth is easier to test and restore.</strong> Keep derived values
            derived, and store only the minimum data required to reconstruct the interface.
          </p>
        </div>
      </LibraryGuideSection>
      <LibraryGuideSection id="package-examples" title="Try one capability at a time">
        <div class="block-guide-prose">
          <p>
            These examples build on an existing <code>Preact</code> and Kamod UI setup. Install the
            selected package and its required peers before copying the source. Use the paths as a
            suggestion; keep your app’s own module organization and public import conventions.
          </p>
          <p>
            <strong>The live hook example is deliberately local.</strong> It lets you inspect state
            and keyboard behavior without changing storage or contacting a service. The persistence
            example is copyable source with a client-rendering assumption, not a setting for this
            docs site.
          </p>
        </div>
        <OverviewExamples
          label="Package examples"
          examples={packageExamples}
          preview={(id) => (id === "hooks" ? <PackageOverviewPreview /> : null)}
        />
      </LibraryGuideSection>
      <LibraryGuideSection
        id="package-integration"
        title="Integrate with the project you already have"
      >
        <div class="block-guide-prose">
          <h3 id="package-installation">
            <BlockHeadingLink id="package-installation">
              Check versions, peers and entry points
            </BlockHeadingLink>
          </h3>
          <p>
            Inspect <code>package.json</code> and the lockfile before adding dependencies. Reuse
            your existing package manager, check peer requirements and install only what is missing.
            In a workspace, add the package to the app that imports it rather than assuming the
            repository root supplies it everywhere.
          </p>
          <p>
            For a pnpm project, the following commands help inspect an existing dependency and add
            the hooks package if needed. Other package managers have equivalent commands. Follow the
            <a href={withBasePath("/docs/hooks-package/installation")}>
              {" "}
              package installation guide
            </a>{" "}
            for its full setup and verify that your existing Preact version satisfies the
            requirement.
          </p>
        </div>
        <CodeBlock
          language="bash"
          filePath="Terminal"
          code={`# Inspect the existing dependency before adding another copy.\npnpm why @kamod-ch/hooks\n\n# Add only if the application does not already declare it.\npnpm add @kamod-ch/hooks`}
        />
        <div class="block-guide-prose">
          <h3 id="package-imports">
            <BlockHeadingLink id="package-imports">
              Keep imports explicit and documented
            </BlockHeadingLink>
          </h3>
          <p>
            Use published entry points, such as <code>@kamod-ch/icons/lucide</code>, instead of
            importing a file from a package’s internal source tree. Internal layouts can change
            independently of the public API. Copy an icon’s exact exported name from its catalog and
            verify the current hook signature instead of assuming it matches a similarly named React
            library.
          </p>
          <p>
            Named imports make intent easy to review. Avoid constructing a registry that eagerly
            imports every icon just to render one name. Inspect your production output when bundle
            size matters; <strong>an import style alone is not a measurement</strong>.
          </p>
          <p>
            Hooks, state and translation logic do not replace your global UI stylesheet. Keep the
            <a href={withBasePath("/docs/theming/css-setup")}> CSS setup</a> for Kamod components in
            place, and use semantic tokens when styling UI built around a package.
          </p>
        </div>
      </LibraryGuideSection>
      <LibraryGuideSection id="package-lifecycle" title="Plan for reloads, requests and cleanup">
        <div class="block-guide-prose">
          <h3 id="package-persistence">
            <BlockHeadingLink id="package-persistence">
              Make persistence an explicit decision
            </BlockHeadingLink>
          </h3>
          <p>
            Persist a preference because the user expects it to survive, not because every state
            value can be saved. Choose a storage driver that fits the lifetime: a local browser
            preference, a session value and server-readable cookie state have different tradeoffs.
            Namespace keys, define defaults and decide how reset works before shipping.
          </p>
          <p>
            Stored values may be absent, malformed or written by an older version. Validate their
            shape and plan a migration when it changes. Treat browser storage as untrusted input and
            keep sensitive account data in the appropriate application service. Test with storage
            blocked as well as with a fresh profile.
          </p>
          <h3 id="package-ssr">
            <BlockHeadingLink id="package-ssr">Keep the first render consistent</BlockHeadingLink>
          </h3>
          <p>
            Browser APIs such as <code>window</code> and <code>localStorage</code> are unavailable
            during server rendering. Follow each package’s server guidance and initialize
            browser-only work at the appropriate client boundary. A fallback that prevents a server
            crash is only part of the job; the initial HTML and hydrated state also need to agree.
          </p>
          <p>
            Keep user-specific stores and locale instances scoped to a request rather than a mutable
            module singleton. For <code>@kamod-ch/i18n</code>, align the server and client locale,
            make the required messages available for the first render, and update <code>lang</code>
            and direction when the locale changes. Include translated labels and errors, not just
            visible headings.
          </p>
          <h3 id="package-cleanup">
            <BlockHeadingLink id="package-cleanup">Give long-lived work an owner</BlockHeadingLink>
          </h3>
          <p>
            Use a hook’s built-in lifecycle behavior when it fits. When you add your own listeners,
            observers, timers or subscriptions, remove them when their owner unmounts or their
            inputs change. Cancel obsolete requests where supported and prevent stale responses from
            replacing newer data.
          </p>
          <p>
            <strong>Verify navigation away as well as navigation in.</strong> Repeatedly mount and
            unmount the feature, switch routes during a pending operation and confirm callbacks do
            not accumulate. Use component-scoped helpers when they match the lifetime instead of
            creating a new global controller during every render.
          </p>
        </div>
      </LibraryGuideSection>
    </>
  );
}

export function PackagesOverviewReview() {
  return (
    <LibraryGuideSection id="package-review" title="Verify the integration, not just the import">
      <div class="block-guide-prose">
        <p>
          A successful import confirms that a module resolves. It does not confirm that state,
          persistence or rendering behaves correctly in your app. Check the{" "}
          <strong>whole lifecycle</strong> before you consider the integration complete.
        </p>
        <ol class="package-review-list">
          <li>
            <strong>Dependencies.</strong> Confirm the owning workspace declares the package and its
            peers. Review the lockfile diff and verify that no unintended runtime or duplicate
            framework was introduced.
          </li>
          <li>
            <strong>Behavior.</strong> Test the state transitions your screen relies on, including
            retry, reset and cancellation. Keep accessible labels and control state synchronized.
          </li>
          <li>
            <strong>Environment.</strong> Try a direct route load, a refresh and client navigation.
            For SSR, check hydration; for persistence, check missing and older stored values.
          </li>
          <li>
            <strong>Lifecycle.</strong> Leave the screen while work is pending. Confirm listeners,
            timers and observers are cleaned up, and that returning does not double the callbacks.
          </li>
          <li>
            <strong>Production.</strong> Run the project’s typecheck, relevant tests and build.
            Inspect the generated bundle when size matters and verify the built app with its actual
            routes, assets and deployment base path.
          </li>
        </ol>
        <p>
          When reporting an issue, include the package version, the relevant import, runtime or
          browser and a small reproduction. Each package’s documentation links to its own source and
          issue tracker. Use the <a href={withBasePath("/docs/components")}>component library</a> to
          turn the behavior into a consistent, accessible interface.
        </p>
      </div>
    </LibraryGuideSection>
  );
}
