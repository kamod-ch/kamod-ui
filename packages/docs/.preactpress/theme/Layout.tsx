import type { LayoutProps } from "@kamod-ch/preactpress/client";
import { syncThemeFromStorage } from "@kamod-ch/themes";
import type { FunctionalComponent } from "preact";
import {
  AppSidebarBlocksPreviewContent,
  BlocksAppSidebarContent,
} from "../../src/blocks/BlocksAppSidebarContent";
import { AuthBlocksPreviewContent, BlocksAuthContent } from "../../src/blocks/BlocksAuthContent";
import {
  BlocksCatalogAuthContent,
  CatalogAuthBlocksPreviewContent,
} from "../../src/blocks/BlocksCatalogAuthContent";
import {
  BlocksCommerceContent,
  CommerceBlocksPreviewContent,
} from "../../src/blocks/BlocksCommerceContent";
import {
  BlocksCommunicationContent,
  CommunicationBlocksPreviewContent,
} from "../../src/blocks/BlocksCommunicationContent";
import {
  BlocksDashboardContent,
  DashboardBlocksPreviewContent,
} from "../../src/blocks/BlocksDashboardContent";
import {
  BlocksMarketingContent,
  MarketingBlocksPreviewContent,
} from "../../src/blocks/BlocksMarketingContent";
import { BlocksPreviewContent, BlocksSidebarContent } from "../../src/blocks/BlocksSidebarContent";
import { DocsComponentContent } from "../../src/docs/DocsComponentContent";
import { DocsOverviewContent } from "../../src/docs/DocsOverviewContent";
import { KitchenSinkPage } from "../../src/kitchen-sink/KitchenSinkPage";
import "../../src/styles/index.css";

if (typeof window !== "undefined") {
  syncThemeFromStorage();
}

type DemoPageKind =
  | "kitchen-sink"
  | "docs-overview"
  | "component-doc"
  | "blocks-sidebar"
  | "blocks-app-sidebar"
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

  if (meta.pageKind === "component-doc") {
    return <DocsComponentContent slug={meta.slug} section={meta.section} />;
  }

  if (meta.pageKind === "blocks-sidebar") {
    return <BlocksSidebarContent />;
  }

  if (meta.pageKind === "blocks-app-sidebar") {
    return <BlocksAppSidebarContent />;
  }

  if (meta.pageKind === "blocks-auth" && meta.blockCategory) {
    return <BlocksAuthContent category={meta.blockCategory} />;
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
