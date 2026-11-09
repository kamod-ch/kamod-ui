import type { LayoutProps } from "@kamod-ch/preactpress/client";
import { syncThemeFromStorage } from "@kamod-ch/themes";
import type { FunctionalComponent } from "preact";
import {
  applyPreviewAppearance,
  previewAppearanceFromSearch,
} from "../../src/blocks/preview-appearance";
import { HighlightedProse } from "../../src/docs/components/HighlightedProse";
import { PathCopySupport } from "../../src/docs/components/PathCopySupport";
import { useRightSidebarPageMemory } from "../../src/layout/navigation/right-sidebar-memory";
import { PageLoading, PageNotFound } from "../../src/layout/PageState";
import { StarInvitationHost } from "../../src/layout/star-invitation/StarInvitationHost";
import { ApplicationTooltips } from "../../src/layout/tooltips/ApplicationTooltips";
import { usePageReloadScroll } from "../../src/layout/usePageReloadScroll";
import { ReferenceCodeProvider } from "../../src/references/ReferenceCode";
import { SiteColorSchemeSync } from "../../src/theme/SiteColorSchemeSync";
import { blockPage } from "./block-page";
import "../../src/styles/index.css";

const BlockCategoryPage = blockPage("BlockCategoryPage", "BlockCategoryPage");
const BlockOverviewPage = blockPage("BlockOverviewPage", "BlockOverviewPage");
const BlockRoadmapPage = blockPage("BlockRoadmapPage", "BlockRoadmapPage");
const BlockPlannedCategoryPage = blockPage("BlockPlannedCategoryPage", "BlockPlannedCategoryPage");
const SaasTeamDemoPage = blockPage("SaasTeamDemoPage", "SaasTeamDemoPage");
const ComponentPreviewPage = blockPage("ComponentPreviewPage", "ComponentPreviewPage");
const DocsComponentContent = blockPage("DocsComponentContent", "DocsComponentContent");
const DocsFormsOverviewContent = blockPage("DocsFormsOverviewContent", "DocsFormsOverviewContent");
const DocsOverviewContent = blockPage("DocsOverviewContent", "DocsOverviewContent");
const DocsPackagesOverviewContent = blockPage(
  "DocsPackagesOverviewContent",
  "DocsPackagesOverviewContent",
);
const KitchenSinkPage = blockPage("KitchenSinkPage", "KitchenSinkPage");
const HomePage = blockPage("HomePage", "HomePage");

const GettingStartedContent = blockPage("GettingStartedContent", "GettingStartedContent");
const EcosystemContent = blockPage("EcosystemContent", "EcosystemContent");

const BlocksGuidesContent = blockPage("BlocksGuidesContent", "BlocksGuidesContent");

const ApplicationShellBlocksPreviewContent = blockPage(
  "BlocksApplicationShellPreviewContent",
  "ApplicationShellBlocksPreviewContent",
);
const BlocksApplicationShellDetailContent = blockPage(
  "BlocksApplicationShellContent",
  "BlocksApplicationShellDetailContent",
);
const AppSidebarBlocksPreviewContent = blockPage(
  "BlocksAppSidebarContent",
  "AppSidebarBlocksPreviewContent",
);
const AuthBlocksPreviewContent = blockPage("BlocksAuthContent", "AuthBlocksPreviewContent");
const CatalogAuthBlocksPreviewContent = blockPage(
  "BlocksCatalogAuthContent",
  "CatalogAuthBlocksPreviewContent",
);
const CommerceBlocksPreviewContent = blockPage(
  "BlocksCommerceContent",
  "CommerceBlocksPreviewContent",
);
const CommunicationBlocksPreviewContent = blockPage(
  "BlocksCommunicationContent",
  "CommunicationBlocksPreviewContent",
);
const DashboardBlocksPreviewContent = blockPage(
  "BlocksDashboardContent",
  "DashboardBlocksPreviewContent",
);
const MarketingBlocksPreviewContent = blockPage(
  "BlocksMarketingContent",
  "MarketingBlocksPreviewContent",
);
const BlocksPreviewContent = blockPage("BlocksSidebarContent", "BlocksPreviewContent");
const BlocksSidebarDetailContent = blockPage("BlocksSidebarContent", "BlocksSidebarDetailContent");
const BlocksAuthDetailContent = blockPage("BlocksAuthContent", "BlocksAuthDetailContent");
const BlocksCatalogDetailContent = blockPage(
  "BlocksCatalogDetailContent",
  "BlocksCatalogDetailContent",
);

if (typeof window !== "undefined") {
  syncThemeFromStorage();
  // New-tab preview links carry their own appearance without changing stored site preferences.
  if (/\/preview\/?$/.test(window.location.pathname)) {
    const appearance = previewAppearanceFromSearch(window.location.search);
    if (appearance) applyPreviewAppearance(document.documentElement, appearance);
  }
}

type DemoPageKind =
  | "not-found"
  | "home"
  | "kitchen-sink"
  | "blocks-overview"
  | "blocks-guide"
  | "getting-started-guide"
  | "ecosystem-guide"
  | "docs-overview"
  | "docs-forms-overview"
  | "docs-packages-overview"
  | "component-doc"
  | "component-preview"
  | "blocks-sidebar"
  | "blocks-sidebar-detail"
  | "blocks-application-shell"
  | "blocks-application-shell-detail"
  | "application-shell-block-preview"
  | "blocks-app-sidebar"
  | "blocks-auth-detail"
  | "blocks-auth"
  | "blocks-auth-catalog"
  | "blocks-marketing"
  | "blocks-dashboard"
  | "blocks-communication"
  | "blocks-commerce"
  | "block-preview"
  | "app-sidebar-block-preview"
  | "auth-block-preview"
  | "catalog-auth-block-preview"
  | "marketing-block-preview"
  | "dashboard-block-preview"
  | "communication-block-preview"
  | "commerce-block-preview"
  | "blocks-detail"
  | "blocks-roadmap"
  | "blocks-planned-category"
  | "saas-team-demo";

type DemoPageMeta = {
  pageKind?: DemoPageKind;
  slug?: string;
  section?: string;
  blockId?: string;
  blockCategory?: string;
  plannedCategoryKey?: string;
  previewMode?: "desktop" | "collapsed" | "mobile";
};

const readPageMeta = (page: LayoutProps["page"]): DemoPageMeta => {
  const meta = (page?.meta ?? {}) as Record<string, unknown>;
  return {
    pageKind: typeof meta.pageKind === "string" ? (meta.pageKind as DemoPageKind) : undefined,
    slug: typeof meta.slug === "string" ? meta.slug : undefined,
    section: typeof meta.section === "string" ? meta.section : undefined,
    blockId: typeof meta.blockId === "string" ? meta.blockId : undefined,
    previewMode:
      meta.previewMode === "collapsed" || meta.previewMode === "mobile"
        ? meta.previewMode
        : "desktop",
    blockCategory: typeof meta.blockCategory === "string" ? meta.blockCategory : undefined,
    plannedCategoryKey:
      typeof meta.plannedCategoryKey === "string" ? meta.plannedCategoryKey : undefined,
  };
};

const PageContent: FunctionalComponent<LayoutProps> = ({ page }) => {
  useRightSidebarPageMemory(page);
  usePageReloadScroll();
  const meta = readPageMeta(page);
  const MdxComponent = page?.kind === "mdx" ? page.Component : undefined;

  // PreactPress 2.2 uses this HTML sentinel while route metadata/content loads.
  // Check it before pageKind: loading views retain the destination's metadata.
  if (!page || (page.kind === "markdown" && page.html === "<p>Loading...</p>")) {
    return <PageLoading compact={meta.pageKind?.includes("preview")} />;
  }
  if (meta.pageKind === "not-found" || (page.title === "404" && !meta.pageKind)) {
    return <PageNotFound />;
  }

  if (meta.pageKind === "component-preview") return <ComponentPreviewPage />;
  if (meta.pageKind === "home") return <HomePage />;

  if (meta.pageKind === "kitchen-sink") {
    return <KitchenSinkPage />;
  }

  if (meta.pageKind === "saas-team-demo") {
    return <SaasTeamDemoPage />;
  }

  if (meta.pageKind === "docs-overview") {
    return <DocsOverviewContent />;
  }

  if (meta.pageKind === "getting-started-guide") return <GettingStartedContent />;
  if (meta.pageKind === "ecosystem-guide") return <EcosystemContent />;

  if (meta.pageKind === "blocks-guide") {
    return <BlocksGuidesContent slug={meta.slug} />;
  }

  if (meta.pageKind === "blocks-overview") {
    return <BlockOverviewPage />;
  }

  if (meta.pageKind === "blocks-roadmap") {
    return <BlockRoadmapPage />;
  }

  if (meta.pageKind === "blocks-planned-category" && meta.plannedCategoryKey) {
    return <BlockPlannedCategoryPage categoryKey={meta.plannedCategoryKey} />;
  }

  if (meta.pageKind === "docs-forms-overview") {
    return <DocsFormsOverviewContent />;
  }

  if (meta.pageKind === "docs-packages-overview") {
    return <DocsPackagesOverviewContent />;
  }

  if (meta.pageKind === "component-doc") {
    return <DocsComponentContent slug={meta.slug} section={meta.section} />;
  }

  if (meta.pageKind === "blocks-sidebar") {
    return <BlockCategoryPage category="sidebar" />;
  }

  if (meta.pageKind === "blocks-application-shell") {
    return <BlockCategoryPage category="application-shell" />;
  }
  if (meta.pageKind === "blocks-application-shell-detail") {
    return <BlocksApplicationShellDetailContent blockId={meta.blockId} />;
  }
  if (meta.pageKind === "application-shell-block-preview") {
    return <ApplicationShellBlocksPreviewContent id={meta.blockId} />;
  }

  if (meta.pageKind === "blocks-sidebar-detail") {
    return <BlocksSidebarDetailContent blockId={meta.blockId} />;
  }

  if (meta.pageKind === "blocks-auth" && meta.blockCategory) {
    return <BlockCategoryPage category={meta.blockCategory as "login" | "signup" | "auth"} />;
  }

  if (meta.pageKind === "blocks-auth-detail" && meta.blockCategory) {
    return (
      <BlocksAuthDetailContent
        category={meta.blockCategory as "login" | "signup"}
        blockId={meta.blockId}
      />
    );
  }

  if (meta.pageKind === "blocks-detail" && meta.blockCategory) {
    return (
      <BlocksCatalogDetailContent
        category={meta.blockCategory as import("../../src/blocks/block-categories").BlockCategory}
        blockId={meta.blockId}
      />
    );
  }

  if (meta.pageKind === "blocks-app-sidebar") {
    return <BlockCategoryPage category="app-sidebar" />;
  }

  if (meta.pageKind === "blocks-marketing") {
    return <BlockCategoryPage category="marketing" />;
  }

  if (meta.pageKind === "blocks-dashboard") {
    return <BlockCategoryPage category="dashboard" />;
  }

  if (meta.pageKind === "blocks-communication") {
    return <BlockCategoryPage category="communication" />;
  }

  if (meta.pageKind === "blocks-commerce") {
    return <BlockCategoryPage category="commerce" />;
  }

  if (meta.pageKind === "block-preview") {
    return <BlocksPreviewContent id={meta.blockId} />;
  }

  if (meta.pageKind === "app-sidebar-block-preview") {
    return <AppSidebarBlocksPreviewContent id={meta.blockId} mode={meta.previewMode} />;
  }

  if (meta.pageKind === "auth-block-preview") {
    return (
      <AuthBlocksPreviewContent
        category={meta.blockCategory as "login" | "signup" | undefined}
        id={meta.blockId}
      />
    );
  }

  if (meta.pageKind === "catalog-auth-block-preview") {
    return <CatalogAuthBlocksPreviewContent id={meta.blockId} />;
  }

  if (meta.pageKind === "marketing-block-preview") {
    return <MarketingBlocksPreviewContent id={meta.blockId} />;
  }

  if (meta.pageKind === "dashboard-block-preview") {
    return <DashboardBlocksPreviewContent id={meta.blockId} mode={meta.previewMode} />;
  }

  if (meta.pageKind === "communication-block-preview") {
    return <CommunicationBlocksPreviewContent id={meta.blockId} mode={meta.previewMode} />;
  }

  if (meta.pageKind === "commerce-block-preview") {
    return <CommerceBlocksPreviewContent id={meta.blockId} />;
  }

  if (MdxComponent) {
    return <MdxComponent />;
  }

  return (
    <main>
      <HighlightedProse html={page?.kind === "markdown" ? page.html : ""} />
    </main>
  );
};

const Layout: FunctionalComponent<LayoutProps> = (props) => (
  <ReferenceCodeProvider>
    <PathCopySupport />
    <SiteColorSchemeSync page={props.page} />
    <ApplicationTooltips page={props.page} />
    <StarInvitationHost />
    <PageContent {...props} />
  </ReferenceCodeProvider>
);

export default Layout;
