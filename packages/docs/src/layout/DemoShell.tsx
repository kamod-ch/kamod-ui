import type { ComponentChildren } from "preact";
import Footer from "../../.preactpress/theme/Footer";
import { withBasePath } from "../base-path";
import { KamodUiBrandLogo } from "./KamodUiBrandLogo";

export type DemoTopNavItem = {
  label: string;
  href: string;
};

export const demoTopNavItems: DemoTopNavItem[] = [
  { label: "Components", href: withBasePath("/docs/components") },
  { label: "Blocks", href: withBasePath("/blocks/sidebar") },
  { label: "Forms", href: withBasePath("/docs/forms") },
  { label: "Packages", href: withBasePath("/docs/packages") },
];

type DemoShellProps = {
  brand: string;
  brandHref?: string;
  topNavItems: DemoTopNavItem[];
  /** Optional test id for the top nav links container (e.g. kitchen sink e2e). */
  topNavLinksTestId?: string;
  topbarLeading?: ComponentChildren;
  topbarActions?: ComponentChildren;
  leftSidebar?: ComponentChildren;
  /** Introduction above the content column; sidebars start alongside the content below it. */
  contentHeader?: ComponentChildren;
  /** Optional desktop companion beside the introduction, above the left sidebar. */
  sidebarHeader?: ComponentChildren;
  mainContent: ComponentChildren;
  rightSidebar?: ComponentChildren;
  rootClassName?: string;
};

export const DemoShell = ({
  brand,
  brandHref = withBasePath("/"),
  topNavItems,
  topNavLinksTestId,
  topbarLeading,
  topbarActions,
  leftSidebar,
  contentHeader,
  sidebarHeader,
  mainContent,
  rightSidebar,
  rootClassName,
}: DemoShellProps) => {
  const layoutClass = [
    "docs-layout",
    leftSidebar == null ? "docs-layout--no-left" : "",
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
            {topbarLeading}
            <a class="docs-topbar-brand" href={brandHref}>
              <KamodUiBrandLogo label={brand} />
            </a>
          </div>
          <div class="docs-topbar-links" data-testid={topNavLinksTestId}>
            {topNavItems.map((item) => (
              <a href={item.href} key={item.label}>
                {item.label}
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
        <aside class="docs-rightbar">{rightSidebar}</aside>
      </Layout>

      <Footer />
    </div>
  );
};
