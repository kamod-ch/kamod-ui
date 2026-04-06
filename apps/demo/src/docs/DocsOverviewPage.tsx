import { useLocation } from "preact-iso";
import { withBasePath } from "../base-path";
import { DocsShell } from "./components/DocsShell";
import { componentOverviewItems, docsPages } from "./registry";

export const DocsOverviewPage = () => {
  const { route } = useLocation();

  return (
    <DocsShell
      isComponentsOverview
      activeDoc={null}
      activeSection=""
      docs={docsPages}
      onNavigateDoc={(slug) => {
        const page = docsPages.find((doc) => doc.slug === slug);
        route(withBasePath(`/docs/${slug}/${page?.sections[0]?.id ?? "installation"}`));
      }}
      onNavigateComponentsOverview={() => route(withBasePath("/docs/components"))}
      onNavigateSection={() => undefined}
      mainContent={
        <section class="docs-components-overview">
          <h1>Components</h1>
          <p class="docs-components-intro">
            Browse all available Kamod UI components. Entries with a linked docs page open full
            usage, preview and code examples.
          </p>
          <div class="docs-components-grid">
            {componentOverviewItems.map((component) =>
              component.slug ? (
                <a
                  class="docs-component-item"
                  href={withBasePath(`/docs/${component.slug}/installation`)}
                  key={component.label}
                >
                  {component.label}
                </a>
              ) : (
                <span class="docs-component-item is-muted" key={component.label}>
                  {component.label}
                </span>
              ),
            )}
          </div>
        </section>
      }
    />
  );
};
