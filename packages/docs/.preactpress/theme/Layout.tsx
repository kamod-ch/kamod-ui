import type { LayoutProps } from "@kamod-ch/preactpress/client";
import { syncThemeFromStorage } from "@kamod-ch/themes";
import type { FunctionalComponent } from "preact";
import { AuthBlocksPreviewContent, BlocksAuthContent } from "../../src/blocks/BlocksAuthContent";
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
  | "blocks-auth"
  | "block-preview"
  | "auth-block-preview";

type DemoPageMeta = {
  pageKind?: DemoPageKind;
  slug?: string;
  section?: string;
  blockId?: string;
  blockCategory?: "login" | "signup";
};

const readPageMeta = (page: LayoutProps["page"]): DemoPageMeta => {
  const meta = (page?.meta ?? {}) as Record<string, unknown>;
  return {
    pageKind: typeof meta.pageKind === "string" ? (meta.pageKind as DemoPageKind) : undefined,
    slug: typeof meta.slug === "string" ? meta.slug : undefined,
    section: typeof meta.section === "string" ? meta.section : undefined,
    blockId: typeof meta.blockId === "string" ? meta.blockId : undefined,
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

  if (meta.pageKind === "blocks-auth" && meta.blockCategory) {
    return <BlocksAuthContent category={meta.blockCategory} />;
  }

  if (meta.pageKind === "block-preview") {
    return <BlocksPreviewContent id={meta.blockId} />;
  }

  if (meta.pageKind === "auth-block-preview") {
    return <AuthBlocksPreviewContent category={meta.blockCategory} id={meta.blockId} />;
  }

  if (MdxComponent) {
    return <MdxComponent />;
  }

  return <main dangerouslySetInnerHTML={{ __html: page?.kind === "markdown" ? page.html : "" }} />;
};

export default Layout;
