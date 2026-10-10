import { withBasePath } from "../base-path";
import { BrandText } from "../docs/components/brand/BrandText";
import { CodeBlock } from "../docs/components/CodeBlock";
import { InlineCodeLink } from "../docs/components/InlineCodeLink";
import { ShowcaseCodeLink } from "./ShowcaseCodeLink";
/**
 * Explains the shell’s structure, interaction contracts, accessibility and design attribution.
 * @see https://www.shadcnblocks.com/block/application-shell1 — original visual reference.
 */

import { ExternalLinkIcon } from "@kamod-ch/icons/lucide";
import { BlockHeadingLink } from "./BlockHeadingLink";
import { BlockDocSection, BlockGuideHeading } from "./detail/BlockDocumentation";
import { RequiredIndicator } from "./RequiredIndicator";

/** Explains the block's composition, interaction contracts and customization in plain language. */
export const ShellExplanation = () => (
  <BlockDocSection
    id="application-shell-about"
    className="blocks-doc-explanation"
    introduction={
      <>
        <p>
          <strong>Application Shell 1 Is the Frame Around Your Application.</strong> It gives people
          a consistent place to navigate, understand where they are and reach their account
          controls, while your pages occupy the main content area. It suits dashboards, workspaces
          and internal tools that share navigation across several screens.
        </p>
      </>
    }
  >
    <section aria-labelledby="application-shell-structure">
      <BlockGuideHeading id="application-shell-structure" />
      <p>
        The layout has three parts: a sidebar, a compact header and a flexible content area.{" "}
        <strong>The Sidebar Keeps Context in View</strong> with a brand at the top, grouped links in
        the middle and an account menu at the bottom. The header places the sidebar toggle beside a
        vertical separator and a breadcrumb trail. A bottom border separates these controls from the
        page below.
      </p>
      <p>
        The block composes existing Kamod components.{" "}
        <InlineCodeLink href="/docs/sidebar/installation">SidebarProvider</InlineCodeLink>{" "}
        coordinates the sidebar controls,{" "}
        <ShowcaseCodeLink blockId="application-shell-1" file="app-sidebar.tsx">
          <code>AppSidebar</code>
        </ShowcaseCodeLink>{" "}
        combines the brand and navigation, and{" "}
        <InlineCodeLink href="/docs/sidebar/installation">SidebarInset</InlineCodeLink> provides the
        main landmark.{" "}
        <InlineCodeLink href="/docs/breadcrumb/installation">Breadcrumb</InlineCodeLink>,{" "}
        <InlineCodeLink href="/docs/collapsible/installation">Collapsible</InlineCodeLink>,{" "}
        <InlineCodeLink href="/docs/dropdown/installation">Dropdown</InlineCodeLink>,{" "}
        <InlineCodeLink href="/docs/avatar/installation">Avatar</InlineCodeLink> and{" "}
        <InlineCodeLink href="/docs/separator/installation">Separator</InlineCodeLink> supply the
        smaller pieces. This keeps the shell consistent with the rest of your Kamod interface and
        lets you customize a part without replacing the whole layout. Start with the{" "}
        <a href="#application-shell-usage">minimal integration</a>, then use{" "}
        <a href="#application-shell-prop-reference">Component Props</a> to introduce your
        application’s data.
      </p>
    </section>
    <section aria-labelledby="application-shell-navigation">
      <BlockGuideHeading id="application-shell-navigation" />
      <p>
        Navigation is driven by <code>navigationGroups</code>, displayed in the order you supply.
        Each group has a stable ID, an optional heading and its items. An item can be a direct link
        or a branch with <strong>One Level of Child Links</strong>. Branches expand inline in the
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
        <strong>Exact matching is intentional.</strong> The{" "}
        <ShowcaseCodeLink blockId="application-shell-1" file="nav-main.tsx">
          navigation helper
        </ShowcaseCodeLink>{" "}
        uses this expression to resolve an item’s active state:
      </p>
      <CodeBlock
        code="item.active ?? (item.href !== undefined && item.href === path);"
        language="tsx"
      />
      <p>
        An explicit <code>active={false}</code> overrides even a matching URL. Normalize trailing
        slashes in your route data, or supply <code>active</code> for a parent that should stay
        highlighted on descendant pages. The{" "}
        <a href="#application-shell-navigation-data">typed navigation example</a> shows how groups,
        items and child destinations fit together.
      </p>
      <p>
        <strong>The Shell Does Not Choose a Router for You.</strong> Links follow their URLs
        normally. To use client-side routing, handle <code>onNavigate(destination, event)</code>,
        call <code>event.preventDefault()</code> for the click you handle and update your route.
        Preserve Ctrl/Cmd, Shift and Alt clicks so browser shortcuts keep working. A leaf without an{" "}
        <code>href</code> acts as an action button; a branch without one only toggles its submenu.
        Breadcrumbs are supplied separately: the last entry describes the current page, while
        earlier entries may link to parent destinations. Use the{" "}
        <a href="#application-shell-callbacks">router adapter example</a> to preserve native browser
        actions.
      </p>
    </section>
    <section aria-labelledby="application-shell-responsive">
      <BlockGuideHeading id="application-shell-responsive" />
      <p>
        <strong>Desktop navigation keeps its hierarchy.</strong> At desktop widths, the sidebar
        starts expanded and can collapse to an icon rail. Direct links keep accessible names and
        tooltips; branches open dropdowns that expose their parent destination, when present, and
        child links. The header toggle and sidebar rail both control this state, so nested
        navigation remains reachable even when space is limited.
      </p>
      <p>
        Below the sidebar’s <code>768px</code> breakpoint, the same navigation moves into a modal
        sheet opened by the header toggle. The sheet starts closed and closes after an ordinary
        navigation selection, including a selection handled by your router. Modified clicks leave it
        open. On narrow screens, the breadcrumb trail shows only the current page to leave room for
        the toggle and page title.
      </p>
      <p>
        Use <code>defaultOpen</code> for an initial desktop preference, or pass <code>open</code>{" "}
        and <code>onOpenChange</code> to control it from your app. The callback can also observe
        changes in uncontrolled mode.{" "}
        <strong>Desktop Collapse and Mobile Visibility Are Independent</strong>: the mobile sheet
        manages its own state and does not overwrite the desktop preference. See{" "}
        <a href="#application-shell-state">Sidebar State</a> for controlled and persisted examples;
        mount one provider for this frame.
      </p>
    </section>
    <section aria-labelledby="application-shell-account">
      <BlockGuideHeading id="application-shell-account" />
      <p>
        The footer displays the user's name, email and optional avatar. When an image is
        unavailable, it shows initials from the first two words of the name, or the initials you
        provide. The account menu offers{" "}
        <strong>Account, Billing, Notifications and Log Out</strong>. Choosing one reports its
        identifier through <code>onUserAction</code> and dismisses the menu. Connect these callbacks
        to your own pages, dialogs or authentication service; the block itself does not manage a
        session. The <a href="#application-shell-callbacks">account action reference</a> lists the
        exact identifiers, and{" "}
        <ShowcaseCodeLink blockId="application-shell-1" file="nav-user.tsx">
          <code>nav-user.tsx</code>
        </ShowcaseCodeLink>{" "}
        is the place to change which actions are offered.
      </p>
      <div role="paragraph">
        Everything passed as <code>children</code> appears beneath the header inside the existing{" "}
        <code>main</code> landmark. Replace the demo's muted placeholders with a dashboard, form,
        table or routed page. The content wrapper provides padding and flexible vertical space,
        while your page owns its headings, loading states and data. Avoid nesting another{" "}
        <code>main</code> element inside the shell.{" "}
        <RequiredIndicator label="Main Landmark Requirement" tooltip="Use a single main landmark" />
      </div>
    </section>
    <section aria-labelledby="application-shell-accessibility">
      <BlockGuideHeading id="application-shell-accessibility" />
      <p>
        Navigation controls retain accessible labels in icon mode, current links expose{" "}
        <code>aria-current</code>, and disclosure buttons report whether their content is expanded.
        Menus focus the first enabled item when opened; Arrow Up/Down move between items and
        Home/End jump to the first or last. Escape closes a menu and returns focus to its trigger.
        Inside the mobile sheet, closing the account menu with Escape leaves the sheet open; a
        subsequent Escape closes the sheet and restores focus to its opener.
      </p>
      <p>
        Colors come from{" "}
        <a href={withBasePath("/blocks/theming#understand-the-sidebar-token-family")}>
          semantic sidebar tokens
        </a>
        , including <code>bg-sidebar</code>, <code>text-sidebar-foreground</code> and{" "}
        <code>border-sidebar-border</code>. Pair page surfaces with <code>bg-background</code> and{" "}
        <code>text-foreground</code>. The same markup supports light and dark themes, and
        reduced-motion preferences suppress the shell's transitions and animations. Keep labels
        meaningful, maintain visible focus styles and use the{" "}
        <a href={withBasePath("/docs/theming/css-setup")}>app-wide theme setup</a> when adapting the
        block. Long labels and email addresses truncate visually, so concise names remain easier to
        scan.
      </p>
    </section>
    <section aria-labelledby="application-shell-demo">
      <BlockGuideHeading id="application-shell-demo" />
      <p>
        Start by replacing the brand, navigation groups, user data and breadcrumbs. Keep group and
        item IDs stable, supply real destination URLs and connect the callbacks your app needs. Use{" "}
        <code>class</code> or <code>className</code> for wrapper styling, and edit the copied
        components when you need a different header, account action or navigation arrangement.
      </p>
      <p>
        The showcase’s sample workspace and hash links live in{" "}
        <ShowcaseCodeLink blockId="application-shell-1" file="demo-data.tsx">
          <code>demo-data.tsx</code>
        </ShowcaseCodeLink>
        . <code>preview.tsx</code> adds local selection messages and placeholder panels so you can
        explore the interactions without an application backend. These files are optional:
        <strong>
          {" "}
          The Reusable Shell Has No Dependency on the Demo's Content or Routing State.
        </strong>{" "}
        After integration, check your longest labels, nested destinations and account actions on
        both a narrow screen and a desktop, using the keyboard as well as the pointer. Include a
        failed page request and an empty result: those belong in your page content while the
        navigation remains usable. The{" "}
        <a href={withBasePath("/docs/getting-started#verify-the-whole-journey")}>
          whole-journey checklist
        </a>{" "}
        gives you a final review sequence.
      </p>
    </section>
  </BlockDocSection>
);

/** Credits the source design in a standalone section with adaptation and setup guidance. */
export const ShellDesignReference = () => (
  <BlockDocSection
    id="application-shell-reference"
    className="blocks-doc-reference"
    introduction={
      <>
        <p>
          The original Shadcnblocks layout brings grouped navigation, a breadcrumb header and an
          account menu into one application frame. Use it to compare the placement of controls and
          the balance between navigation and page content. When adapting the Kamod version, start
          with your own navigation hierarchy and route names, then use the{" "}
          <a class="underline" href="#application-shell-navigation-data">
            Typed Navigation Example
          </a>{" "}
          and callback reference above to connect destinations and account actions to your app.
        </p>
      </>
    }
  >
    <div class="blocks-doc-attribution">
      <div class="blocks-doc-attribution-header">
        <p class="blocks-doc-attribution-title">
          <BlockHeadingLink id="application-shell-reference">Attribution:</BlockHeadingLink>{" "}
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
        <BrandText>
          This block adapts the original sidebar, breadcrumb header and account menu using Kamod's
          Preact components and theme tokens. Your application supplies its routing and account
          actions.
        </BrandText>
      </p>
      <p class="blocks-doc-attribution-note">
        Map the layout to your own pages with the{" "}
        <a href="#application-shell-navigation-data">Typed Navigation Example</a>.
      </p>
    </div>
    <p class="blocks-doc-reference-note">
      Use the reference to compare the layout and interactions. To add this version to your app, use
      the source in this page's <strong>Code</strong> tab and follow the{" "}
      <a class="underline" href="#application-shell-installation">
        Kamod Setup Instructions
      </a>{" "}
      above.
    </p>
  </BlockDocSection>
);
