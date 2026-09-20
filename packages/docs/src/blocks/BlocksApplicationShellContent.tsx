/**
 * @file Application shell category, detail and standalone preview page content.
 * The registry supplies variant metadata; raw source imports power the copyable Code tab.
 * Internal URLs use withBasePath so these routes also work under the GitHub Pages prefix.
 * @see https://www.shadcnblocks.com/blocks/application-shell — related application shell catalog.
 * @see https://www.shadcnblocks.com/block/application-shell1 — block and detail-header design reference.
 */
import {
  type ApplicationShell1Props,
  applicationShellBlocks,
} from "@kamod-ch/blocks/application-shell";
import {
  ArrowLeftIcon,
  BugIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  LinkIcon,
  RefreshCwIcon,
} from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { withBasePath } from "../base-path";
import { CodeBlock } from "../docs/components/CodeBlock";
import { DocsShell } from "../docs/components/DocsShell";
import { DemoShell, demoTopNavItems } from "../layout/DemoShell";
import { applicationShellSources } from "./application-shell-source";
import { BlockPreviewPanel } from "./BlockPreviewPanel";
import { BlocksTopbarActions } from "./BlocksSidebarContent";

const categoryPath = "/blocks/application-shell";
const repositoryUrl = "https://github.com/kamod-ch/kamod-ui";
/** One registry entry, keeping page props aligned with the available block metadata. */
type ApplicationShellBlock = (typeof applicationShellBlocks)[number];

/**
 * Makes a heading a native permalink with a link icon revealed on hover or keyboard focus.
 * The decorative icon sits outside the text flow, preserving alignment and accessible names.
 * @param props - The fragment target (or `top`) and the visible heading content.
 */
const ShellHeadingLink = ({ id, children }: { id: string; children: ComponentChildren }) => (
  <a class="blocks-doc-heading-link" href={`#${id}`}>
    <span class="blocks-doc-heading-icon" aria-hidden="true">
      <LinkIcon size={14} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </span>
    {children}
  </a>
);

/**
 * Introduces the variant and provides category, adjacent-variant and repository links.
 * Registry order determines previous/next destinations; missing neighbours render as
 * native disabled buttons rather than inert anchors. The source URL targets upstream
 * main, where the block becomes available once this feature is merged.
 *
 * @param props - The registered variant displayed by this detail page.
 */
const ShellPageHeader = ({ block }: { block: ApplicationShellBlock }) => {
  const displayName = `Application Shell ${block.id.replace("application-shell-", "")}`;
  const index = applicationShellBlocks.findIndex((entry) => entry.id === block.id);
  const neighbours = [
    {
      label: "Previous",
      rel: "prev",
      block: applicationShellBlocks[index - 1],
      Icon: ChevronLeftIcon,
    },
    {
      label: "Next",
      rel: "next",
      block: applicationShellBlocks[index + 1],
      Icon: ChevronRightIcon,
    },
  ];
  const sourceUrl = `${repositoryUrl}/tree/main/packages/blocks/src/${block.category}/${block.id}`;
  const issueQuery = new URLSearchParams({
    title: `bug(blocks): ${block.title} — `,
    body: `Block: ${block.title}\nSource: ${sourceUrl}\n\n### What happened?\n\n### Steps to reproduce\n\n1. \n\n### Expected behavior\n\n### Browser and screen size\n\n`,
  });

  return (
    <header class="blocks-shell-header" aria-labelledby={`${block.id}-overview`}>
      <div class="blocks-shell-header-intro">
        <a class="blocks-detail-back blocks-shell-header-back" href={withBasePath(categoryPath)}>
          <ArrowLeftIcon
            size={16}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          />
          All application shell blocks
        </a>
        <div class="blocks-shell-header-title-row">
          <h1 id={`${block.id}-overview`} tabIndex={-1}>
            <ShellHeadingLink id="top">
              {displayName} — Sidebar shell with breadcrumbs
            </ShellHeadingLink>
          </h1>
          <Badge variant="info" size="lg" class="py-1.5">
            Preact native
          </Badge>
        </div>
        <p>
          A responsive frame for your application, with a collapsible sidebar, grouped navigation,
          nested links and an account menu. Add your pages beneath the breadcrumb header and connect
          your own routing and user actions.
        </p>
      </div>
      <div class="blocks-shell-header-toolbar">
        <Breadcrumb aria-label="Block breadcrumb">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={withBasePath("/")}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={withBasePath("/blocks")}>Blocks</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={withBasePath(categoryPath)}>Application Shell</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{block.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div
          class="blocks-shell-header-actions"
          role="group"
          aria-label="Block navigation and links"
        >
          {neighbours.map(({ label, rel, block: neighbour, Icon }) => (
            <Button
              key={rel}
              variant="ghost"
              size="icon"
              {...(neighbour
                ? { href: withBasePath(`${categoryPath}/${neighbour.id}`), rel }
                : { type: "button", disabled: true })}
              aria-label={
                neighbour ? `${label} variant: ${neighbour.title}` : `${label} variant unavailable`
              }
              title={
                neighbour ? `${label}: ${neighbour.title}` : `No ${label.toLowerCase()} variant`
              }
            >
              <Icon
                size={16}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              />
            </Button>
          ))}
          <Button
            variant="ghost"
            size="icon"
            href={`${repositoryUrl}/issues/new?${issueQuery}`}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`Report a bug with ${block.title} on GitHub (opens in a new tab)`}
            title="Report a bug on GitHub"
          >
            <BugIcon
              size={16}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            href={sourceUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`View ${block.title} source on GitHub (opens in a new tab)`}
            title="View source on GitHub"
          >
            <BrandGithubIcon size={16} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  );
};

/**
 * Renders the category overview with one detail-page link per registered application shell.
 * Uses the shared docs sidebar and marks Application Shell as the active block category.
 */
export const BlocksApplicationShellContent = () => (
  <DocsShell
    sidebarScope="blocks"
    activeDoc={null}
    activeSection=""
    docs={[]}
    activeBlock="application-shell"
    mainContent={
      <section class="docs-components-overview blocks-sidebar-page">
        <header class="blocks-hero">
          <h1>Application Shell Blocks</h1>
          <p class="blocks-hero-lead">
            Responsive application layouts built with Preact and Kamod UI.
          </p>
        </header>
        <ul class="docs-package-overview-grid blocks-overview-grid">
          {applicationShellBlocks.map((block) => (
            <li key={block.id}>
              <a
                class="docs-package-overview-card blocks-overview-card"
                href={withBasePath(`${categoryPath}/${block.id}`)}
              >
                <span class="docs-package-overview-label">{block.title}</span>
                <span class="docs-package-overview-summary">{block.description}</span>
                <code class="docs-package-overview-path">{block.installCommand}</code>
              </a>
            </li>
          ))}
        </ul>
      </section>
    }
  />
);

const shellImport = `import { ApplicationShell1 } from "./components/application-shell-1";`;
const shellDependencies = "@kamod-ch/ui @kamod-ch/icons @kamod-ch/themes @preact/signals";
const dependencyCommands = {
  pnpm: `pnpm add ${shellDependencies}`,
  npm: `npm install ${shellDependencies}`,
  yarn: `yarn add ${shellDependencies}`,
};

/**
 * Explains copying the block, installing missing dependencies and enabling its styles.
 * The blocks package is private, so the example imports from the reader's local components.
 * The compatibility note identifies the public dropdown hook required by the menu adapters.
 */
const ShellSetup = () => (
  <section class="blocks-doc-section" aria-labelledby="application-shell-installation">
    <header class="blocks-doc-section-header">
      <p class="blocks-doc-eyebrow">Getting started</p>
      <h2 id="application-shell-installation" tabIndex={-1}>
        <ShellHeadingLink id="application-shell-installation">Add this block</ShellHeadingLink>
      </h2>
      <p>
        Add a complete navigation layout to an existing Preact app in three steps. Copy the source,
        connect the Kamod dependencies and bring your own pages. The files live in your project, so
        you can adapt the sidebar, header and account menu as your application grows.
      </p>
    </header>
    <ol class="blocks-doc-steps" role="list">
      <li>
        <h3 id="application-shell-copy" tabIndex={-1}>
          <ShellHeadingLink id="application-shell-copy">Copy the block</ShellHeadingLink>
        </h3>
        <p>
          Copy the Code-tab files into <code>src/components/application-shell-1</code>. Skip{" "}
          <code>preview.tsx</code> and <code>demo-data.tsx</code> unless you want the demo.
        </p>
        <p>
          <strong>Keep the reusable files together:</strong> <code>application-shell-1.tsx</code>,{" "}
          <code>app-sidebar.tsx</code>, <code>nav-main.tsx</code>, <code>nav-user.tsx</code>,{" "}
          <code>menu.tsx</code>, <code>types.ts</code> and <code>index.ts</code>. Their relative
          imports work within this folder; the entrypoint exports the component and its public
          types.
        </p>
      </li>
      <li>
        <h3 id="application-shell-dependencies" tabIndex={-1}>
          <ShellHeadingLink id="application-shell-dependencies">
            Install missing dependencies
          </ShellHeadingLink>
        </h3>
        <p>
          Install the packages your app does not already have. Kamod UI supplies the interactive
          components, Icons supplies the SVG icons, and Themes and Preact Signals support the shared
          styling and state setup. Use your project's existing package manager.
        </p>
        <Tabs defaultValue="pnpm" class="docs-tabs">
          <TabsList class="docs-tabs-list" variant="line" aria-label="Package manager">
            {Object.keys(dependencyCommands).map((manager) => (
              <TabsTrigger key={manager} value={manager}>
                {manager}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(dependencyCommands).map(([manager, command]) => (
            <TabsContent key={manager} value={manager}>
              <CodeBlock code={command} language="bash" className="docs-tab-code" />
            </TabsContent>
          ))}
        </Tabs>
        <p class="blocks-doc-note">
          <strong>Compatibility:</strong> <code>@kamod-ch/ui</code> must export{" "}
          <code>useDropdown</code>. The shell's menu adapters use this hook. If your installed
          release does not include it, use a release that does before integrating the block.
        </p>
      </li>
      <li>
        <h3 id="application-shell-styles" tabIndex={-1}>
          <ShellHeadingLink id="application-shell-styles">
            Set up styles and import
          </ShellHeadingLink>
        </h3>
        <p>
          Follow the{" "}
          <a class="underline" href={withBasePath("/docs/theming/css-setup")}>
            theme and Tailwind setup
          </a>{" "}
          in your app's global stylesheet, then ensure Tailwind scans the copied files as well as
          the Kamod components. An app that already uses Kamod can keep its existing theme setup.
          Import the shell from your new local folder:
        </p>
        <CodeBlock code={shellImport} language="tsx" />
        <p class="blocks-doc-note">
          <strong>Check the first render:</strong> the sidebar, borders and page background should
          follow your app's theme. If the layout appears unstyled, check the global CSS import and
          Tailwind source detection before changing the block's classes.
        </p>
      </li>
    </ol>
  </section>
);

const usage = `${shellImport}

export const App = () => (
  <ApplicationShell1
    brand={{ name: "Acme Inc", description: "Enterprise", href: "/" }}
    navigationGroups={[{
      id: "workspace", label: "Workspace",
      items: [{ id: "overview", label: "Overview", href: "/overview" }],
    }]}
    user={{ name: "Alex Morgan", email: "alex@example.com" }}
    breadcrumbs={[{ label: "Overview" }]}
    currentPath="/overview"
    onUserAction={(action) => console.log(action)}
  >
    <h1 class="text-2xl font-semibold">Overview</h1>
    <p>Your application content goes here.</p>
  </ApplicationShell1>
);`;

/** Shows a minimal integration and identifies where the app connects routing and account actions. */
const ShellUsage = () => (
  <section class="blocks-doc-section" aria-labelledby="application-shell-usage">
    <header class="blocks-doc-section-header">
      <h2 id="application-shell-usage" tabIndex={-1}>
        <ShellHeadingLink id="application-shell-usage">Usage</ShellHeadingLink>
      </h2>
      <p>
        Pass your brand, navigation, user and breadcrumbs, then place your page content inside the
        shell. Mount it in your app's shared layout so pages can reuse the same navigation. The
        example below starts with one destination and lets the shell manage its own sidebar state.
      </p>
    </header>
    <CodeBlock code={usage} language="tsx" />
    <dl class="blocks-doc-callouts">
      <div>
        <dt>Connect navigation</dt>
        <dd>
          Links use their <code>href</code> by default. With a client router, pass its current path
          to <code>currentPath</code> and handle ordinary clicks in <code>onNavigate</code>. Update
          the breadcrumbs with each page; they are not inferred from the navigation tree.
        </dd>
      </div>
      <div>
        <dt>Connect account actions</dt>
        <dd>
          Replace the example's console logging with your account, billing, notification and logout
          handlers. Place your routed content inside the shell; it already provides the page's{" "}
          <code>main</code> landmark and content padding.
        </dd>
      </div>
    </dl>
  </section>
);

const navigationExample = `import type { ApplicationShellNavigationGroup } from "./components/application-shell-1";

export const navigationGroups = [{
  id: "workspace",
  label: "Workspace",
  items: [{
    id: "projects",
    label: "Projects",
    href: "/projects",
    items: [{ id: "recent", label: "Recent projects", href: "/projects/recent" }],
  }],
}] satisfies readonly ApplicationShellNavigationGroup[];`;

/** Public prop names and their actual defaults; required data has no built-in fallback. */
const shellPropRows: readonly [
  prop: keyof ApplicationShell1Props,
  description: ComponentChildren,
  defaultValue: "Required" | "undefined" | "true",
][] = [
  ["brand", "name, optional description, href and logo (Preact content).", "Required"],
  [
    "navigationGroups",
    <>
      Groups with id, optional label and items. Each item has id, label, optional href, icon,
      active, disabled and one level of child items. See{" "}
      <a class="underline" href="#application-shell-navigation-data">
        Type your navigation data
      </a>
      .
    </>,
    "Required",
  ],
  [
    "user",
    "name, email, optional avatarSrc and initials. Initials default to the user's name.",
    "Required",
  ],
  [
    "breadcrumbs",
    "An ordered list of { label, href? }. The final entry is the current page; earlier entries hide on mobile.",
    "Required",
  ],
  ["children", "Your page content, rendered inside the main landmark.", "undefined"],
  [
    "currentPath",
    "Exact href match for active links. An item's explicit active value takes precedence.",
    "undefined",
  ],
  [
    "onNavigate",
    "Receives (destination, event) for navigation, brand and breadcrumb clicks. Call event.preventDefault() for client routing. Items without href act as buttons.",
    "undefined",
  ],
  [
    "onUserAction",
    "Receives account, billing, notifications or logout. Supply your own actions; no authentication is included.",
    "undefined",
  ],
  [
    "open",
    "Controlled desktop sidebar state. Pass with onOpenChange; omit to let the shell manage its state.",
    "undefined",
  ],
  [
    "defaultOpen",
    "Initial desktop state when uncontrolled; true means expanded. Ignored when open is supplied. The mobile sheet starts closed independently.",
    "true",
  ],
  [
    "onOpenChange",
    "Receives the next desktop open state. Update open when controlled; can also observe uncontrolled changes.",
    "undefined",
  ],
  ["class", "Additional classes on the shell wrapper.", "undefined"],
  ["className", "Alias for class; merged after it when both are supplied.", "undefined"],
];

/** Reference table and typed navigation example for the shell's public inputs. */
const ShellProps = () => (
  <section class="blocks-doc-section" aria-labelledby="application-shell-props">
    <header class="blocks-doc-section-header">
      <h2 id="application-shell-props" tabIndex={-1}>
        <ShellHeadingLink id="application-shell-props">Props and data</ShellHeadingLink>
      </h2>
      <p>
        Supply your app's data and callbacks; the shell handles layout and navigation controls.{" "}
        <code>brand</code>, <code>navigationGroups</code>, <code>user</code> and{" "}
        <code>breadcrumbs</code> are required and have no default. The remaining props are optional,
        so you can start with native links and add routing or controlled sidebar state when needed.
      </p>
    </header>
    <div
      class="blocks-doc-table"
      role="region"
      aria-labelledby="application-shell-props"
      tabIndex={0}
    >
      <table>
        <caption class="sr-only">ApplicationShell1 props, descriptions and default values</caption>
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Description</th>
            <th scope="col">Default value</th>
          </tr>
        </thead>
        <tbody>
          {shellPropRows.map(([prop, description, defaultValue]) => (
            <tr key={prop}>
              <th scope="row">
                <code>{prop}</code>
              </th>
              <td>{description}</td>
              <td>{defaultValue === "Required" ? defaultValue : <code>{defaultValue}</code>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <section class="blocks-doc-data-example" aria-labelledby="application-shell-navigation-data">
      <h3 id="application-shell-navigation-data" tabIndex={-1}>
        <ShellHeadingLink id="application-shell-navigation-data">
          Type your navigation data
        </ShellHeadingLink>
      </h3>
      <p>
        The local entrypoint also exports the data and callback types. Use stable IDs for groups and
        items, and keep child destinations to one level. This example gives Projects its own page as
        well as an expandable child link; pass the resulting array to <code>navigationGroups</code>.
      </p>
      <CodeBlock code={navigationExample} language="tsx" />
    </section>
  </section>
);

/** Explains the block's composition, interaction contracts and customization in plain language. */
const ShellExplanation = () => (
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
        Preserve Ctrl/Cmd, Shift and Alt clicks so browser shortcuts keep working. An item without
        an <code>href</code> acts as a button. Breadcrumbs are supplied separately: the last entry
        describes the current page, while earlier entries may link to parent destinations.
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
      <p>
        Everything passed as <code>children</code> appears beneath the header inside the existing{" "}
        <code>main</code> landmark. Replace the demo's muted placeholders with a dashboard, form,
        table or routed page. The content wrapper provides padding and flexible vertical space,
        while your page owns its headings, loading states and data. Avoid nesting another{" "}
        <code>main</code> element inside the shell.
      </p>
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
const ShellDesignReference = () => (
  <section
    class="blocks-doc-section blocks-doc-reference"
    aria-labelledby="application-shell-reference"
  >
    <header class="blocks-doc-section-header">
      <h2 id="application-shell-reference" tabIndex={-1}>
        <ShellHeadingLink id="application-shell-reference">Design reference</ShellHeadingLink>
      </h2>
      <p>
        The starting point for this layout, with credit to the original design and notes on the
        Kamod adaptation.
      </p>
    </header>
    <div class="blocks-doc-attribution">
      <div class="blocks-doc-attribution-header">
        <Badge variant="outline" size="sm" class="blocks-doc-attribution-badge">
          Design inspiration
        </Badge>
        <p class="blocks-doc-attribution-title">
          <ShellHeadingLink id="application-shell-reference">Attribution:</ShellHeadingLink>{" "}
          <a
            class="blocks-doc-attribution-source"
            href="https://www.shadcnblocks.com/block/application-shell1"
            target="_blank"
            rel="noreferrer"
          >
            Shadcnblocks Application Shell 1
            <span class="blocks-doc-attribution-icon" aria-hidden="true">
              <ExternalLinkIcon
                size={18}
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

/**
 * Presents one variant's responsive preview, source browser and setup/usage instructions.
 * Preview resets and file selection belong to this docs view, separate from shell state.
 *
 * @param props - A resolved registry entry with matching raw source files.
 */
const ShellDetail = ({ block }: { block: ApplicationShellBlock }) => {
  const [selectedFile, setSelectedFile] = useState(block.files[0].label);
  // A new key remounts the preview, resetting its sidebar, menus and demo selections.
  const [previewKey, setPreviewKey] = useState(0);
  const previewUrl = withBasePath(`${categoryPath}/${block.id}/preview`);
  return (
    <>
      <ShellPageHeader block={block} />
      <article
        id={block.id}
        class="blocks-card"
        tabIndex={-1}
        aria-label={`${block.title} showcase`}
      >
        <div class="blocks-card-header">
          <div>
            <h2 class="blocks-card-title">
              <ShellHeadingLink id={block.id}>{block.title}</ShellHeadingLink>
            </h2>
            <p class="blocks-card-desc">{block.description}</p>
          </div>
          <div class="blocks-card-actions">
            <Button size="sm" variant="outline" onClick={() => setPreviewKey((key) => key + 1)}>
              <RefreshCwIcon
                size={14}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              />
              Refresh Preview
            </Button>
            <Button size="sm" variant="outline" href={previewUrl} target="_blank" rel="noreferrer">
              <ExternalLinkIcon
                size={14}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              />
              Open in New Tab
            </Button>
          </div>
        </div>
        <div class="blocks-card-body">
          <Tabs defaultValue="preview" class="docs-tabs">
            <TabsList class="docs-tabs-list" variant="line">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
            <TabsContent value="preview">
              <BlockPreviewPanel
                component={block.component}
                previewKey={previewKey}
                previewUrl={previewUrl}
                height={block.preview.height}
              />
            </TabsContent>
            <TabsContent value="code">
              <div class="blocks-install">
                <code>{block.installCommand}</code>
              </div>
              <div class="blocks-code-layout mt-3">
                <aside class="blocks-file-tree" aria-label="Block files">
                  <p class="blocks-file-tree-label">Files</p>
                  <ul class="blocks-file-tree-list">
                    {block.files.map((file) => (
                      <li key={file.label}>
                        <button
                          type="button"
                          class={`blocks-file-tree-btn ${selectedFile === file.label ? "is-active" : ""}`}
                          aria-pressed={selectedFile === file.label}
                          onClick={() => setSelectedFile(file.label)}
                        >
                          {file.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </aside>
                <div class="blocks-code-pane">
                  <CodeBlock
                    code={applicationShellSources[selectedFile]}
                    language="tsx"
                    className="docs-tab-code"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </article>
      <section class="blocks-doc-guide" aria-label={`${block.title} documentation`}>
        <div class="blocks-detail-documentation">
          <div class="blocks-doc-body">
            <ShellSetup />
            <ShellUsage />
            <ShellProps />
            <ShellExplanation />
            <ShellDesignReference />
          </div>
        </div>
      </section>
    </>
  );
};

/**
 * Resolves a variant and wraps its detail view in the documentation site's top navigation.
 * Missing or unknown IDs show a not-found message while retaining the category return link.
 *
 * @param props - Route data; `blockId` must match a registry ID such as `application-shell-1`.
 */
export const BlocksApplicationShellDetailContent = ({ blockId }: { blockId?: string }) => {
  const block = applicationShellBlocks.find((item) => item.id === blockId);
  return (
    <DemoShell
      brand="Kamod UI"
      rootClassName="docs-shell"
      topNavItems={demoTopNavItems}
      topbarActions={<BlocksTopbarActions />}
      mainContent={
        <section class="docs-components-overview blocks-sidebar-page blocks-sidebar-detail">
          {block ? (
            <ShellDetail block={block} />
          ) : (
            <>
              <a class="blocks-detail-back" href={withBasePath(categoryPath)}>
                All application shell blocks
              </a>
              <p>Block not found.</p>
            </>
          )}
        </section>
      }
    />
  );
};

/**
 * Renders a registered demo without site chrome for iframe and new-tab previews.
 * Unknown IDs show a small fallback with a link back to the category overview.
 *
 * @param props - Preview route data; `id` matches the same registry ID as the detail route.
 */
export const ApplicationShellBlocksPreviewContent = ({ id }: { id?: string }) => {
  const block = applicationShellBlocks.find((item) => item.id === id);
  if (!block)
    return (
      <main>
        <p>Block not found.</p>
        <a href={withBasePath(categoryPath)}>All application shell blocks</a>
      </main>
    );
  const Preview = block.component;
  return <Preview />;
};
