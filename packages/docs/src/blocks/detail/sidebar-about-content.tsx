import type { ComponentChildren } from "preact";
import type { SidebarBlockId } from "../../../../blocks/src/sidebar/sidebar-data";
import { withBasePath } from "../../base-path";
import { InlineCodeLink } from "../../docs/components/InlineCodeLink";
import { ShowcaseCodeLink } from "../ShowcaseCodeLink";

/** Editorial details checked against each composition; shared installation guidance lives in the renderer. */
export type SidebarAboutContent = {
  summary: ComponentChildren;
  value: ComponentChildren;
  tradeoff: ComponentChildren;
  composition: ComponentChildren;
  interaction: ComponentChildren;
  adaptation: ComponentChildren;
  accessibility: ComponentChildren;
  alternatives: readonly { id: SidebarBlockId; reason: ComponentChildren }[];
};

export const sidebarAboutContent = {
  "sidebar-01": {
    summary: (
      <>
        A documentation-oriented layout for browsing a clearly grouped set of pages. Version
        selection and search sit above the navigation, while the main area pairs a breadcrumb header
        with space for your article, guide or reference content. The{" "}
        <strong>groups stay visible</strong>, so readers can understand the collection without
        opening branches first.
      </>
    ),
    value: (
      <>
        Useful for a <strong>handbook, product documentation or an internal knowledge base</strong>{" "}
        with a manageable number of links. Section labels establish the information hierarchy, and
        visible destinations support scanning between related pages. The version control gives
        release-specific documentation a natural home in the layout.
      </>
    ),
    tradeoff: (
      <>
        <strong>Every group contributes</strong> to the list's height. A large catalog can require
        substantial scrolling, and the layout does not automatically prioritize frequently used
        pages or provide search results. Choose a disclosure-based variant when hiding unrelated
        sections is more useful than showing the whole outline.
      </>
    ),
    composition: (
      <>
        <ShowcaseCodeLink blockId="sidebar-01" file="components/version-switcher.tsx">
          <code>VersionSwitcher</code>
        </ShowcaseCodeLink>{" "}
        and{" "}
        <ShowcaseCodeLink blockId="sidebar-01" file="components/search-form.tsx">
          <code>SearchForm</code>
        </ShowcaseCodeLink>{" "}
        occupy <InlineCodeLink href="/docs/sidebar/installation">SidebarHeader</InlineCodeLink>.{" "}
        <ShowcaseCodeLink blockId="sidebar-01" file="components/nav-docs.tsx">
          <code>NavDocs</code>
        </ShowcaseCodeLink>{" "}
        renders the groups from <code>data/docs-data.ts</code> without{" "}
        <code>collapsibleSections</code>.{" "}
        <ShowcaseCodeLink blockId="sidebar-01" file="components/dashboard-shell.tsx">
          <code>DashboardShell</code>
        </ShowcaseCodeLink>{" "}
        owns the breadcrumb header and placeholder workspace; its <code>children</code> are the
        insertion point for real page content.{" "}
        <InlineCodeLink href="/docs/sidebar/installation">SidebarRail</InlineCodeLink> provides an
        additional desktop toggle surface.
      </>
    ),
    interaction: (
      <>
        <ShowcaseCodeLink blockId="sidebar-01" file="components/version-switcher.tsx">
          <code>VersionSwitcher</code>
        </ShowcaseCodeLink>{" "}
        stores the selected version locally and changes its displayed label. It does not replace the
        navigation data or navigate to another release.{" "}
        <ShowcaseCodeLink blockId="sidebar-01" file="components/nav-docs.tsx">
          <code>NavDocs</code>
        </ShowcaseCodeLink>{" "}
        reads <code>isActive</code> from the supplied items; it does not infer the{" "}
        <strong>current page</strong>. The search input has no index or result interface attached.
      </>
    ),
    adaptation: (
      <>
        Decide whether versions belong in the URL, application state or both. Update the displayed
        version, navigation links and article content together. Connect search to a real result view
        and derive active links from the same route information used for breadcrumbs, so the three
        location cues cannot drift apart.
      </>
    ),
    accessibility: (
      <>
        Keep group headings meaningful outside their visual position. When a version change replaces
        the current article, announce the new page and place focus deliberately rather than leaving
        it on a removed navigation item.
      </>
    ),
    alternatives: [
      {
        id: "sidebar-02",
        reason: (
          <>
            Keeps the documentation pattern but makes <strong>entire groups collapsible</strong>.
            Prefer it when the outline is too long to leave fully expanded.
          </>
        ),
      },
      {
        id: "sidebar-14",
        reason: (
          <>
            Places documentation <strong>navigation on the right</strong>. Compare the reading order
            and toggle placement before choosing a side for your app.
          </>
        ),
      },
    ],
  },
  "sidebar-02": {
    summary: (
      <>
        A documentation layout that lets readers reduce a long outline to the sections they need.
        Each <strong>section heading controls its own group</strong> of links. Search and version
        selection remain above the outline, and a sticky breadcrumb header keeps page context
        visible while the content scrolls.
      </>
    ),
    value: (
      <>
        Useful for manuals with <strong>several independent topics</strong>, onboarding guides or
        reference collections with many sections. Readers can keep a relevant group open and
        collapse neighboring groups without losing the overall category structure. This saves
        vertical space while leaving the categories discoverable.
      </>
    ),
    tradeoff: (
      <>
        <strong>Collapsed groups hide their destinations</strong> until opened. A reader may need
        more actions to discover a page than in an always-visible outline.{" "}
        <strong>Expansion is separate from routing</strong>, so applications that change routes
        without remounting the layout need to decide how the newly active group becomes visible.
      </>
    ),
    composition: (
      <>
        The layout shares{" "}
        <ShowcaseCodeLink blockId="sidebar-02" file="components/version-switcher.tsx">
          <code>VersionSwitcher</code>
        </ShowcaseCodeLink>
        ,{" "}
        <ShowcaseCodeLink blockId="sidebar-02" file="components/search-form.tsx">
          <code>SearchForm</code>
        </ShowcaseCodeLink>{" "}
        and{" "}
        <ShowcaseCodeLink blockId="sidebar-02" file="components/nav-docs.tsx">
          <code>NavDocs</code>
        </ShowcaseCodeLink>{" "}
        with <a href={withBasePath("/blocks/sidebar/sidebar-01#sidebar-01-about")}>Sidebar 1</a>.
        Its important local choice is <code>collapsibleSections</code> on{" "}
        <ShowcaseCodeLink blockId="sidebar-02" file="components/nav-docs.tsx">
          <code>NavDocs</code>
        </ShowcaseCodeLink>
        : each group gets a core{" "}
        <InlineCodeLink href="/docs/collapsible/installation">Collapsible</InlineCodeLink>.{" "}
        <ShowcaseCodeLink blockId="sidebar-02" file="components/dashboard-shell.tsx">
          <code>DashboardShell</code>
        </ShowcaseCodeLink>{" "}
        uses <code>stickyHeader</code> and a list placeholder, which you replace with your own
        content rather than treating it as a supplied document renderer.
      </>
    ),
    interaction: (
      <>
        A group containing an active item starts open through <code>defaultOpen</code>. Each
        disclosure then manages its own open state; this is{" "}
        <strong>not an exclusive accordion</strong>. Updating <code>isActive</code> later{" "}
        <strong>does not by itself synchronize</strong> an already mounted disclosure. Version
        selection remains a local label change, and search requires application behavior.
      </>
    ),
    adaptation: (
      <>
        Choose whether readers' manual expansion choices should survive navigation, and whether
        entering a hidden page should open its group. If you need that behavior, control disclosure
        state in the copied{" "}
        <ShowcaseCodeLink blockId="sidebar-02" file="components/nav-docs.tsx">
          <code>NavDocs</code>
        </ShowcaseCodeLink>{" "}
        helper. Keep route matching, breadcrumbs and documentation-version selection consistent
        before adding persistence.
      </>
    ),
    accessibility: (
      <>
        A section heading is a disclosure button, not a destination link. Preserve its expanded
        state announcement and keyboard activation. If a group also needs an overview page, provide
        a distinct link instead of making the same click both navigate and collapse.
      </>
    ),
    alternatives: [
      {
        id: "sidebar-01",
        reason: (
          <>
            Leaves every documentation group visible. It is simpler when the navigation is short and
            immediate link discovery matters most.
          </>
        ),
      },
      {
        id: "sidebar-05",
        reason: (
          <>
            Collapses individual application submenu branches rather than whole documentation
            groups, with icons and a workspace selector.
          </>
        ),
      },
    ],
  },
  "sidebar-03": {
    summary: (
      <>
        An application sidebar with a workspace selector and an openly displayed{" "}
        <strong>parent-and-child navigation hierarchy</strong>. Child destinations remain beneath
        their parent, so people can see the available routes without expanding a menu. A bordered
        breadcrumb header separates navigation controls from the page workspace.
      </>
    ),
    value: (
      <>
        Useful for a small dashboard or admin area whose{" "}
        <strong>child pages are visited frequently</strong>. The visible hierarchy makes
        relationships between a feature and its subpages easy to learn. Workspace selection stays in
        a consistent place above the routes instead of competing with page-level actions.
      </>
    ),
    tradeoff: (
      <>
        <strong>Always-visible submenus consume height</strong> even when people only need one area
        of the application. This variant is less suitable for many large branches. Keeping
        everything visible also means the labels and grouping need to be concise; the layout does
        not solve an unclear navigation hierarchy.
      </>
    ),
    composition: (
      <>
        <ShowcaseCodeLink blockId="sidebar-03" file="components/team-switcher.tsx">
          <code>TeamSwitcher</code>
        </ShowcaseCodeLink>{" "}
        receives <code>data/teams-data.ts</code>, and{" "}
        <ShowcaseCodeLink blockId="sidebar-03" file="components/nav-main.tsx">
          <code>NavMain</code>
        </ShowcaseCodeLink>{" "}
        receives <code>data/navigation-data.ts</code> with{" "}
        <code>collapsible=&#123;false&#125;</code>. Parent rows are links and child rows are
        rendered beneath them.{" "}
        <ShowcaseCodeLink blockId="sidebar-03" file="components/dashboard-shell.tsx">
          <code>DashboardShell</code>
        </ShowcaseCodeLink>{" "}
        supplies the main surface with an inner header row; the wrapper itself still takes no public
        configuration props.
      </>
    ),
    interaction: (
      <>
        The workspace selector changes its own active team display, not your application tenant.{" "}
        <ShowcaseCodeLink blockId="sidebar-03" file="components/nav-main.tsx">
          <code>NavMain</code>
        </ShowcaseCodeLink>{" "}
        uses explicit item data for highlighting. Parent links and child links still use the demo
        navigation handler, so changing their text alone will not connect them to your router.{" "}
        <InlineCodeLink href="/docs/sidebar/installation">Sidebar</InlineCodeLink> collapse is
        independent of submenu visibility.
      </>
    ),
    adaptation: (
      <>
        Decide which parents need a real overview route and which children represent separate pages.
        Supply <strong>real URLs</strong> or your router’s link handling, and add current-page
        semantics to the correct leaf. Lift team selection into your application if it must load
        different data, then update the breadcrumb trail with the active workspace and route.
      </>
    ),
    accessibility: (
      <>
        Use distinct names for parent and child destinations so repeated labels do not make the
        hierarchy ambiguous. Verify the focused child stays visible when the sidebar scrolls, and
        preserve a sensible tab sequence through the expanded list.
      </>
    ),
    alternatives: [
      {
        id: "sidebar-04",
        reason: (
          <>
            Uses the same visible-submenu approach with a wider{" "}
            <strong>floating navigation surface</strong>. Choose between them primarily for the
            page's visual structure.
          </>
        ),
      },
      {
        id: "sidebar-05",
        reason: (
          <>
            Adds search and expandable branches. It is a better starting point when only a few
            branches should be visible at a time.
          </>
        ),
      },
    ],
  },
  "sidebar-04": {
    summary: (
      <>
        A <strong>floating application sidebar</strong> that gives navigation its own visual surface
        beside the workspace. It retains the visible submenu structure of{" "}
        <a href={withBasePath("/blocks/sidebar/sidebar-03#sidebar-03-about")}>Sidebar 3</a> but uses
        a wider desktop navigation area and a lighter separation from the main header. Its value is
        the spatial distinction between navigation and content, rather than a new navigation
        mechanism.
      </>
    ),
    value: (
      <>
        Useful when the page background should remain visible around navigation, or when workspace
        labels and child destinations benefit from more horizontal room. The floating treatment can
        help a dashboard's navigation feel separate from dense tables, editors or report content
        without adding another application-level toolbar.
      </>
    ),
    tradeoff: (
      <>
        The wider rail leaves less room for the workspace on intermediate desktop widths. Visible
        child links still consume vertical space. Floating is a visual variant, not a guarantee that
        the sidebar can be freely positioned inside any container; preserve the core layout
        relationship and test the actual host page.
      </>
    ),
    composition: (
      <>
        <InlineCodeLink href="/docs/sidebar/installation">SidebarProvider</InlineCodeLink> sets the
        desktop sidebar width to <code>19rem</code> and{" "}
        <InlineCodeLink href="/docs/sidebar/installation">Sidebar</InlineCodeLink> uses{" "}
        <code>variant="floating"</code>.
        <ShowcaseCodeLink blockId="sidebar-04" file="components/team-switcher.tsx">
          <code>TeamSwitcher</code>
        </ShowcaseCodeLink>{" "}
        and{" "}
        <ShowcaseCodeLink blockId="sidebar-04" file="components/nav-main.tsx">
          <code>NavMain</code>
        </ShowcaseCodeLink>{" "}
        provide workspace and route navigation, with <code>collapsible=&#123;false&#125;</code> on
        the navigation helper.{" "}
        <ShowcaseCodeLink blockId="sidebar-04" file="components/dashboard-shell.tsx">
          <code>DashboardShell</code>
        </ShowcaseCodeLink>{" "}
        removes its placeholder's top padding and uses a header without the standard bottom border.
      </>
    ),
    interaction: (
      <>
        The sidebar uses the default off-canvas collapse mode on desktop, rather than the icon rail
        used by <a href={withBasePath("/blocks/sidebar/sidebar-07#sidebar-07-about")}>Sidebar 7</a>.{" "}
        <ShowcaseCodeLink blockId="sidebar-04" file="components/nav-main.tsx">
          <code>NavMain</code>
        </ShowcaseCodeLink>
        's child links remain expanded when the sidebar is visible. Team selection is{" "}
        <strong>local presentation state</strong>, and the sample destinations do not yet navigate
        through an application router.
      </>
    ),
    adaptation: (
      <>
        Choose the sidebar width alongside your real page's minimum useful width. Keep the floating
        frame and workspace spacing coordinated, then replace demo teams and routes. When inserting
        content through{" "}
        <ShowcaseCodeLink blockId="sidebar-04" file="components/dashboard-shell.tsx">
          <code>DashboardShell</code>
        </ShowcaseCodeLink>{" "}
        children, <strong>add your own content padding</strong>; the placeholder's padding choices
        do not wrap custom children automatically.
      </>
    ),
    accessibility: (
      <>
        Verify text contrast on both the floating surface and the surrounding page. The visual gap
        should not obscure which control opens the navigation after collapse; retain the labeled
        header toggle and a visible keyboard focus outline.
      </>
    ),
    alternatives: [
      {
        id: "sidebar-03",
        reason: (
          <>
            Provides the same visible parent/child structure with a conventional sidebar edge and
            bordered header, leaving more room for content.
          </>
        ),
      },
      {
        id: "sidebar-08",
        reason: (
          <>
            Emphasizes an <strong>inset main workspace</strong> rather than a{" "}
            <strong>floating navigation surface</strong>, and includes project, utility and account
            sections.
          </>
        ),
      },
    ],
  },
  "sidebar-05": {
    summary: (
      <>
        A workspace-oriented sidebar for applications with several groups of related pages. A team
        selector and search field sit above navigation whose <strong>parent rows expand</strong> to
        reveal child destinations. This keeps the overall structure visible while letting people
        hide branches they are not currently using.
      </>
    ),
    value: (
      <>
        Useful for administration tools, project workspaces and dashboards where each feature area
        has its own subpages. Branch expansion reduces the visible list without flattening its
        hierarchy. The search field reserves a familiar location for a future search workflow, while
        breadcrumbs keep the <strong>current page</strong> distinct from the navigation's open
        branches.
      </>
    ),
    tradeoff: (
      <>
        A branch's <strong>open state is not the current route</strong>. A person can expand one
        group while reading a page in another. Parent rows with children act as disclosures, so
        their configured URL is not used as a destination in that mode. If parents also need
        overview pages, design a separate way to reach them.
      </>
    ),
    composition: (
      <>
        <ShowcaseCodeLink blockId="sidebar-05" file="components/team-switcher.tsx">
          <code>TeamSwitcher</code>
        </ShowcaseCodeLink>{" "}
        and{" "}
        <ShowcaseCodeLink blockId="sidebar-05" file="components/search-form.tsx">
          <code>SearchForm</code>
        </ShowcaseCodeLink>{" "}
        live in <InlineCodeLink href="/docs/sidebar/installation">SidebarHeader</InlineCodeLink>.{" "}
        <ShowcaseCodeLink blockId="sidebar-05" file="components/nav-main.tsx">
          <code>NavMain</code>
        </ShowcaseCodeLink>{" "}
        receives <code>navigationItems</code> with <code>collapsible=&#123;true&#125;</code> and
        chooses between a direct link for a leaf and a{" "}
        <InlineCodeLink href="/docs/collapsible/installation">Collapsible</InlineCodeLink> for a
        branch.{" "}
        <ShowcaseCodeLink blockId="sidebar-05" file="components/dashboard-shell.tsx">
          <code>DashboardShell</code>
        </ShowcaseCodeLink>{" "}
        supplies the header and content area, while{" "}
        <InlineCodeLink href="/docs/sidebar/installation">SidebarRail</InlineCodeLink> offers a
        desktop collapse affordance alongside the main toggle.
      </>
    ),
    interaction: (
      <>
        An item marked <code>isActive</code> starts its branch open through <code>defaultOpen</code>
        . Later route changes <strong>do not automatically update</strong> that disclosure's local
        state. Submenu links use the demo navigation handler; the search field does not filter them.{" "}
        <ShowcaseCodeLink blockId="sidebar-05" file="components/team-switcher.tsx">
          <code>TeamSwitcher</code>
        </ShowcaseCodeLink>{" "}
        updates a displayed selection but <strong>does not load</strong> another workspace's pages
        or permissions.
      </>
    ),
    adaptation: (
      <>
        Connect leaf destinations and route highlighting first, including <code>aria-current</code>{" "}
        on the active child. Decide whether navigation should open the current branch automatically
        or preserve manual choices. Then connect workspace selection and search to application
        state, and replace{" "}
        <ShowcaseCodeLink blockId="sidebar-05" file="components/dashboard-shell.tsx">
          <code>DashboardShell</code>
        </ShowcaseCodeLink>
        's placeholder panels with your actual routed content.
      </>
    ),
    accessibility: (
      <>
        Keep disclosure controls and destination links distinguishable. Test that a collapsed group
        cannot leave focus on a hidden child, and do not rely on the parent highlight alone to
        communicate which nested page is current.
      </>
    ),
    alternatives: [
      {
        id: "sidebar-03",
        reason: (
          <>
            Keeps all child destinations visible. Choose it when the tree is short and opening
            branches adds more work than it saves.
          </>
        ),
      },
      {
        id: "sidebar-06",
        reason: (
          <>
            Places child destinations in <strong>dropdown menus</strong> instead of inline branches.
            It keeps the list compact but hides the hierarchy while menus are closed.
          </>
        ),
      },
    ],
  },
  "sidebar-06": {
    summary: (
      <>
        A compact application sidebar that opens nested destinations in{" "}
        <strong>dropdown menus</strong> beside the navigation. A workspace selector anchors the top,
        and a sample opt-in card occupies supporting space below the main links. The main page still
        uses a separate breadcrumb header and replaceable workspace content.
      </>
    ),
    value: (
      <>
        Useful when a short list of top-level areas each has a small number of secondary
        destinations. Dropdowns keep the sidebar's height stable instead of extending every branch
        inline. The supporting card demonstrates a place for an optional notification preference or
        onboarding action that should remain secondary to navigation.
      </>
    ),
    tradeoff: (
      <>
        Child destinations disappear when their menu closes, so the hierarchy is less visible than
        an expanded sidebar. A menu also needs space beside its trigger and careful{" "}
        <strong>keyboard behavior</strong>. Avoid filling it with long descriptions or using the
        supporting card for a task that people must complete on every visit.
      </>
    ),
    composition: (
      <>
        <ShowcaseCodeLink blockId="sidebar-06" file="components/nav-main-dropdowns.tsx">
          <code>NavMainDropdowns</code>
        </ShowcaseCodeLink>{" "}
        replaces the inline-branch <code>NavMain</code> helper. Items with children receive a core{" "}
        <InlineCodeLink href="/docs/dropdown/installation">Dropdown</InlineCodeLink> whose content
        is requested to the right and aligned to the start; leaf items remain links.{" "}
        <ShowcaseCodeLink blockId="sidebar-06" file="components/sidebar-opt-in-form.tsx">
          <code>SidebarOptInForm</code>
        </ShowcaseCodeLink>{" "}
        follows the navigation inside{" "}
        <InlineCodeLink href="/docs/sidebar/installation">SidebarContent</InlineCodeLink>.{" "}
        <ShowcaseCodeLink blockId="sidebar-06" file="components/team-switcher.tsx">
          <code>TeamSwitcher</code>
        </ShowcaseCodeLink>{" "}
        and{" "}
        <ShowcaseCodeLink blockId="sidebar-06" file="components/dashboard-shell.tsx">
          <code>DashboardShell</code>
        </ShowcaseCodeLink>{" "}
        supply the surrounding workspace structure.
      </>
    ),
    interaction: (
      <>
        Opening a dropdown shows child links without changing the selected application route. The
        links still have demo navigation handling, and the notification checkbox starts checked but{" "}
        <strong>does not save a preference</strong> or request notification permission. Team
        selection changes local display state. Each of these interactions needs a separate
        application connection rather than one global sidebar callback.
      </>
    ),
    adaptation: (
      <>
        Keep menu labels short, connect links to real destinations and decide how the parent
        indicates a selected child. Replace or remove the opt-in card according to your product's
        needs. If retaining it, connect its value to a stored preference and provide saving and
        failure feedback. Treat any browser notification permission request as a separate, explicit
        application action.
      </>
    ),
    accessibility: (
      <>
        Verify menu opening, item focus, Escape dismissal and <strong>focus return</strong> inside
        both desktop navigation and the mobile sheet. A nested overlay should not strand focus
        behind its parent or require a pointer to reach a child destination.
      </>
    ),
    alternatives: [
      {
        id: "sidebar-05",
        reason: (
          <>
            Shows children inline under expandable parents. It gives more persistent context and
            avoids opening a separate menu for every branch.
          </>
        ),
      },
      {
        id: "sidebar-07",
        reason: (
          <>
            Provides a desktop icon-collapse layout with project and account navigation, rather than
            using dropdowns to manage the main hierarchy.
          </>
        ),
      },
    ],
  },
  "sidebar-07": {
    summary: (
      <>
        A full application navigation layout that can shrink to a compact{" "}
        <strong>desktop icon rail</strong>. Workspace selection sits above application and project
        links, with an account identity row anchored in the footer. The page header becomes shorter
        when the navigation collapses, keeping more space available for the main task.
      </>
    ),
    value: (
      <>
        Useful for repeat visitors who recognize familiar navigation icons and want more workspace
        for tables, editors or dashboards. In expanded mode, labels support discovery; the collapsed
        rail preserves a compact entry point into navigation. Separating projects and account
        controls from primary destinations helps keep different kinds of action understandable.
      </>
    ),
    tradeoff: (
      <>
        Icons carry less information than text. Submenu rows and project navigation are hidden in
        icon mode, so users may need to expand the sidebar to reach them. Do not assume every child
        destination remains directly available from the collapsed rail, or choose this pattern
        solely to make a dense navigation tree fit.
      </>
    ),
    composition: (
      <>
        <InlineCodeLink href="/docs/sidebar/installation">Sidebar</InlineCodeLink> uses{" "}
        <code>collapsible="icon"</code> and combines{" "}
        <ShowcaseCodeLink blockId="sidebar-07" file="components/team-switcher.tsx">
          <code>TeamSwitcher</code>
        </ShowcaseCodeLink>
        ,{" "}
        <ShowcaseCodeLink blockId="sidebar-07" file="components/nav-main.tsx">
          <code>NavMain</code>
        </ShowcaseCodeLink>{" "}
        and{" "}
        <ShowcaseCodeLink blockId="sidebar-07" file="components/nav-projects.tsx">
          <code>NavProjects</code>
        </ShowcaseCodeLink>
        .{" "}
        <ShowcaseCodeLink blockId="sidebar-07" file="components/nav-user.tsx">
          <code>NavUser</code>
        </ShowcaseCodeLink>{" "}
        sits in SidebarFooter.{" "}
        <ShowcaseCodeLink blockId="sidebar-07" file="components/dashboard-shell.tsx">
          <code>DashboardShell</code>
        </ShowcaseCodeLink>{" "}
        uses an inner header row and classes that reduce the header height when the provider reports
        icon collapse. Navigation, project, team and user fixtures remain separate data inputs.
      </>
    ),
    interaction: (
      <>
        <InlineCodeLink href="/docs/sidebar/installation">SidebarProvider</InlineCodeLink> owns
        expanded versus collapsed desktop state. Branch disclosures and the workspace switcher own
        their own interaction state.{" "}
        <ShowcaseCodeLink blockId="sidebar-07" file="components/nav-user.tsx">
          <code>NavUser</code>
        </ShowcaseCodeLink>{" "}
        only displays identity data; it has no dropdown or action handlers. The main navigation's
        active flags come from data, and changing a team does not switch application context.
        Project entries are links, not action menus; their demo URLs and the account row still need
        application integration.
      </>
    ),
    adaptation: (
      <>
        Check the collapsed layout with your actual icons and longest labels before integrating
        content. Provide a clear expansion path to hidden child links, connect project and account
        commands, and derive active navigation from routing. If you persist desktop collapse,
        restore it explicitly through provider inputs rather than assuming the preview remembers it.
      </>
    ),
    accessibility: (
      <>
        Give each icon-only control a useful accessible name and test its tooltip separately from
        its activation. Keyboard users must be able to expand the rail and reach the links hidden in
        collapsed mode without guessing which unlabeled icon to use.
      </>
    ),
    alternatives: [
      {
        id: "sidebar-05",
        reason: (
          <>
            Uses an off-canvas desktop collapse and a search field with expandable branches; it has
            a smaller set of supporting navigation sections.
          </>
        ),
      },
      {
        id: "sidebar-08",
        reason: (
          <>
            Adds secondary navigation and an inset workspace surface, but uses the default
            off-canvas collapse rather than this <strong>desktop icon rail</strong>.
          </>
        ),
      },
    ],
  },
  "sidebar-08": {
    summary: (
      <>
        An application layout that makes the main workspace an <strong>inset surface</strong> beside
        a richer navigation column. Workspace, application, project, utility and account controls
        have separate places. This variant is about establishing a clear visual and functional
        hierarchy around the page, not adding a second content sidebar.
      </>
    ),
    value: (
      <>
        Useful for a product with both everyday feature navigation and supporting destinations such
        as help or feedback. The inset main surface distinguishes work content from the surrounding
        navigation area. Project links and account controls have dedicated positions, reducing the
        temptation to mix every action into one long route list.
      </>
    ),
    tradeoff: (
      <>
        More navigation sections mean more content to maintain and more vertical space to manage.
        Utility links should stay genuinely secondary; too many competing groups can undermine the
        hierarchy. The inset treatment also consumes some surrounding space, which should be tested
        with wide tables and dense page layouts.
      </>
    ),
    composition: (
      <>
        <InlineCodeLink href="/docs/sidebar/installation">Sidebar</InlineCodeLink> uses{" "}
        <code>variant="inset"</code> with{" "}
        <ShowcaseCodeLink blockId="sidebar-08" file="components/team-switcher.tsx">
          <code>TeamSwitcher</code>
        </ShowcaseCodeLink>
        ,{" "}
        <ShowcaseCodeLink blockId="sidebar-08" file="components/nav-main.tsx">
          <code>NavMain</code>
        </ShowcaseCodeLink>
        ,{" "}
        <ShowcaseCodeLink blockId="sidebar-08" file="components/nav-projects.tsx">
          <code>NavProjects</code>
        </ShowcaseCodeLink>{" "}
        and{" "}
        <ShowcaseCodeLink blockId="sidebar-08" file="components/nav-secondary.tsx">
          <code>NavSecondary</code>
        </ShowcaseCodeLink>
        .{" "}
        <ShowcaseCodeLink blockId="sidebar-08" file="components/nav-user.tsx">
          <code>NavUser</code>
        </ShowcaseCodeLink>{" "}
        occupies the footer.{" "}
        <ShowcaseCodeLink blockId="sidebar-08" file="components/dashboard-shell.tsx">
          <code>DashboardShell</code>
        </ShowcaseCodeLink>{" "}
        renders the matching{" "}
        <InlineCodeLink href="/docs/sidebar/installation">SidebarInset</InlineCodeLink> workspace
        and an inner header row. Separate fixtures supply primary navigation, projects, secondary
        links, teams and user details; each can be replaced independently.
      </>
    ),
    interaction: (
      <>
        Inset changes the surface treatment, not the collapse mode. This composition uses the
        default off-canvas collapse rather than{" "}
        <a href={withBasePath("/blocks/sidebar/sidebar-07#sidebar-07-about")}>Sidebar 7</a>
        's icon mode. Navigation branches still manage their own disclosure state. Team changes
        update only the switcher display. Projects are ordinary links, and{" "}
        <ShowcaseCodeLink blockId="sidebar-08" file="components/nav-user.tsx">
          <code>NavUser</code>
        </ShowcaseCodeLink>{" "}
        is a display row without an account menu; add any account actions explicitly.
      </>
    ),
    adaptation: (
      <>
        Decide which destinations belong in primary navigation, which are project shortcuts and
        which should remain utility links. Remove groups your product does not need. Keep main{" "}
        content inside the existing inset, connect each helper's destinations and actions, and check
        the inset edge with your app's theme instead of adding fixed colors.
      </>
    ),
    accessibility: (
      <>
        Label each navigation group by its purpose and make repeated project or account actions
        distinguishable. Keep essential support destinations reachable when the navigation is in its
        mobile sheet, and avoid identifying utility links only through a muted color.
      </>
    ),
    alternatives: [
      {
        id: "sidebar-07",
        reason: (
          <>
            Has a similar application/project/account structure with a{" "}
            <strong>desktop icon rail</strong> and no separate secondary-link group.
          </>
        ),
      },
      {
        id: "sidebar-15",
        reason: (
          <>
            Adds a separate right utility sidebar. Use it only when those tools need their own
            persistent desktop area rather than another navigation group.
          </>
        ),
      },
    ],
  },
  "sidebar-09": {
    summary: (
      <>
        A <strong>two-level navigation layout</strong> with a narrow category rail and an adjacent
        list pane. The main workspace remains a third area for the selected task. Inbox, Drafts and
        Sent demonstrate the first level, while a sample message list demonstrates the second; the
        composition is a starting point for a master-detail workflow.
      </>
    ),
    value: (
      <>
        Useful for <strong>mail, support queues or record browsers</strong> where people first
        choose a collection, then an item within it. The rail keeps collection switching close at
        hand while the neighboring pane gives that collection room for readable item labels. The
        main workspace can remain focused on the <strong>selected record</strong>.
      </>
    ),
    tradeoff: (
      <>
        Two navigation panes use more width than a conventional sidebar and require coordination
        between collection, selected item and page content. On mobile the{" "}
        <strong>second pane is hidden</strong>, so the demo alone is not a complete small-screen
        inbox. A real implementation needs a separate list route or another reachable item selector.
      </>
    ),
    composition: (
      <>
        An outer icon-collapsible{" "}
        <InlineCodeLink href="/docs/sidebar/installation">Sidebar</InlineCodeLink> contains two
        non-collapsible <InlineCodeLink href="/docs/sidebar/installation">Sidebar</InlineCodeLink>{" "}
        sections arranged in a row. The first holds{" "}
        <ShowcaseCodeLink blockId="sidebar-09" file="components/team-switcher.tsx">
          <code>TeamSwitcher</code>
        </ShowcaseCodeLink>
        , category buttons and{" "}
        <ShowcaseCodeLink blockId="sidebar-09" file="components/nav-user.tsx">
          <code>NavUser</code>
        </ShowcaseCodeLink>
        ; the second holds the current category heading and <code>inboxItems</code>. The provider
        reserves a <code>350px</code> desktop width, and{" "}
        <ShowcaseCodeLink blockId="sidebar-09" file="components/dashboard-shell.tsx">
          <code>DashboardShell</code>
        </ShowcaseCodeLink>{" "}
        supplies a sticky header and list placeholders.
      </>
    ),
    interaction: (
      <>
        Local <code>activeItem</code> state updates the highlighted rail button and the adjacent
        pane's heading. All three choices render the same <code>inboxItems</code> array, and the
        list buttons have <strong>no selection action</strong>. Breadcrumb text and workspace
        placeholders are also static; the sample does not fetch messages or keep a{" "}
        <strong>selected record</strong> in sync.
      </>
    ),
    adaptation: (
      <>
        Introduce <strong>stable collection and item IDs</strong>, load or select the right list for
        each collection, and define what happens when the current item disappears. Render record
        content in the main area and derive breadcrumbs from that selection. Design the mobile
        list-to-detail flow before treating the desktop pane arrangement as complete.
      </>
    ),
    accessibility: (
      <>
        Distinguish category selection from opening a record, and announce the active collection in
        more than color. After a list changes, avoid leaving focus on an item that no longer exists.
        Ensure mobile users can reach the same records without the hidden second pane.
      </>
    ),
    alternatives: [
      {
        id: "sidebar-07",
        reason: (
          <>
            Collapses a conventional application sidebar to icons without maintaining a second
            neighboring list pane.
          </>
        ),
      },
      {
        id: "sidebar-15",
        reason: (
          <>
            Places optional tools on the opposite side of the workspace, rather than putting two
            levels of navigation together on the left.
          </>
        ),
      },
    ],
  },
  "sidebar-10": {
    summary: (
      <>
        A document- or project-oriented layout with primary navigation,{" "}
        <strong>favorites and secondary links</strong> on the left, plus a compact action area in
        the page header. Unlike the reference catalog’s popover design, the Kamod composition uses a
        normal icon-collapsible sidebar. Only individual action menus open as overlays.
      </>
    ),
    value: (
      <>
        Useful for workspaces where users frequently return to saved destinations and perform{" "}
        <strong>commands on the current document or project</strong>. Favorites shorten the path to
        those destinations, while header actions remain attached to the active workspace rather than
        mixed into navigation. The centered content placeholders suggest a focused editing or detail
        view.
      </>
    ),
    tradeoff: (
      <>
        Favorites and document commands require real application state to be meaningful. Their
        presence in the layout does not implement saving, deletion or sharing. If the intended
        experience is a whole navigation panel inside a popover, this variant does not currently
        provide that behavior as shown by the original reference.
      </>
    ),
    composition: (
      <>
        <ShowcaseCodeLink blockId="sidebar-10" file="components/team-switcher.tsx">
          <code>TeamSwitcher</code>
        </ShowcaseCodeLink>
        ,{" "}
        <ShowcaseCodeLink blockId="sidebar-10" file="components/nav-main.tsx">
          <code>NavMain</code>
        </ShowcaseCodeLink>
        ,{" "}
        <ShowcaseCodeLink blockId="sidebar-10" file="components/nav-favorites.tsx">
          <code>NavFavorites</code>
        </ShowcaseCodeLink>{" "}
        and{" "}
        <ShowcaseCodeLink blockId="sidebar-10" file="components/nav-secondary.tsx">
          <code>NavSecondary</code>
        </ShowcaseCodeLink>{" "}
        fill the icon-collapsible sidebar. The page composes{" "}
        <InlineCodeLink href="/docs/sidebar/installation">SidebarInset</InlineCodeLink> directly
        rather than through <code>DashboardShell</code>. Its header contains a single current-page
        breadcrumb and{" "}
        <ShowcaseCodeLink blockId="sidebar-10" file="components/nav-actions.tsx">
          <code>NavActions</code>
        </ShowcaseCodeLink>{" "}
        on the opposite side; the content area below uses centered placeholder panels.
      </>
    ),
    interaction: (
      <>
        <InlineCodeLink href="/docs/sidebar/installation">SidebarProvider</InlineCodeLink> handles
        desktop collapse and mobile navigation. Favorites are supplied as static data.{" "}
        <ShowcaseCodeLink blockId="sidebar-10" file="components/nav-actions.tsx">
          <code>NavActions</code>
        </ShowcaseCodeLink>{" "}
        displays star and delete buttons <strong>without handlers</strong>, plus a dropdown whose
        sample commands do not perform operations. The page title does not change automatically when
        a navigation or favorite item is selected.
      </>
    ),
    adaptation: (
      <>
        Connect favorites to saved user data and implement document actions with visible results and
        failure handling. Use a confirmation or undo path for destructive actions where appropriate.
        Keep the <strong>current page</strong> title, action target and content synchronized, and
        replace centered placeholders without accidentally removing the header's action area.
      </>
    ),
    accessibility: (
      <>
        Maintain distinct accessible names for the star, delete and more-actions controls. When an
        action removes or navigates away from the current document, move focus to a meaningful
        remaining target rather than relying on the removed action trigger.
      </>
    ),
    alternatives: [
      {
        id: "sidebar-07",
        reason: (
          <>
            Uses project links and an account footer with an icon rail, without this
            document-focused header action strip.
          </>
        ),
      },
      {
        id: "sidebar-15",
        reason: (
          <>
            Keeps a similar workspace focus while adding a separate right-hand utility area for
            calendar content.
          </>
        ),
      },
    ],
  },
  "sidebar-11": {
    summary: (
      <>
        A <strong>file-explorer-style navigation layout</strong> that groups file links beneath
        expandable folders. A Kamod UI brand row sits above the explorer, and the main header shows
        a path-like breadcrumb. The composition demonstrates a shallow folder-and-file hierarchy; it
        is not a recursive filesystem browser or an editor implementation.
      </>
    ),
    value: (
      <>
        Useful for project documentation, source examples or asset catalogs where people recognize
        content by folder and filename. Indentation and folder disclosure communicate containment
        more directly than a flat application menu. A path breadcrumb can reinforce where the
        selected resource belongs within the collection.
      </>
    ),
    tradeoff: (
      <>
        The current data shape supports folder entries with a list of files, not arbitrary nested
        nodes. Folder names are used as state keys, so repeated names would collide. File loading,
        permissions, deep nesting, search and editing are outside the demo; add those deliberately
        instead of implying they come with the tree styling.
      </>
    ),
    composition: (
      <>
        <code>Sidebar11</code> renders the explorer directly using core{" "}
        <InlineCodeLink href="/docs/collapsible/installation">Collapsible</InlineCodeLink> and{" "}
        <InlineCodeLink href="/docs/sidebar/installation">SidebarMenu</InlineCodeLink> primitives.{" "}
        <code>data/file-tree-data.ts</code> supplies folder names and file strings. Each folder owns
        a disclosure whose state is read from the page's <code>openFolders</code> object.{" "}
        <ShowcaseCodeLink blockId="sidebar-11" file="components/dashboard-shell.tsx">
          <code>DashboardShell</code>
        </ShowcaseCodeLink>{" "}
        renders static components/ui/button.tsx breadcrumbs beside the explorer.
      </>
    ),
    interaction: (
      <>
        The app folder starts open. Toggling a folder updates its key in <code>openFolders</code>{" "}
        without replacing the other keys. File links point to the demo destination and prevent
        navigation, so they do not load content or update breadcrumbs. This uses disclosure-and-link
        navigation rather than a fully implemented ARIA tree widget.
      </>
    ),
    adaptation: (
      <>
        Give resources stable full-path IDs before adding folders with duplicate names. Connect file
        selection to a content view and derive breadcrumbs from the selected resource. If deep
        nesting is required, extend the data model and rendering together; preserve clear disclosure
        controls and decide how expansion behaves when files move or disappear.
      </>
    ),
    accessibility: (
      <>
        Do not add tree roles unless you also implement the corresponding tree{" "}
        <strong>keyboard behavior</strong>. The current buttons and links can remain ordinary
        disclosure navigation. Give repeated filenames enough context to distinguish their
        destinations, and retain visible focus through long lists.
      </>
    ),
    alternatives: [
      {
        id: "sidebar-05",
        reason: (
          <>
            Organizes routes into application branches rather than{" "}
            <strong>folders and files</strong>; it is easier when resource paths are not meaningful
            to users.
          </>
        ),
      },
      {
        id: "sidebar-01",
        reason: (
          <>
            Presents documentation topics as labeled groups of pages, without suggesting filesystem
            containment or folder state.
          </>
        ),
      },
    ],
  },
  "sidebar-12": {
    summary: (
      <>
        A <strong>date-oriented sidebar</strong> with an account identity row and a compact calendar
        beside a workspace. The example frames the main area with a month heading and square
        placeholders. It is a useful starting composition for browsing information by date, while
        leaving events, availability and scheduling rules to your application.
      </>
    ),
    value: (
      <>
        Useful when <strong>selecting a day is a primary way</strong> to choose the content being
        viewed, such as an activity log, daily report or appointment list. Keeping the calendar
        beside the workspace lets people change the date without replacing the entire page. The
        account control stays separate from that date-selection task.
      </>
    ),
    tradeoff: (
      <>
        A <strong>selected day</strong>, a displayed calendar month and a workspace's content are{" "}
        <strong>different states</strong>. The demo <strong>does not synchronize all three</strong>.
        It also does not supply event markers, timezone rules or scheduling operations; if you only
        need occasional date filtering, a smaller date control may be sufficient.
      </>
    ),
    composition: (
      <>
        <ShowcaseCodeLink blockId="sidebar-12" file="components/nav-user.tsx">
          <code>NavUser</code>
        </ShowcaseCodeLink>{" "}
        sits in <InlineCodeLink href="/docs/sidebar/installation">SidebarHeader</InlineCodeLink>. A
        core <InlineCodeLink href="/docs/calendar/installation">Calendar</InlineCodeLink> in
        single-selection mode fills a bordered group in{" "}
        <InlineCodeLink href="/docs/sidebar/installation">SidebarContent</InlineCodeLink>.{" "}
        <code>Sidebar12</code> owns a <code>Date</code> value initialized to 12 October 2024.{" "}
        <ShowcaseCodeLink blockId="sidebar-12" file="components/dashboard-shell.tsx">
          <code>DashboardShell</code>
        </ShowcaseCodeLink>{" "}
        uses a sticky header with a static October 2024 label and square placeholders for the main{" "}
        content.
      </>
    ),
    interaction: (
      <>
        <InlineCodeLink href="/docs/calendar/installation">Calendar</InlineCodeLink> selections
        update the local date only when <code>onSelect</code> returns a <code>Date</code> instance.
        The state is not used to load workspace data, and the header's month text does not follow
        calendar navigation.{" "}
        <InlineCodeLink href="/docs/sidebar/installation">Sidebar</InlineCodeLink> collapse is
        independent of the selected date. The account row displays user data and does not open a
        dropdown.
      </>
    ),
    adaptation: (
      <>
        Define whether the page shows the <strong>selected day</strong>, the visible month or a
        separate interval. Derive labels and data queries from that choice, decide how dates are
        represented in URLs and services, and replace the fixed demo date where needed. Show
        loading, empty and error states in the workspace without removing the calendar context.
      </>
    ),
    accessibility: (
      <>
        Preserve the core calendar's keyboard controls and meaningful date labels. Announce the date
        or period represented by the main content, especially when it differs from the month
        currently displayed in the picker. Check the complete calendar on narrow and short screens.
      </>
    ),
    alternatives: [
      {
        id: "sidebar-15",
        reason: (
          <>
            Keeps application navigation on the left and places the calendar in a separate right
            utility pane; date selection becomes supporting context.
          </>
        ),
      },
      {
        id: "sidebar-01",
        reason: (
          <>
            Uses named destinations rather than dates as the main browsing model. Prefer it when
            users think in topics instead of periods.
          </>
        ),
      },
    ],
  },
  "sidebar-13": {
    summary: (
      <>
        A <strong>settings interface inside a dialog</strong> rather than a persistent application
        shell. The page starts with an Open settings button; the dialog combines a left-hand list of
        settings areas with a scrollable content region. This lets a focused configuration task
        appear over an existing page without replacing its surrounding application layout.
      </>
    ),
    value: (
      <>
        Useful for a <strong>limited group of account or workspace settings</strong> that users
        visit briefly and then dismiss. The side navigation gives those settings an outline while
        the dialog preserves the idea of returning to the underlying task. It is less suitable for a
        large settings product with many independently shareable pages.
      </>
    ),
    tradeoff: (
      <>
        The navigation is hidden below <code>768px</code> and no replacement selector is included.
        Desktop settings buttons are also not wired to change panels. A production dialog needs a
        mobile way to choose sections and a decision about saving, cancelling and unsaved edits
        before it can serve as a complete settings flow.
      </>
    ),
    composition: (
      <>
        A core <InlineCodeLink href="/docs/dialog/installation">Dialog</InlineCodeLink> surrounds{" "}
        <InlineCodeLink href="/docs/sidebar/installation">SidebarProvider</InlineCodeLink>. The
        inner <InlineCodeLink href="/docs/sidebar/installation">Sidebar</InlineCodeLink> uses{" "}
        <code>{'collapsible="none"'}</code> and is hidden below the medium breakpoint; it is not a
        sheet within the dialog. A visually hidden DialogTitle names the overlay. The main region
        contains a Settings breadcrumb and a fixed-height, independently scrollable placeholder
        area.
      </>
    ),
    interaction: (
      <>
        DialogTrigger opens the overlay, and the core dialog handles its open/close interaction. The
        first settings row is styled active by its index, not by a selected settings-panel state.
        Clicking another row does not replace content. There is no form submission, validation or
        persistence attached to the placeholder panels.
      </>
    ),
    adaptation: (
      <>
        Introduce a selected settings section, render its actual fields and provide an equivalent
        small-screen selector. Decide whether edits save immediately or require an explicit save
        action, and define what dismissal does with unsaved values. Keep the opener mounted so
        closing the dialog can restore focus predictably.
      </>
    ),
    accessibility: (
      <>
        Retain the accessible DialogTitle even if it remains visually hidden. Keep focus within the
        open dialog and return it on dismissal. Test long forms with zoom and the on-screen keyboard
        so required fields and save controls are not trapped below a fixed-height region.
      </>
    ),
    alternatives: [
      {
        id: "sidebar-05",
        reason: (
          <>
            Provides <strong>persistent application navigation</strong> for settings that should
            behave as normal routed pages rather than an overlay task.
          </>
        ),
      },
      {
        id: "sidebar-14",
        reason: (
          <>
            Places <strong>navigation on the right</strong> of a full page. It changes the layout's
            side, not its modality or settings behavior.
          </>
        ),
      },
    ],
  },
  "sidebar-14": {
    summary: (
      <>
        A documentation-style sidebar <strong>on the right of the page</strong>. The main content
        appears first in the composition, with breadcrumbs on the left of its header and the
        navigation toggle at the right. Search and version selection remain part of the sidebar,
        giving the layout a different reading emphasis from the standard left-navigation variants.
      </>
    ),
    value: (
      <>
        Useful when the main reading surface should lead visually and navigation should remain
        available on its trailing side. It can also fit an application's existing convention for
        right-hand navigation. The supplied content is still documentation navigation; changing its
        position does not automatically make it a contextual inspector or table of contents.
      </>
    ),
    tradeoff: (
      <>
        People accustomed to a left sidebar may take longer to discover the toggle and navigation.
        Moving the panel to the right does not make the entire application right-to-left. Consider
        reading order, labels and keyboard traversal separately from physical placement, especially
        if localization changes the interface direction.
      </>
    ),
    composition: (
      <>
        <InlineCodeLink href="/docs/sidebar/installation">SidebarInset</InlineCodeLink> is composed
        before <InlineCodeLink href="/docs/sidebar/installation">Sidebar</InlineCodeLink>, and{" "}
        <InlineCodeLink href="/docs/sidebar/installation">Sidebar</InlineCodeLink> receives{" "}
        <code>{'side="right"'}</code>. The page header places a rotated{" "}
        <InlineCodeLink href="/docs/sidebar/installation">SidebarTrigger</InlineCodeLink> at its far
        end.{" "}
        <ShowcaseCodeLink blockId="sidebar-14" file="components/version-switcher.tsx">
          <code>VersionSwitcher</code>
        </ShowcaseCodeLink>
        ,{" "}
        <ShowcaseCodeLink blockId="sidebar-14" file="components/search-form.tsx">
          <code>SearchForm</code>
        </ShowcaseCodeLink>{" "}
        and{" "}
        <ShowcaseCodeLink blockId="sidebar-14" file="components/nav-docs.tsx">
          <code>NavDocs</code>
        </ShowcaseCodeLink>{" "}
        reuse the documentation data model. The workspace is written directly in the variant rather
        than delegated to <code>DashboardShell</code>.
      </>
    ),
    interaction: (
      <>
        The right sidebar uses the default off-canvas collapse mode, and its mobile sheet opens from
        the right. Documentation groups remain visible when navigation is open. Version selection
        changes a local label; search and page destinations still need to be connected to the
        application, just as in the left-hand documentation variant.
      </>
    ),
    adaptation: (
      <>
        Keep the open-navigation affordance near the side where the panel appears. Replace
        placeholder content inside the existing{" "}
        <InlineCodeLink href="/docs/sidebar/installation">SidebarInset</InlineCodeLink> and connect
        the documentation data to real pages. Test the actual source and tab order after adding
        controls instead of assuming the visual right-hand position alone establishes a sensible
        reading sequence.
      </>
    ),
    accessibility: (
      <>
        Verify that the right-side trigger has an understandable name, remains visible when the
        panel is closed and receives focus again after mobile dismissal. Test keyboard traversal
        between the main page and navigation at both desktop and mobile widths.
      </>
    ),
    alternatives: [
      {
        id: "sidebar-01",
        reason: (
          <>
            Uses the same general documentation grouping on the left, with the conventional
            navigation-first arrangement.
          </>
        ),
      },
      {
        id: "sidebar-15",
        reason: (
          <>
            Keeps primary navigation on the left and adds a separate right utility pane instead of
            moving all navigation to the right.
          </>
        ),
      },
    ],
  },
  "sidebar-15": {
    summary: (
      <>
        A <strong>three-area desktop layout</strong> with application navigation on the left, the
        active workspace in the center and calendar utilities on the right. The left navigation can
        collapse to icons, while the right sidebar is a <strong>separate static region</strong>.
        Each side has a different purpose rather than duplicating the same list of destinations.
      </>
    ),
    value: (
      <>
        Useful when people need persistent application navigation and occasional reference
        information alongside a document, task list or project workspace. Keeping utility content on
        the opposite side can reduce interruptions to the central task. The arrangement works best
        when the right-hand tools are genuinely useful but not required for every interaction.
      </>
    ),
    tradeoff: (
      <>
        Two side regions leave less width for the main page, particularly on medium screens. The{" "}
        <strong>right sidebar disappears</strong> below <code>768px</code> and is{" "}
        <strong>not opened by</strong> the left navigation toggle. Essential calendar tasks
        therefore need another reachable location; hiding a utility pane is only appropriate when it
        does not hide the user's only path to a task.
      </>
    ),
    composition: (
      <>
        The left icon-collapsible{" "}
        <InlineCodeLink href="/docs/sidebar/installation">Sidebar</InlineCodeLink> combines team,{" "}
        main, project, secondary and account helpers.{" "}
        <InlineCodeLink href="/docs/sidebar/installation">SidebarInset</InlineCodeLink> contains a
        sticky page header and centered placeholders. The right{" "}
        <InlineCodeLink href="/docs/sidebar/installation">Sidebar</InlineCodeLink> uses{" "}
        <code>{'side="right"'}</code> and <code>{'collapsible="none"'}</code>, with a calendar
        beneath a static month label and medium-breakpoint visibility classes.
      </>
    ),
    interaction: (
      <>
        The provider's toggle affects the collapsible left navigation, not the static right pane.
        The right <InlineCodeLink href="/docs/calendar/installation">Calendar</InlineCodeLink> has
        no selected value or application callback, so clicking a day does not retain a selected-day
        highlight. Its displayed month can change internally, while the October 2024 heading is
        fixed. No date selection is connected to the central workspace or any scheduling service.
      </>
    ),
    adaptation: (
      <>
        Define which tools truly need persistent desktop space, and remove the right pane if they
        can live within page content. If keeping the calendar, connect its selection and displayed
        period to real data. Give mobile users an explicit utility entry point and test wide tables
        with both sidebars present before choosing final widths.
      </>
    ),
    accessibility: (
      <>
        Distinguish primary navigation from utility content with <strong>meaningful labels</strong>.
        Do not make keyboard users traverse a redundant second navigation area to reach the page.
        Check the mobile replacement for every essential control hidden with the right pane.
      </>
    ),
    alternatives: [
      {
        id: "sidebar-08",
        reason: (
          <>
            Offers application, project and utility links in one sidebar with an inset workspace,
            preserving more horizontal room for the page.
          </>
        ),
      },
      {
        id: "sidebar-12",
        reason: (
          <>
            Makes date selection the main sidebar task rather than a secondary tool on the far side
            of application content.
          </>
        ),
      },
    ],
  },
  "sidebar-16": {
    summary: (
      <>
        An application frame with a <strong>sticky site header</strong> spanning both navigation and
        workspace. The sidebar begins below that header instead of occupying the full top edge of
        the page. This gives global controls a consistent home while the left navigation continues
        to organize application areas, projects and account actions.
      </>
    ),
    value: (
      <>
        Useful when search or other <strong>application-wide controls</strong> should remain in one
        place as users move between pages. A full-width header can separate global actions from the
        sidebar's local navigation hierarchy. It also gives pages a common top boundary without
        requiring each page to reproduce the same toolbar.
      </>
    ),
    tradeoff: (
      <>
        The header and sidebar are geometrically coupled: <strong>changing header height</strong>{" "}
        without changing the sidebar offset can introduce overlap or empty space. Long labels, extra
        rows and zoom can challenge a fixed-height design. Global controls also need clear ownership
        so the site header does not become a collection of unrelated page actions.
      </>
    ),
    composition: (
      <>
        An outer wrapper defines <code>--header-height</code>.{" "}
        <InlineCodeLink href="/docs/sidebar/installation">SidebarProvider</InlineCodeLink> uses a
        column layout, with{" "}
        <ShowcaseCodeLink blockId="sidebar-16" file="components/site-header.tsx">
          <code>SiteHeader</code>
        </ShowcaseCodeLink>{" "}
        above a flex row containing{" "}
        <InlineCodeLink href="/docs/sidebar/installation">Sidebar</InlineCodeLink> and{" "}
        <InlineCodeLink href="/docs/sidebar/installation">SidebarInset</InlineCodeLink>. The
        sidebar's top and height classes reference that variable.{" "}
        <ShowcaseCodeLink blockId="sidebar-16" file="components/team-switcher.tsx">
          <code>TeamSwitcher</code>
        </ShowcaseCodeLink>
        ,{" "}
        <ShowcaseCodeLink blockId="sidebar-16" file="components/nav-main.tsx">
          <code>NavMain</code>
        </ShowcaseCodeLink>
        ,{" "}
        <ShowcaseCodeLink blockId="sidebar-16" file="components/nav-projects.tsx">
          <code>NavProjects</code>
        </ShowcaseCodeLink>{" "}
        and{" "}
        <ShowcaseCodeLink blockId="sidebar-16" file="components/nav-user.tsx">
          <code>NavUser</code>
        </ShowcaseCodeLink>{" "}
        provide the navigation; placeholder panels live directly in the inset.
      </>
    ),
    interaction: (
      <>
        <ShowcaseCodeLink blockId="sidebar-16" file="components/site-header.tsx">
          <code>SiteHeader</code>
        </ShowcaseCodeLink>{" "}
        includes the sidebar toggle and a demo search field. The sidebar uses the default off-canvas
        collapse, not icon mode. Team and menu state remain independent of page routing. Search does
        not produce results, the GitHub button has <strong>no destination</strong>, and the
        placeholder content is not automatically replaced when a navigation item is activated.
      </>
    ),
    adaptation: (
      <>
        Choose which controls are global, then keep their height and the sidebar's offset in sync.
        Replace the demo search with an application workflow and connect navigation data. Insert
        real pages in the existing inset, checking sticky layering and scroll targets so headings
        and focused controls are not hidden behind the site header.
      </>
    ),
    accessibility: (
      <>
        Test keyboard focus near the sticky header and sidebar boundary, including after anchor
        navigation and mobile-sheet dismissal. Keep a clear route to the main content and avoid
        covering focused controls when the header remains fixed in view.
      </>
    ),
    alternatives: [
      {
        id: "sidebar-07",
        reason: (
          <>
            Keeps the header inside the main workspace and offers a compact{" "}
            <strong>desktop icon rail</strong>, without the full-width site-header offset.
          </>
        ),
      },
      {
        id: "sidebar-08",
        reason: (
          <>
            Focuses on an inset workspace beside navigation, with no application-wide header
            spanning both regions.
          </>
        ),
      },
    ],
  },
} satisfies Record<SidebarBlockId, SidebarAboutContent>;
