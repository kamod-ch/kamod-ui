import { Badge } from "@kamod-ch/ui";
import { withBasePath } from "../base-path";
import { DocsShell } from "./components/DocsShell";
import { componentOverviewItems, docsPages, packageOverviewItems } from "./registry";

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
          Browse Kamod UI components and packages. Linked entries open full usage, preview, and code
          examples.
        </p>

        {packageOverviewItems.length ? (
          <section class="docs-packages-overview">
            <h2>Packages</h2>
            <div class="docs-packages-grid">
              {packageOverviewItems.map((pkg) =>
                pkg.slug ? (
                  <a
                    class="docs-component-item docs-component-item--highlighted"
                    href={withBasePath(`/docs/${pkg.slug}/installation`)}
                    key={pkg.label}
                  >
                    <span>{pkg.label}</span>
                    <Badge variant="success">new</Badge>
                  </a>
                ) : null,
              )}
            </div>
          </section>
        ) : null}

        <h2 class="docs-components-grid-heading">All components</h2>
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
