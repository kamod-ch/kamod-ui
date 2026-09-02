import { withBasePath } from "../base-path";
import { DocsShell } from "./components/DocsShell";
import { docsPages, formDocPages } from "./registry";

export const DocsFormsOverviewContent = () => {
  const sortedForms = [...formDocPages].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <DocsShell
      sidebarScope="forms"
      isSectionOverview
      isFormsOverview
      activeDoc={null}
      activeSection=""
      docs={docsPages}
      mainContent={
        <section class="docs-components-overview docs-forms-overview">
          <header class="docs-packages-hero">
            <h1>Forms</h1>
            <p class="docs-components-intro">
              Form guides and patterns for Kamod UI — schema setup, validation, and field examples.
            </p>
          </header>
          <ul class="docs-package-overview-grid">
            {sortedForms.map((doc) => (
              <li key={doc.slug}>
                <a
                  class="docs-package-overview-card"
                  href={withBasePath(`/docs/${doc.slug}/installation`)}
                >
                  <span class="docs-package-overview-label">{doc.title}</span>
                  {doc.usageLabel ? (
                    <span class="docs-package-overview-summary">{doc.usageLabel}</span>
                  ) : null}
                  {doc.packagePath ? (
                    <code class="docs-package-overview-path">{doc.packagePath}</code>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </section>
      }
    />
  );
};
