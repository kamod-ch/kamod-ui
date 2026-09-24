import type { LayoutProps } from "@kamod-ch/preactpress/client";
import { syncThemeFromStorage } from "@kamod-ch/themes";
import type { FunctionalComponent } from "preact";
import { BlockCategoryPage } from "../../src/blocks/BlockCategoryPage";
import { DocsComponentContent } from "../../src/docs/DocsComponentContent";
import { DocsFormsOverviewContent } from "../../src/docs/DocsFormsOverviewContent";
import { DocsOverviewContent } from "../../src/docs/DocsOverviewContent";
import { DocsPackagesOverviewContent } from "../../src/docs/DocsPackagesOverviewContent";
import { KitchenSinkPage } from "../../src/kitchen-sink/KitchenSinkPage";
import { blockPage } from "./block-page";
import "../../src/styles/index.css";

const ApplicationShellBlocksPreviewContent = blockPage(
  "BlocksApplicationShellContent",
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
const BlocksAppSidebarContent = blockPage("BlocksAppSidebarContent", "BlocksAppSidebarContent");
const AuthBlocksPreviewContent = blockPage("BlocksAuthContent", "AuthBlocksPreviewContent");
const BlocksCatalogAuthContent = blockPage("BlocksCatalogAuthContent", "BlocksCatalogAuthContent");
const CatalogAuthBlocksPreviewContent = blockPage(
  "BlocksCatalogAuthContent",
  "CatalogAuthBlocksPreviewContent",
);
const BlocksCommerceContent = blockPage("BlocksCommerceContent", "BlocksCommerceContent");
const CommerceBlocksPreviewContent = blockPage(
  "BlocksCommerceContent",
  "CommerceBlocksPreviewContent",
);
const BlocksCommunicationContent = blockPage(
  "BlocksCommunicationContent",
  "BlocksCommunicationContent",
);
const CommunicationBlocksPreviewContent = blockPage(
  "BlocksCommunicationContent",
  "CommunicationBlocksPreviewContent",
);
const BlocksDashboardContent = blockPage("BlocksDashboardContent", "BlocksDashboardContent");
const DashboardBlocksPreviewContent = blockPage(
  "BlocksDashboardContent",
  "DashboardBlocksPreviewContent",
);
const BlocksMarketingContent = blockPage("BlocksMarketingContent", "BlocksMarketingContent");
const MarketingBlocksPreviewContent = blockPage(
  "BlocksMarketingContent",
  "MarketingBlocksPreviewContent",
);
const BlocksPreviewContent = blockPage("BlocksSidebarContent", "BlocksPreviewContent");
const BlocksSidebarDetailContent = blockPage("BlocksSidebarContent", "BlocksSidebarDetailContent");
const BlocksAuthDetailContent = blockPage("BlocksAuthContent", "BlocksAuthDetailContent");

if (typeof window !== "undefined") {
  syncThemeFromStorage();
}

type DemoPageKind =
  | "kitchen-sink"
  | "docs-overview"
  | "docs-forms-overview"
  | "docs-packages-overview"
  | "component-doc"
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
  | "commerce-block-preview";

type DemoPageMeta = {
  pageKind?: DemoPageKind;
  slug?: string;
  section?: string;
  blockId?: string;
  blockCategory?: "login" | "signup";
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
    blockCategory:
      meta.blockCategory === "signup"
        ? "signup"
        : meta.blockCategory === "login"
          ? "login"
          : undefined,
  };
};

const Layout: FunctionalComponent<LayoutProps> = ({ page }) => {
  const meta = readPageMeta(page);
  const MdxComponent = page?.kind === "mdx" ? page.Component : undefined;

  if (meta.pageKind === "kitchen-sink") {
    return <KitchenSinkPage />;
  }

  if (meta.pageKind === "docs-overview") {
    return <DocsOverviewContent />;
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

  if (meta.pageKind === "blocks-app-sidebar") {
    return <BlocksAppSidebarContent />;
  }

  if (meta.pageKind === "blocks-auth" && meta.blockCategory) {
    return <BlockCategoryPage category={meta.blockCategory} />;
  }

  if (meta.pageKind === "blocks-auth-detail" && meta.blockCategory) {
    return <BlocksAuthDetailContent category={meta.blockCategory} blockId={meta.blockId} />;
  }

  if (meta.pageKind === "blocks-auth-catalog") {
    return <BlocksCatalogAuthContent />;
  }

  if (meta.pageKind === "blocks-marketing") {
    return <BlocksMarketingContent />;
  }

  if (meta.pageKind === "blocks-dashboard") {
    return <BlocksDashboardContent />;
  }

  if (meta.pageKind === "blocks-communication") {
    return <BlocksCommunicationContent />;
  }

  if (meta.pageKind === "blocks-commerce") {
    return <BlocksCommerceContent />;
  }

  if (meta.pageKind === "block-preview") {
    return <BlocksPreviewContent id={meta.blockId} />;
  }

  if (meta.pageKind === "app-sidebar-block-preview") {
    return <AppSidebarBlocksPreviewContent id={meta.blockId} mode={meta.previewMode} />;
  }

  if (meta.pageKind === "auth-block-preview") {
    return <AuthBlocksPreviewContent category={meta.blockCategory} id={meta.blockId} />;
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

  return <main dangerouslySetInnerHTML={{ __html: page?.kind === "markdown" ? page.html : "" }} />;
};

export default Layout;
