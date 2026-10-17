import { withBasePath } from "../../base-path";
import { InlineCodeLink } from "../../docs/components/InlineCodeLink";

/** Workflow-specific guidance; shared setup and API sections complete each variant page. */
export const workflowShellProfiles = {
  "application-shell-7": {
    layout: "sections",
    name: "Sectioned Workspace",
    purpose: (
      <>
        Keep <strong>global destinations and project sections</strong> at distinct levels. The
        sidebar answers “where am I working?” while the compact navigation beneath the header
        answers “which part of this project am I viewing?”
      </>
    ),
    fit: (
      <>
        Choose this shell for{" "}
        <strong>project spaces, team administration and settings areas</strong> with a handful of
        related routes. Use <code>sectionLinks</code> for Overview, Activity and Members while
        keeping Projects and Settings in <code>navigationGroups</code>. Avoid repeating every global
        link in both places; each level should have a clear job.
      </>
    ),
    structure: (
      <>
        The contextual row is an independently named <code>nav</code> inside the existing{" "}
        <code>main</code> landmark. It uses native links and the same <code>onNavigate</code>{" "}
        callback as the sidebar. These are <strong>route destinations, not in-page tabs</strong>:
        browser history and modified clicks remain available. Use{" "}
        <InlineCodeLink href="/docs/tabs/installation">Tabs</InlineCodeLink> inside your page
        instead when the panels share one route and require tablist keyboard behavior.
      </>
    ),
    responsive: (
      <>
        The global sidebar collapses to icons on desktop and becomes a left-side{" "}
        <InlineCodeLink href="/docs/sheet/installation">Sheet</InlineCodeLink> below{" "}
        <code>768px</code>. Contextual links stay visible and wrap onto another line as needed; long
        individual labels truncate without removing their accessible names. Keep this list short
        enough to scan. Supply an empty array to omit the entire secondary landmark.
      </>
    ),
    styling: (
      <>
        Contextual navigation uses <code>Button</code> ghost and secondary variants, a subtle bottom
        border and the same content gutter as the header. The active item follows{" "}
        <code>currentPath</code>; explicit <code>active</code> overrides exact matching. Use the
        override for nested project routes rather than maintaining a second local selected index.
        Disabled destinations remain buttons and do not announce themselves as the current page.
      </>
    ),
    review: (
      <>
        Open each section with the keyboard and confirm the{" "}
        <strong>URL, breadcrumb and page content agree</strong>. Try a modified click on a native
        link, a disabled section, an empty list and a translated long label. Keep a draft above the
        changing page when section navigation should preserve it; the shell does not cache route
        content or fetch project records.
      </>
    ),
    next: (
      <>
        Use{" "}
        <a
          href={withBasePath(
            "/blocks/application-shell/application-shell-4#application-shell-about",
          )}
        >
          Shell 4
        </a>{" "}
        when a single horizontal level is sufficient, or{" "}
        <a
          href={withBasePath(
            "/blocks/application-shell/application-shell-8#application-shell-about",
          )}
        >
          Shell 8
        </a>{" "}
        when a long settings page needs persistent save controls.
      </>
    ),
  },
  "application-shell-8": {
    layout: "actions",
    name: "Persistent Action Workspace",
    purpose: (
      <>
        Give long forms a <strong>stable place for save actions and feedback</strong>. A sticky
        footer keeps the next action within reach while the sidebar, breadcrumbs and page content
        retain their familiar structure.
      </>
    ),
    fit: (
      <>
        Choose this composition for{" "}
        <strong>workspace settings, approval flows and record editors</strong> that need Save,
        Discard or Publish beside a concise status message. The footer is a slot for application
        controls, not a built-in submission engine. For a short read-only dashboard, omit both slots
        or start with{" "}
        <a
          href={withBasePath(
            "/blocks/application-shell/application-shell-2#application-shell-about",
          )}
        >
          Shell 2
        </a>{" "}
        instead.
      </>
    ),
    structure: (
      <>
        The footer follows the page content in document order and uses <code>position: sticky</code>{" "}
        with <code>bottom: 0</code>. It stays in normal flow, so the final content is not hidden
        behind a fixed overlay. Use <code>footerActions</code> for buttons and{" "}
        <code>footerStatus</code> for a short message. Both slots are optional; omitting both
        removes the footer entirely.
      </>
    ),
    responsive: (
      <>
        The sidebar uses the familiar desktop collapse and independent mobile sheet. Footer text and
        controls wrap on narrow screens, retaining full button labels and keyboard order. Sticky
        positioning follows the nearest scrolling ancestor; avoid introducing an accidental{" "}
        <code>overflow: hidden</code> wrapper. Test with the mobile keyboard open and with longer
        localized action labels.
      </>
    ),
    styling: (
      <>
        A solid semantic <code>bg-background</code> surface and <code>border-t</code> separate the
        action bar from the page without another theme provider. Keep one primary action and one
        quieter alternative. Use the shared{" "}
        <InlineCodeLink href="/docs/button/installation">Button</InlineCodeLink> disabled/loading
        states and <InlineCodeLink href="/docs/spinner/installation">Spinner</InlineCodeLink> when a
        request is pending; do not recolor the entire footer for every state change.
      </>
    ),
    review: (
      <>
        Edit a required field, submit invalid data, correct it, save and then discard another edit.
        Confirm <strong>native validation runs before the save handler</strong>. Associate a footer
        submit button with the page form using <code>form</code> and a unique <code>id</code>. The
        preview saves only in memory; production must retain failed drafts, block duplicate requests
        and announce the result through an application-owned <code>role="status"</code> message.
      </>
    ),
    next: (
      <>
        Read <a href={withBasePath("/docs/forms#form-submission")}>Submission and Recovery</a> for
        the service boundary. Choose{" "}
        <a
          href={withBasePath(
            "/blocks/application-shell/application-shell-6#application-shell-about",
          )}
        >
          Shell 6
        </a>{" "}
        for a contextual inspector, or{" "}
        <a
          href={withBasePath(
            "/blocks/application-shell/application-shell-7#application-shell-about",
          )}
        >
          Shell 7
        </a>{" "}
        for route-level settings sections.
      </>
    ),
  },
} as const;
