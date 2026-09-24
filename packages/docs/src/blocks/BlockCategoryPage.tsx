/** Shared category → detail navigation for every visible block category. */
import { useEffect } from "preact/hooks";
import { withBasePath } from "../base-path";
import { DocsShell } from "../docs/components/DocsShell";
import { type BlockCategory, blockCategories, legacyBlockDestination } from "./block-categories";

export const BlockCategoryPage = ({ category }: { category: BlockCategory }) => {
  const { title, description, blocks } = blockCategories[category];

  useEffect(() => {
    // Old auth pages used /blocks/login#login-01. Replace the entry so Back does not loop.
    const followBookmark = () => {
      const destination = legacyBlockDestination(category, window.location.hash);
      if (destination) {
        const url = new URL(withBasePath(destination), window.location.origin);
        url.search = window.location.search;
        window.location.replace(url.href);
      }
    };
    followBookmark();
    window.addEventListener("hashchange", followBookmark);
    return () => window.removeEventListener("hashchange", followBookmark);
  }, [category]);

  return (
    <DocsShell
      sidebarScope="blocks"
      activeDoc={null}
      activeSection=""
      docs={[]}
      activeBlock={category}
      mainContent={
        <section class="docs-components-overview blocks-sidebar-page">
          <header class="blocks-hero">
            <h1>{title}</h1>
            <p class="blocks-hero-lead">{description}</p>
          </header>
          <ul class="docs-package-overview-grid blocks-overview-grid">
            {blocks.map((block) => (
              <li key={block.id} id={block.id}>
                <a
                  class="docs-package-overview-card blocks-overview-card"
                  href={withBasePath(`/blocks/${category}/${block.id}`)}
                >
                  <span class="docs-package-overview-label">{block.title}</span>
                  <span class="docs-package-overview-summary">{block.description}</span>
                  <code class="docs-package-overview-path">{block.installCommand}</code>
                </a>
              </li>
            ))}
          </ul>
        </section>
      }
    />
  );
};
