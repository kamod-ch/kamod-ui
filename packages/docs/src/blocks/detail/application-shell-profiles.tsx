import { withBasePath } from "../../base-path";
import { InlineCodeLink } from "../../docs/components/InlineCodeLink";
import { workflowShellProfiles } from "./application-shell-workflow-profiles";

export const shellVariantGuides = {
  ...workflowShellProfiles,
  "application-shell-2": {
    layout: "inset",
    name: "Inset Workspace",
    purpose: (
      <>
        Separate the application’s frame from the page without introducing a second theme. An{" "}
        <strong>inset content surface</strong> gives projects, settings and dashboards a clear
        boundary while the navigation remains part of the surrounding workspace.
      </>
    ),
    fit: (
      <>
        Choose this composition for a product with several related screens and a{" "}
        <strong>stable, grouped navigation model</strong>. The visible inset is useful when page
        content has its own cards or forms: the shell defines the workspace and those components
        describe individual tasks.
      </>
    ),
    structure: (
      <>
        The <InlineCodeLink href="/docs/sidebar/installation">Sidebar</InlineCodeLink> uses its
        inset variant.{" "}
        <InlineCodeLink href="/docs/sidebar/installation">SidebarInset</InlineCodeLink> supplies the
        single <code>main</code> landmark and receives the primitive’s desktop margin, rounded
        corners and surface treatment. The header and the route content remain inside that surface;
        the brand and account actions stay in the surrounding sidebar.
      </>
    ),
    responsive: (
      <>
        At desktop widths the sidebar starts expanded and can collapse to icons. Below{" "}
        <code>768px</code> it becomes the existing left-side{" "}
        <InlineCodeLink href="/docs/sheet/installation">Sheet</InlineCodeLink>; the inset desktop
        margins disappear so the page keeps the available width. Do not reproduce those margins
        inside every route.
      </>
    ),
    styling: (
      <>
        Use sidebar tokens for the outer frame and background/card token pairs for the route. Keep a
        consistent content gutter instead of adding a second padded wrapper around every page. Check
        dense tables and long forms inside the inset, not only a dashboard with short cards.
      </>
    ),
    review: (
      <>
        Collapse the sidebar, open a nested destination from its icon menu, then expand it again.
        The route, breadcrumb and draft content should <strong>remain intact</strong>. On mobile,
        select a destination and confirm the sheet closes before continuing the task.
      </>
    ),
    next: (
      <>
        Use{" "}
        <a
          href={withBasePath(
            "/blocks/application-shell/application-shell-3#application-shell-about",
          )}
        >
          Shell 3
        </a>{" "}
        when the page benefits from a compact initial rail, or{" "}
        <a
          href={withBasePath(
            "/blocks/application-shell/application-shell-4#application-shell-about",
          )}
        >
          Shell 4
        </a>{" "}
        when a short, flat destination list works better above the content.
      </>
    ),
  },
  "application-shell-3": {
    layout: "rail",
    name: "Compact Navigation Rail",
    purpose: (
      <>
        Give the page most of the available width from the first render. The shell begins with a{" "}
        <strong>compact icon rail</strong>, while every destination retains a label through
        tooltips, accessible names and the expanded navigation view.
      </>
    ),
    fit: (
      <>
        Choose the rail for <strong>frequent users</strong> moving between a familiar set of tools,
        especially editors, deployment consoles and data-heavy pages. Keep an expanded alternative
        available when names are unfamiliar or several destinations have similar icons.
      </>
    ),
    structure: (
      <>
        The same <InlineCodeLink href="/docs/sidebar/installation">SidebarProvider</InlineCodeLink>{" "}
        and nested-menu adapters used by{" "}
        <a
          href={withBasePath(
            "/blocks/application-shell/application-shell-1#application-shell-about",
          )}
        >
          Shell 1
        </a>{" "}
        own interaction. This composition changes the{" "}
        <strong>initial desktop expansion to false</strong>. Collapsed branches use portaled menus
        so the navigation’s scroll container cannot cut off their destinations.
      </>
    ),
    responsive: (
      <>
        <strong>Desktop navigation starts collapsed</strong> unless <code>defaultOpen</code> or{" "}
        <code>open</code> overrides it. The header toggle expands it into labeled groups.{" "}
        <strong>Mobile navigation is independent</strong>: even when desktop <code>open</code> is
        false, the trigger opens a fully labeled left-side{" "}
        <InlineCodeLink href="/docs/sheet/installation">Sheet</InlineCodeLink> rather than an
        icon-only mobile rail.
      </>
    ),
    styling: (
      <>
        Choose a recognizable icon for each primary destination and keep the same icon family. The
        core sidebar controls rail width; avoid setting a separate width on the content to
        compensate. Use supported size and variant props inside the page rather than shrinking all
        controls to match the rail.
      </>
    ),
    review: (
      <>
        Open the Library branch with the keyboard while collapsed, move between its menu items and
        dismiss it with Escape. Verify focus returns to the branch trigger. Then test an expanded
        branch and a mobile destination; each presentation must reach the{" "}
        <strong>same location</strong>.
      </>
    ),
    next: (
      <>
        Use{" "}
        <a
          href={withBasePath(
            "/blocks/application-shell/application-shell-2#application-shell-about",
          )}
        >
          Shell 2
        </a>{" "}
        for a more visible navigation <strong>hierarchy</strong>, or{" "}
        <a
          href={withBasePath(
            "/blocks/application-shell/application-shell-6#application-shell-about",
          )}
        >
          Shell 6
        </a>{" "}
        when the task also needs contextual information beside its main working area.
      </>
    ),
  },
  "application-shell-4": {
    layout: "horizontal",
    name: "Horizontal Workspace",
    purpose: (
      <>
        Put a small destination set above a centered page and give the content the{" "}
        <strong>full workspace width</strong>. Desktop account actions share the top bar; mobile
        navigation moves into the same accessible sidebar sheet used by the other shells.
      </>
    ),
    fit: (
      <>
        Choose this composition for a team hub, compact internal tool or workspace with a{" "}
        <strong>short destination list</strong>. The desktop row flattens grouped child destinations
        into labeled links. If that <strong>hierarchy</strong> must remain visibly grouped, choose a
        sidebar shell instead.
      </>
    ),
    structure: (
      <>
        The desktop header carries identity, breadcrumbs and the account menu. A separate Workspace
        navigation landmark displays the supplied destinations below it, followed by a max-width
        content area. On mobile the desktop destination row and account menu are hidden and the
        sidebar provides those controls together.
      </>
    ),
    responsive: (
      <>
        At <code>768px</code> and above the destination row wraps instead of forcing the document to
        scroll sideways. Below that breakpoint the header trigger opens mobile navigation. There is{" "}
        <strong>no desktop collapse control</strong>, and the public props deliberately omit{" "}
        <code>open</code>, <code>defaultOpen</code> and <code>onOpenChange</code>.
      </>
    ),
    styling: (
      <>
        Keep primary destinations short and meaningful, using active labels as well as color to
        communicate location. The page already has a centered maximum width and responsive gutters.
        Full-bleed dashboards that need more room are better suited to{" "}
        <a
          href={withBasePath(
            "/blocks/application-shell/application-shell-3#application-shell-about",
          )}
        >
          Shell 3
        </a>{" "}
        or a deliberate change to the copied frame.
      </>
    ),
    review: (
      <>
        Follow a desktop destination, confirm aria-current changes, then repeat the same journey
        through the mobile <InlineCodeLink href="/docs/sheet/installation">Sheet</InlineCodeLink>.
        Test a long brand name and enough destinations to wrap to a second row. Disabled entries
        must remain unavailable in <strong>both presentations</strong>.
      </>
    ),
    next: (
      <>
        Use{" "}
        <a
          href={withBasePath(
            "/blocks/application-shell/application-shell-2#application-shell-about",
          )}
        >
          Shell 2
        </a>{" "}
        when a growing destination tree needs persistent grouping, or{" "}
        <a
          href={withBasePath(
            "/blocks/application-shell/application-shell-5#application-shell-about",
          )}
        >
          Shell 5
        </a>{" "}
        when the task calls for navigation on the opposite side of the content.
      </>
    ),
  },
  "application-shell-5": {
    layout: "right",
    name: "Right-Hand Navigation",
    purpose: (
      <>
        Keep the main working area on the left and place workspace navigation and account tools on
        the right. The layout is useful when the task should dominate the{" "}
        <strong>initial reading edge</strong> while the application frame stays close at hand.
      </>
    ),
    fit: (
      <>
        Choose this composition deliberately for support tools, review queues or{" "}
        <strong>focused workspaces</strong> where the <strong>right edge</strong> is already
        associated with secondary navigation. Confirm the placement with real users; it is a{" "}
        <strong>structural choice</strong> rather than a language-direction switch.
      </>
    ),
    structure: (
      <>
        <InlineCodeLink href="/docs/sidebar/installation">SidebarInset</InlineCodeLink> appears
        before the <InlineCodeLink href="/docs/sidebar/installation">Sidebar</InlineCodeLink> in the
        composition, while the{" "}
        <InlineCodeLink href="/docs/sidebar/installation">Sidebar</InlineCodeLink> receives{" "}
        <code>side=right</code>. This reserves the correct desktop gap and anchors the sidebar to
        the <strong>right edge</strong>. The content still owns the{" "}
        <strong>only main landmark</strong> and its own breadcrumb header.
      </>
    ),
    responsive: (
      <>
        The desktop sidebar starts expanded and collapses toward the <strong>right edge</strong>.
        Below <code>768px</code> navigation opens in a right-side{" "}
        <InlineCodeLink href="/docs/sheet/installation">Sheet</InlineCodeLink> with the same focus
        trap, Escape dismissal and selection behavior. Reading and keyboard order follow the{" "}
        <strong>DOM</strong>: page controls precede desktop sidebar controls.
      </>
    ),
    styling: (
      <>
        Keep sidebar and page token families connected to the same theme. Avoid adding left-side
        offsets from another shell’s stylesheet. This layout does not implement right-to-left
        localization; text direction and translated labels remain a separate application concern.
      </>
    ),
    review: (
      <>
        At mobile width, open navigation and confirm it enters from the right. Dismiss with Escape
        and check the header trigger regains focus. On desktop, collapse and expand while reviewing
        a long conversation or table; the page must resize{" "}
        <strong>without horizontal document overflow</strong>.
      </>
    ),
    next: (
      <>
        Use{" "}
        <a
          href={withBasePath(
            "/blocks/application-shell/application-shell-6#application-shell-about",
          )}
        >
          Shell 6
        </a>{" "}
        if the right-hand area should show contextual details while primary navigation remains on
        the left. Use{" "}
        <a
          href={withBasePath(
            "/blocks/application-shell/application-shell-2#application-shell-about",
          )}
        >
          Shell 2
        </a>{" "}
        for the conventional left-side navigation arrangement.
      </>
    ),
  },
  "application-shell-6": {
    layout: "inspector",
    name: "Split Workspace with Inspector",
    purpose: (
      <>
        Keep a <strong>primary task</strong> and its <strong>supporting context</strong> together.
        Left-side navigation frames the workspace; an optional <code>inspector</code> shows
        ownership, status or document information beside the main working area without turning those
        details into another route.
      </>
    ),
    fit: (
      <>
        Choose this composition for editing, review or record-management tasks where a person needs
        to consult details while working. Supply meaningful <code>inspector</code> content{" "}
        <strong>tied to the selected record</strong>. Leave it out when the task does not benefit
        from an additional panel.
      </>
    ),
    structure: (
      <>
        The route supplies <code>children</code> and an optional <code>inspector</code> slot. The
        header’s named details button toggles that panel, with <code>aria-expanded</code> and{" "}
        <code>aria-controls</code> describing the relationship. An <code>aside</code> with a visible
        heading separates contextual information from the primary content.
      </>
    ),
    responsive: (
      <>
        At <code>1024px</code> and above the visible <code>inspector</code> uses an{" "}
        <code>18rem</code> column beside the page. Below that width it follows the main content in
        normal document flow. It is <strong>not a modal overlay</strong> and does not trap focus.
        The primary sidebar still becomes a left-side{" "}
        <InlineCodeLink href="/docs/sheet/installation">Sheet</InlineCodeLink> below{" "}
        <code>768px</code>.
      </>
    ),
    styling: (
      <>
        Keep the <code>inspector</code> secondary: a muted semantic surface, short headings and
        compact descriptions help it support the main task. Long content must wrap within the panel.
        Avoid a nested <code>main</code> landmark or another full-page layout inside either slot.
      </>
    ),
    review: (
      <>
        Toggle Document details at desktop and narrow widths, then change the selected record.
        Verify the panel describes that record and the toggle remains named. Closing the panel{" "}
        <strong>unmounts its content</strong>; keep any draft that must survive closing in the
        parent rather than only inside the <code>inspector</code>.
      </>
    ),
    next: (
      <>
        Use{" "}
        <a
          href={withBasePath(
            "/blocks/application-shell/application-shell-3#application-shell-about",
          )}
        >
          Shell 3
        </a>{" "}
        when the main page needs maximum width without a context panel, or{" "}
        <a
          href={withBasePath(
            "/blocks/application-shell/application-shell-5#application-shell-about",
          )}
        >
          Shell 5
        </a>{" "}
        when the right-hand column is navigation rather than record information.
      </>
    ),
  },
} as const;

export type ShellVariantId = keyof typeof shellVariantGuides;
