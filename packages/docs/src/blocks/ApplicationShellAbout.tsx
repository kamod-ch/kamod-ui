/**
 * Explains the shell’s structure, interaction contracts, accessibility and design attribution.
 * @see https://www.shadcnblocks.com/block/application-shell1 — original visual reference.
 */
import { ExternalLinkIcon } from "@kamod-ch/icons/lucide";
import { RequiredIndicator } from "./RequiredIndicator";
import { ShellHeadingLink } from "./ShellHeadingLink";

/** Explains the block's composition, interaction contracts and customization in plain language. */
export const ShellExplanation = () => (
  <section
    class="blocks-doc-section blocks-doc-explanation"
    aria-labelledby="application-shell-about"
  >
    <header class="blocks-doc-section-header">
      <p class="blocks-doc-eyebrow">A closer look</p>
      <h2 id="application-shell-about" tabIndex={-1}>
        <ShellHeadingLink id="application-shell-about">About this block</ShellHeadingLink>
      </h2>
      <p>
        <strong>Application Shell 1 is the frame around your application.</strong> It gives people a
        consistent place to navigate, understand where they are and reach their account controls,
        while your pages occupy the main content area. It suits dashboards, workspaces and internal
        tools that share navigation across several screens.
      </p>
    </header>
    <section aria-labelledby="application-shell-structure">
      <h3 id="application-shell-structure" tabIndex={-1}>
        <ShellHeadingLink id="application-shell-structure">
          Structure and composition
        </ShellHeadingLink>
      </h3>
      <p>
        The layout has three parts: a sidebar, a compact header and a flexible content area.{" "}
        <strong>The sidebar keeps context in view</strong> with a brand at the top, grouped links in
        the middle and an account menu at the bottom. The header places the sidebar toggle beside a
        vertical separator and a breadcrumb trail. A bottom border separates these controls from the
        page below.
      </p>
      <p>
        The block composes existing Kamod components. <code>SidebarProvider</code> coordinates the
        sidebar controls, <code>AppSidebar</code> combines the brand and navigation, and{" "}
        <code>SidebarInset</code> provides the main landmark. Breadcrumb, Collapsible, Dropdown,
        Avatar and Separator supply the smaller pieces. This keeps the shell consistent with the
        rest of your Kamod interface and lets you customize a part without replacing the whole
        layout.
      </p>
    </section>
    <section aria-labelledby="application-shell-navigation">
      <h3 id="application-shell-navigation" tabIndex={-1}>
        <ShellHeadingLink id="application-shell-navigation">
          Navigation and routing
        </ShellHeadingLink>
      </h3>
      <p>
        Navigation is driven by <code>navigationGroups</code>, displayed in the order you supply.
        Each group has a stable ID, an optional heading and its items. An item can be a direct link
        or a branch with <strong>one level of child links</strong>. Branches expand inline in the
        full sidebar. If a parent also has an <code>href</code>, its link and disclosure toggle stay
        separate, so opening a submenu does not unexpectedly navigate away.
      </p>
      <p>
        Pass <code>currentPath</code> to highlight links by an exact match with their{" "}
        <code>href</code>. An item's explicit <code>active</code> value takes precedence, including{" "}
        <code>false</code>. A branch initially opens when it or a child is active; later path
        changes update the highlight without overriding the user's disclosure choice. Disabled items
        cannot be activated, and disabling a branch also disables its child links.
      </p>
      <p>
        <strong>The shell does not choose a router for you.</strong> Links follow their URLs
        normally. To use client-side routing, handle <code>onNavigate(destination, event)</code>,
        call <code>event.preventDefault()</code> for the click you handle and update your route.
        Preserve Ctrl/Cmd, Shift and Alt clicks so browser shortcuts keep working. A leaf without an{" "}
        <code>href</code> acts as an action button; a branch without one only toggles its submenu.
        Breadcrumbs are supplied separately: the last entry describes the current page, while
        earlier entries may link to parent destinations.
      </p>
    </section>
    <section aria-labelledby="application-shell-responsive">
      <h3 id="application-shell-responsive" tabIndex={-1}>
        <ShellHeadingLink id="application-shell-responsive">
          Responsive behavior and state
        </ShellHeadingLink>
      </h3>
      <p>
        At desktop widths, the sidebar starts expanded and can collapse to an icon rail. Direct
        links keep accessible names and tooltips; branches open dropdowns that expose their parent
        destination, when present, and child links. The header toggle and sidebar rail both control
        this state, so nested navigation remains reachable even when space is limited.
      </p>
      <p>
        Below the sidebar's 768px breakpoint, the same navigation moves into a modal sheet opened by
        the header toggle. The sheet starts closed and closes after an ordinary navigation
        selection, including a selection handled by your router. Modified clicks leave it open. On
        narrow screens, the breadcrumb trail shows only the current page to leave room for the
        toggle and page title.
      </p>
      <p>
        Use <code>defaultOpen</code> for an initial desktop preference, or pass <code>open</code>{" "}
        and <code>onOpenChange</code> to control it from your app. The callback can also observe
        changes in uncontrolled mode.{" "}
        <strong>Desktop collapse and mobile visibility are independent</strong>: the mobile sheet
        manages its own state and does not overwrite the desktop preference.
      </p>
    </section>
    <section aria-labelledby="application-shell-account">
      <h3 id="application-shell-account" tabIndex={-1}>
        <ShellHeadingLink id="application-shell-account">
          Account menu and page content
        </ShellHeadingLink>
      </h3>
      <p>
        The footer displays the user's name, email and optional avatar. When an image is
        unavailable, it shows initials from the first two words of the name, or the initials you
        provide. The account menu offers <em>Account</em>, <em>Billing</em>, <em>Notifications</em>{" "}
        and <em>Log out</em>. Choosing one reports its identifier through <code>onUserAction</code>{" "}
        and dismisses the menu. Connect these callbacks to your own pages, dialogs or authentication
        service; the block itself does not manage a session.
      </p>
      <div role="paragraph">
        Everything passed as <code>children</code> appears beneath the header inside the existing{" "}
        <code>main</code> landmark. Replace the demo's muted placeholders with a dashboard, form,
        table or routed page. The content wrapper provides padding and flexible vertical space,
        while your page owns its headings, loading states and data. Avoid nesting another{" "}
        <code>main</code> element inside the shell.{" "}
        <RequiredIndicator label="Main landmark requirement" tooltip="Use a single main landmark" />
      </div>
    </section>
    <section aria-labelledby="application-shell-accessibility">
      <h3 id="application-shell-accessibility" tabIndex={-1}>
        <ShellHeadingLink id="application-shell-accessibility">
          Accessibility and styling
        </ShellHeadingLink>
      </h3>
      <p>
        Navigation controls retain accessible labels in icon mode, current links expose{" "}
        <code>aria-current</code>, and disclosure buttons report whether their content is expanded.
        Menus focus the first enabled item when opened; Arrow Up/Down move between items and
        Home/End jump to the first or last. Escape closes a menu and returns focus to its trigger.
        Inside the mobile sheet, closing the account menu with Escape leaves the sheet open; a
        subsequent Escape closes the sheet and restores focus to its opener.
      </p>
      <p>
        Colors come from <strong>Kamod's semantic theme tokens</strong>, including background,
        foreground, border, muted and sidebar colors. The same markup supports light and dark
        themes, and reduced-motion preferences suppress the shell's transitions and animations. Keep
        labels meaningful, maintain visible focus styles and use your app's theme setup when
        adapting the block. Long labels and email addresses truncate visually, so concise names
        remain easier to scan.
      </p>
    </section>
    <section aria-labelledby="application-shell-demo">
      <h3 id="application-shell-demo" tabIndex={-1}>
        <ShellHeadingLink id="application-shell-demo">Making it your own</ShellHeadingLink>
      </h3>
      <p>
        Start by replacing the brand, navigation groups, user data and breadcrumbs. Keep group and
        item IDs stable, supply real destination URLs and connect the callbacks your app needs. Use{" "}
        <code>class</code> or <code>className</code> for wrapper styling, and edit the copied
        components when you need a different header, account action or navigation arrangement.
      </p>
      <p>
        The showcase's sample workspace and hash links live in <code>demo-data.tsx</code>.{" "}
        <code>preview.tsx</code> adds local selection messages and placeholder panels so you can
        explore the interactions without an application backend. These files are optional:
        <strong>
          {" "}
          the reusable shell has no dependency on the demo's content or routing state.
        </strong>{" "}
        After integration, check your longest labels, nested destinations and account actions on
        both a narrow screen and a desktop, using the keyboard as well as the pointer.
      </p>
    </section>
  </section>
);

/** Credits the source design in a standalone section with adaptation and setup guidance. */
export const ShellDesignReference = () => (
  <section
    class="blocks-doc-section blocks-doc-reference"
    aria-labelledby="application-shell-reference"
  >
    <header class="blocks-doc-section-header">
      <p class="blocks-doc-eyebrow">Design inspiration</p>
      <h2 id="application-shell-reference" tabIndex={-1}>
        <ShellHeadingLink id="application-shell-reference">Design reference</ShellHeadingLink>
      </h2>
      <p>
        The original Shadcnblocks layout brings grouped navigation, a breadcrumb header and an
        account menu into one application frame. Use it to compare the placement of controls and the
        balance between navigation and page content. When adapting the Kamod version, start with
        your own navigation hierarchy and route names, then use the{" "}
        <a class="underline" href="#application-shell-navigation-data">
          typed navigation example
        </a>{" "}
        and callback reference above to connect destinations and account actions to your app.
      </p>
    </header>
    <div class="blocks-doc-attribution">
      <div class="blocks-doc-attribution-header">
        <p class="blocks-doc-attribution-title">
          <ShellHeadingLink id="application-shell-reference">Attribution:</ShellHeadingLink>{" "}
          <a
            class="blocks-doc-attribution-source"
            href="https://www.shadcnblocks.com/block/application-shell1"
            target="_blank"
            rel="noreferrer noopener"
          >
            Shadcnblocks Application Shell 1
            <span class="blocks-doc-attribution-icon" aria-hidden="true">
              <ExternalLinkIcon
                size={16}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </span>
          </a>
          .
        </p>
      </div>
      <p>
        This block adapts the original sidebar, breadcrumb header and account menu using Kamod's
        Preact components and theme tokens. Your application supplies its routing and account
        actions.
      </p>
      <p class="blocks-doc-attribution-note">
        Map the layout to your own pages with the{" "}
        <a href="#application-shell-navigation-data">typed navigation example</a>.
      </p>
    </div>
    <p class="blocks-doc-reference-note">
      Use the reference to compare the layout and interactions. To add this version to your app, use
      the source in this page's <strong>Code</strong> tab and follow the{" "}
      <a class="underline" href="#application-shell-installation">
        Kamod setup instructions
      </a>{" "}
      above.
    </p>
  </section>
);
