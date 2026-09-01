import { withBasePath } from "../base-path";
import { DocsShell } from "./components/DocsShell";
import { componentOverviewItems, docsPages, motionOverviewItems } from "./registry";

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
          Browse Kamod UI components. Linked entries open full usage, preview, and code examples.
        </p>

        <h2 class="docs-components-grid-heading">Motion</h2>
        <p class="docs-components-intro docs-components-intro--subsection">
          Optional @kamod-ch/ui-motion wrappers with Presence-managed exit animations.{" "}
          <a href={withBasePath("/docs/ui-motion/installation")}>Install UI Motion</a>.
        </p>
        <div class="docs-components-grid docs-components-grid--motion">
          {motionOverviewItems.map((component) => (
            <a
              class="docs-component-item"
              href={withBasePath(`/docs/${component.slug}/installation`)}
              key={component.label}
            >
              {component.label}
            </a>
          ))}
        </div>

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
