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
  mainContent,
  rightSidebar,
  rootClassName,
}: DemoShellProps) => {
  const layoutClass = ["docs-layout", leftSidebar == null ? "docs-layout--no-left" : ""]
    .filter(Boolean)
    .join(" ");
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

      <div class={layoutClass}>
        {leftSidebar != null ? <aside class="docs-sidebar">{leftSidebar}</aside> : null}
        <main class="docs-content">{mainContent}</main>
        <aside class="docs-rightbar">{rightSidebar}</aside>
      </div>

      <Footer />
    </div>
  );
};
