import type { ComponentChildren } from "preact";
import kamodUiLogo from "../assets/kamod-ui.svg";

export type DemoTopNavItem = {
  label: string;
  href: string;
};

export const demoTopNavItems: DemoTopNavItem[] = [
 // { label: "Docs", href: "/docs/button/installation" },
  { label: "Components", href: "/docs/components" },
  // { label: "Blocks", href: "/docs/card/usage" },
  // { label: "Theme Designer", href: "/docs/badge/usage" }
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
  brandHref = "/",
  topNavItems,
  topNavLinksTestId,
  topbarLeading,
  topbarActions,
  leftSidebar,
  mainContent,
  rightSidebar,
  rootClassName
}: DemoShellProps) => {
  const layoutClass = ["docs-layout", leftSidebar == null ? "docs-layout--no-left" : ""].filter(Boolean).join(" ");
  return (
    <div class={`${rootClassName ?? ""}`.trim()}>
      <header class="docs-topbar">
        <div class="docs-topbar-inner">
          <div class="docs-topbar-leading">
            {topbarLeading}
            <a class="docs-topbar-brand" href={brandHref}>
              <img src={kamodUiLogo} alt="" aria-hidden="true" class="docs-topbar-brand-logo" />
              <span class="docs-topbar-brand-text">{brand}</span>
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
    </div>
  );
};
