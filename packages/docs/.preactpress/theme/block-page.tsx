/**
 * Defer demo-bearing route modules in the browser, while keeping complete static HTML.
 * PreactPress uses synchronous SSR, so server builds eagerly resolve the same modules.
 * Vite removes the SSR-only imports from the client dependency graph.
 */

import { loaders, pages } from "virtual:kamod-block-pages";
import type { ComponentType } from "preact";
import { lazy, Suspense } from "preact/compat";
import { useErrorBoundary } from "preact/hooks";
import { PageLoadError, PageLoading } from "../../src/layout/PageState";

type BlockModules = {
  BlockCategoryPage: typeof import("../../src/blocks/BlockCategoryPage");
  BlockOverviewPage: typeof import("../../src/blocks/BlockOverviewPage");
  ComponentPreviewPage: typeof import("../../src/docs/components/component-detail/ComponentPreviewPage");
  DocsComponentContent: typeof import("../../src/docs/DocsComponentContent");
  DocsFormsOverviewContent: typeof import("../../src/docs/DocsFormsOverviewContent");
  DocsOverviewContent: typeof import("../../src/docs/DocsOverviewContent");
  DocsPackagesOverviewContent: typeof import("../../src/docs/DocsPackagesOverviewContent");
  KitchenSinkPage: typeof import("../../src/kitchen-sink/KitchenSinkPage");
  HomePage: typeof import("../../src/home/HomePage");
  GettingStartedContent: typeof import("../../src/docs/GettingStartedContent");
  BlocksGuidesContent: typeof import("../../src/blocks/BlocksGuidesContent");
  BlocksSidebarContent: typeof import("../../src/blocks/BlocksSidebarContent");
  BlocksAuthContent: typeof import("../../src/blocks/BlocksAuthContent");
  BlocksApplicationShellContent: typeof import("../../src/blocks/BlocksApplicationShellContent");
  BlocksAppSidebarContent: typeof import("../../src/blocks/BlocksAppSidebarContent");
  BlocksCatalogAuthContent: typeof import("../../src/blocks/BlocksCatalogAuthContent");
  BlocksCommerceContent: typeof import("../../src/blocks/BlocksCommerceContent");
  BlocksCommunicationContent: typeof import("../../src/blocks/BlocksCommunicationContent");
  BlocksDashboardContent: typeof import("../../src/blocks/BlocksDashboardContent");
  BlocksMarketingContent: typeof import("../../src/blocks/BlocksMarketingContent");
};
type PropsOf<T> = T extends ComponentType<infer Props> ? Props & object : never;

/** Create once at module scope so navigation and rerenders reuse the loaded page component. */
export function blockPage<
  Module extends keyof BlockModules,
  Name extends keyof BlockModules[Module] & string,
>(module: Module, name: Name): ComponentType<PropsOf<BlockModules[Module][Name]>> {
  type Props = PropsOf<BlockModules[Module][Name]>;
  const paths: Partial<Record<keyof BlockModules, string>> = {
    GettingStartedContent: "/src/docs/GettingStartedContent.tsx",
    BlockCategoryPage: "/src/blocks/BlockCategoryPage.tsx",
    BlockOverviewPage: "/src/blocks/BlockOverviewPage.tsx",
    ComponentPreviewPage: "/src/docs/components/component-detail/ComponentPreviewPage.tsx",
    DocsComponentContent: "/src/docs/DocsComponentContent.tsx",
    DocsFormsOverviewContent: "/src/docs/DocsFormsOverviewContent.tsx",
    DocsOverviewContent: "/src/docs/DocsOverviewContent.tsx",
    DocsPackagesOverviewContent: "/src/docs/DocsPackagesOverviewContent.tsx",
    KitchenSinkPage: "/src/kitchen-sink/KitchenSinkPage.tsx",
    HomePage: "/src/home/HomePage.tsx",
  };
  const path = paths[module] ?? `/src/blocks/${module}.tsx`;
  const Page = (pages[path]?.[name] ??
    lazy(async () => ({ default: (await loaders[path]())[name] }))) as ComponentType<Props>;
  return function DeferredBlockPage(props: Props) {
    const [error] = useErrorBoundary();
    const compact = name.includes("Preview");
    if (error) return <PageLoadError compact={compact} />;
    return (
      <Suspense fallback={<PageLoading compact={compact} />}>
        <Page {...props} />
      </Suspense>
    );
  };
}
