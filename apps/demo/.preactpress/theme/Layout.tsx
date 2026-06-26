import type { LayoutProps } from "@kamod-ch/preactpress/client";
import type { FunctionalComponent } from "preact";
import { DocsComponentContent } from "../../src/docs/DocsComponentContent";
import { DocsOverviewContent } from "../../src/docs/DocsOverviewContent";
import { KitchenSinkPage } from "../../src/kitchen-sink/KitchenSinkPage";
import { applyThemePreset, resolveInitialThemePreset } from "../../src/theme/theme-presets";
import "../../src/styles/index.css";

type DemoPageKind = "kitchen-sink" | "docs-overview" | "component-doc";

type DemoPageMeta = {
  pageKind?: DemoPageKind;
  slug?: string;
  section?: string;
};

const readPageMeta = (page: LayoutProps["page"]): DemoPageMeta => {
  const meta = (page?.meta ?? {}) as Record<string, unknown>;
  return {
    pageKind: typeof meta.pageKind === "string" ? (meta.pageKind as DemoPageKind) : undefined,
    slug: typeof meta.slug === "string" ? meta.slug : undefined,
    section: typeof meta.section === "string" ? meta.section : undefined,
  };
};

if (typeof window !== "undefined") {
  const stored = window.localStorage.getItem("theme");
  const initialTheme =
    stored === "dark"
      ? true
      : stored === "light"
        ? false
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyThemePreset(resolveInitialThemePreset());
  document.documentElement.classList.toggle("dark", initialTheme);
}

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

  if (MdxComponent) {
    return <MdxComponent />;
  }

  return <main dangerouslySetInnerHTML={{ __html: page?.kind === "markdown" ? page.html : "" }} />;
};

export default Layout;
