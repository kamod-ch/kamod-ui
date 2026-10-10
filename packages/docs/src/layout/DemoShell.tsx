import type { ComponentChildren } from "preact";
import Footer from "../../.preactpress/theme/Footer";
import { withBasePath } from "../base-path";
import { linkTitle } from "../link-title";
import { KamodUiBrandLogo } from "./KamodUiBrandLogo";
import { useRightSidebarScroll } from "./navigation/right-sidebar-memory";
import { SiteNavigation } from "./navigation/SiteNavigation";

export type DemoTopNavItem = {
  label: string;
  href: string;
};

export const demoTopNavItems: DemoTopNavItem[] = [
  { label: "Components", href: withBasePath("/docs/components") },
  { label: "Blocks", href: withBasePath("/blocks") },
  { label: "Forms", href: withBasePath("/docs/forms") },
  { label: "Packages", href: withBasePath("/docs/packages") },
];

type DemoShellProps = {
  brand: string;
  brandHref?: string;
  topNavItems: DemoTopNavItem[];
  /** Section destination from page metadata, including its nested documentation routes. */
  activeTopNavHref?: string;
  /** Optional test id for the top nav links container (e.g. kitchen sink e2e). */
  topNavLinksTestId?: string;
  topbarActions?: ComponentChildren;
  leftSidebar?: ComponentChildren;
  /** Introduction above the content column; sidebars start alongside the content below it. */
  contentHeader?: ComponentChildren;
  /** Optional desktop companion beside the introduction, above the left sidebar. */
  sidebarHeader?: ComponentChildren;
  mainContent: ComponentChildren;
  rightSidebar?: ComponentChildren;
  rootClassName?: string;
  /** Optional resource footer for the documentation home page. */
  footer?: ComponentChildren;
};

export const DemoShell = ({
  brand,
  brandHref = withBasePath("/"),
  topNavItems,
  activeTopNavHref,
  topNavLinksTestId,
  topbarActions,
  leftSidebar,
  contentHeader,
  sidebarHeader,
  mainContent,
  rightSidebar,
  rootClassName,
  footer,
}: DemoShellProps) => {
  const rightSidebarRef = useRightSidebarScroll<HTMLElement>("column", rightSidebar != null);
  const layoutClass = [
    "docs-layout",
    leftSidebar == null ? "docs-layout--no-left" : "",
    rightSidebar == null ? "docs-layout--no-right" : "",
    contentHeader != null ? "docs-layout--content-header" : "",
  ]
    .filter(Boolean)
    .join(" ");
  // Keep the introduction and browsing content in a single main landmark.
  const Layout = contentHeader != null ? "main" : "div";
  const Content = contentHeader != null ? "div" : "main";
  return (
    <div class={`${rootClassName ?? ""}`.trim()}>
      <header class="docs-topbar">
        <div class="docs-topbar-inner">
          <div class="docs-topbar-leading">
            <SiteNavigation />
            <a class="docs-topbar-brand" href={brandHref}>
              <KamodUiBrandLogo label={brand} />
            </a>
          </div>
          <div class="docs-topbar-links" data-testid={topNavLinksTestId}>
            {topNavItems.map((item) => (
              <a
                href={item.href}
                key={item.label}
                aria-current={item.href === activeTopNavHref ? "location" : undefined}
              >
                {linkTitle(item.label)}
              </a>
            ))}
          </div>
          <div class="docs-topbar-actions">{topbarActions}</div>
        </div>
      </header>

      <Layout class={layoutClass}>
        {contentHeader != null && <div class="docs-layout-header">{contentHeader}</div>}
        {contentHeader != null && leftSidebar != null && sidebarHeader != null && (
          <div class="docs-layout-sidebar-header">{sidebarHeader}</div>
        )}
        {leftSidebar != null ? <aside class="docs-sidebar">{leftSidebar}</aside> : null}
        <Content class="docs-content">{mainContent}</Content>
        {rightSidebar != null && (
          <aside class="docs-rightbar" ref={rightSidebarRef}>
            {rightSidebar}
          </aside>
        )}
      </Layout>

      {footer ?? <Footer />}
    </div>
  );
};
