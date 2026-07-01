import { withBasePath } from "../base-path";
import { DocsShell } from "./components/DocsShell";
import { componentOverviewItems, docsPages } from "./registry";

export const DocsOverviewContent = () => (
  <DocsShell
    isComponentsOverview
    activeDoc={null}
    activeSection=""
    docs={docsPages}
    mainContent={
      <section class="docs-components-overview">
        <h1>Components</h1>
        <p class="docs-components-intro">
          Browse all available Kamod UI components. Entries with a linked docs page open full usage,
          preview and code examples.
        </p>
        <div class="docs-callout docs-callout-info">
          <p>
            Demo snippets use the local `@/components/kamod-ui/*` alias. For app code, install
            `@kamod-ch/ui` and import from that package.
          </p>
        </div>
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
