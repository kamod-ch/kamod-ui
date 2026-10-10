import { withBasePath } from "../../base-path";
import { CodeBlock } from "../../docs/components/CodeBlock";
import type { ApplicationShellBlock } from "../application-shell-config";
import { type ShellVariantId, shellVariantGuides } from "./application-shell-profiles";
import { shellUsageCode } from "./application-shell-usage-code";
import { BlockDocSection, BlockGuideHeading } from "./BlockDocumentation";

/** Usage guidance shared by the data-driven application shell variants. */
export function ShellVariantUsage({ block }: { block: ApplicationShellBlock }) {
  const id = block.id as ShellVariantId;
  const profile = shellVariantGuides[id];
  const number = id.split("-").at(-1);
  return (
    <BlockDocSection
      id="application-shell-usage"
      introduction={
        <p>
          <strong>Give the Frame Real Data; Keep Services in Your App.</strong> Supply the four
          required props—<code>brand</code>, <code>navigationGroups</code>, <code>user</code> and{" "}
          <code>breadcrumbs</code>—then place the route’s content inside the shell. It already
          provides <code>main</code>.
        </p>
      }
    >
      <BlockGuideHeading id="application-shell-render" />
      <CodeBlock language="tsx" filePath="src/App.tsx" code={shellUsageCode(id)} />
      <p>
        The example accepts routing and account callbacks from its parent. Ordinary links work
        without <code>onNavigate</code>. If your router intercepts navigation, preserve modified
        clicks and call <code>preventDefault()</code> only for the primary clicks it handles. Keep{" "}
        <code>currentPath</code> synchronized with the actual route and supply an explicit{" "}
        <code>active</code> flag when exact URL matching is insufficient.
      </p>
      {number === "7" && (
        <p>
          <strong>Derive both navigation levels from the same route.</strong> Keep project-specific
          destinations in <code>sectionLinks</code> and use{" "}
          <code>sectionLabel="Project sections"</code> to distinguish their landmark. An explicit{" "}
          <code>active</code> value overrides exact path matching, including <code>false</code>. For
          nested routes, derive that flag from your router’s match result rather than a local click
          counter.
        </p>
      )}
      {number === "8" && (
        <p>
          <strong>The footer is outside the form, but its buttons still submit it.</strong> The
          shared <code>formId</code> connects <code>type="submit"</code> and{" "}
          <code>type="reset"</code> controls to the form. Required-field validation runs before
          submission. The example saves in memory; update the saved baseline only after your service
          confirms success, retain the draft on failure, and disable duplicate submissions while
          pending. The shell creates neither requests nor timers.
        </p>
      )}
      <BlockGuideHeading id="application-shell-connect" />
      <p>
        Replace the sample identity with account data from your session layer.{" "}
        <code>onUserAction</code> reports <code>account</code>, <code>billing</code>,{" "}
        <code>notifications</code> or <code>logout</code>; none of these operations is implemented
        by the shell. A hidden navigation link is not an authorization boundary. Your application
        and service still decide which records and actions are available.
      </p>
      <p>
        Keep page queries and mutations outside the frame. Pass the current route’s loading, empty,
        failure and successful content through <code>children</code>. Use{" "}
        <a href={withBasePath("/docs/forms#form-submission")}>Submission and Recovery</a> for saves,
        and <a href={withBasePath("/docs/getting-started#give-state-one-owner")}>State Ownership</a>{" "}
        when a value appears in more than one panel.
      </p>
      <BlockGuideHeading id="application-shell-state" />
      <p>{profile.responsive}</p>
      {number !== "4" && (
        <CodeBlock
          language="tsx"
          code={`import { useState } from "preact/hooks";
import { ApplicationShell${number}, type ApplicationShell${number}Props } from "./components/application-shell/${id}";

type WorkspaceProps = Omit<ApplicationShell${number}Props, "open" | "defaultOpen" | "onOpenChange">;

export function ControlledWorkspace(props: WorkspaceProps) {
  const [open, setOpen] = useState(${number === "3" ? "false" : "true"});
  return <ApplicationShell${number} {...props} open={open} onOpenChange={setOpen} />;
}`}
        />
      )}
      {number === "6" && (
        <p>
          <strong>Keep Persistent Drafts above the Inspector.</strong> The details panel starts
          visible when supplied and its visibility is local to the frame. Closing unmounts its
          children; lifting draft state into the route lets those values survive closing and
          reopening. Omit <code>inspector</code> to remove both the panel and its toggle.
        </p>
      )}
    </BlockDocSection>
  );
}
