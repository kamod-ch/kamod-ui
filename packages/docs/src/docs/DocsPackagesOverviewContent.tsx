import { withBasePath } from "../base-path";
import { DocsShell } from "./components/DocsShell";
import { docsPages, packageDocPages } from "./registry";

export const DocsPackagesOverviewContent = () => {
  const sortedPackages = [...packageDocPages].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <DocsShell
      sidebarScope="packages"
      isSectionOverview
      isPackagesOverview
      activeDoc={null}
      activeSection=""
      docs={docsPages}
      mainContent={
        <section class="docs-components-overview docs-packages-overview">
          <header class="docs-packages-hero">
            <h1>Packages</h1>
            <p class="docs-components-intro">
              Standalone Kamod packages — hooks, icons, i18n, signals, and more. Each entry links to
              install steps and usage in this docs site.
            </p>
          </header>
          <ul class="docs-package-overview-grid">
            {sortedPackages.map((doc) => (
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
