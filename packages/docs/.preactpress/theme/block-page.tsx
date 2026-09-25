/**
 * Defer demo-bearing route modules in the browser, while keeping complete static HTML.
 * PreactPress uses synchronous SSR, so server builds eagerly resolve the same modules.
 * Vite removes the SSR-only imports from the client dependency graph.
 */

import { loaders, pages } from "virtual:kamod-block-pages";
import type { ComponentType } from "preact";
import { lazy, Suspense } from "preact/compat";
import { useErrorBoundary } from "preact/hooks";

type BlockModules = {
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
  const path = `/src/blocks/${module}.tsx`;
  const Page = (pages[path]?.[name] ??
    lazy(async () => ({ default: (await loaders[path]())[name] }))) as ComponentType<Props>;
  return function DeferredBlockPage(props: Props) {
    const [error] = useErrorBoundary();
    if (error)
      return (
        <main role="alert">
          <p>Could not load this block page.</p>
          <button type="button" onClick={() => window.location.reload()}>
            Reload page
          </button>
        </main>
      );
    return (
      <Suspense fallback={<main role="status">Loading block…</main>}>
        <Page {...props} />
      </Suspense>
    );
  };
}
