import { withBasePath } from "../../base-path";
import { CodeBlock } from "../../docs/components/CodeBlock";
import { BlockDocSection, BlockGuideHeading } from "./BlockDocumentation";
import { ShellReleaseChecks } from "./ShellReleaseChecks";
import type { BlockGuideSection } from "./types";

/** Production boundaries shared by all application shells, including the original composition. */
function ShellProductionGuide() {
  return (
    <BlockDocSection
      id="application-shell-production"
      introduction={
        <p>
          <strong>Turn the working preview into a dependable application boundary.</strong> Add one
          real route and one service-backed action before expanding the navigation. The frame
          supplies structure; your application owns identity, permissions, records and recovery.
        </p>
      }
    >
      <BlockGuideHeading id="application-shell-route-lifetime" />
      <p>
        <strong>Mount the shell above the changing page.</strong> Replacing <code>children</code>{" "}
        should not recreate the sidebar provider on every route. Keep the same component type and
        avoid a route-dependent <code>key</code> on the shell when users expect their desktop
        collapse choice to survive. Derive <code>currentPath</code>, breadcrumbs and navigation
        permissions from the router/session rather than synchronizing another selected-item state.
      </p>
      <p>
        Use stable IDs for navigation groups and items. Build static navigation outside the
        component; use <code>useMemo</code> only when its inputs actually change, such as a project
        ID, locale or permissions. Do not put draft text in those dependencies. Native links remain
        useful without a router callback; intercept only the clicks your client router handles and
        preserve modified clicks for opening another tab.
      </p>
      <p>
        Keep the final breadcrumb descriptive and noninteractive. Pass an empty trail for pages that
        do not need one. Each shell already supplies a <code>main</code> landmark: start page
        content with its heading or a section, not a second nested <code>main</code>. Review{" "}
        <a href={withBasePath("/docs/getting-started#give-state-one-owner")}>State Ownership</a>{" "}
        before moving values into global state.
      </p>
      <BlockGuideHeading id="application-shell-data-lifetime" />
      <p>
        <strong>Cancel work when its owning route changes.</strong> The shell does not fetch records
        or install polling timers. A page that fetches project data should release its request,
        subscription or observer when it unmounts or changes record. Keep pending and error states
        next to the action that creates them, and update a saved baseline only after the server
        confirms the write.
      </p>
      <p>
        This effect belongs in a route component with <code>projectId</code>,{" "}
        <code>setProject</code> and <code>setError</code> supplied by that page. Import{" "}
        <code>useEffect</code> from <code>preact/hooks</code>. The cancellation guard prevents an
        obsolete response from replacing a newer project:
      </p>
      <CodeBlock
        language="tsx"
        code={`useEffect(() => {
  const request = new AbortController();
  async function loadProject() {
    try {
      const response = await fetch("/api/projects/" + encodeURIComponent(projectId), {
        signal: request.signal,
      });
      if (!response.ok) throw new Error("Project could not be loaded.");
      const project = await response.json();
      if (!request.signal.aborted) setProject(project);
    } catch (error) {
      if (!request.signal.aborted) setError(error);
    }
  }
  void loadProject();
  return () => request.abort();
}, [projectId]);`}
      />
      <p>
        Validate returned data at your service boundary. Clear the previous error and choose whether
        to keep stale content or display a loading state when the route changes. Aborting a browser
        request does not undo a server-side mutation; use your service’s retry and deduplication
        policy for saves. See{" "}
        <a href={withBasePath("/docs/forms#form-submission")}>Submission and Recovery</a> for
        preserving edits after a failed submission.
      </p>
      <BlockGuideHeading id="application-shell-release-checks" />
      <ShellReleaseChecks />
    </BlockDocSection>
  );
}

export const shellProductionSection: BlockGuideSection = {
  id: "application-shell-production",
  label: "Prepare for Production",
  eyebrow: "Production Readiness",
  Content: ShellProductionGuide,
  children: [
    { id: "application-shell-route-lifetime", label: "Routes and State Ownership" },
    { id: "application-shell-data-lifetime", label: "Requests and Cleanup" },
    { id: "application-shell-release-checks", label: "Release Checks" },
  ],
};
