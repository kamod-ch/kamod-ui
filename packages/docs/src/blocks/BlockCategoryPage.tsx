/** Shared category → detail navigation for every visible block category. */
import { useEffect } from "preact/hooks";
import { withBasePath } from "../base-path";
import { DocsShell } from "../docs/components/DocsShell";
import { BlockCategoryHeader } from "./BlockCategoryHeader";
import { BlockCategoryPreview } from "./BlockCategoryPreview";
import { BlockOverviewCard } from "./BlockOverviewCard";
import { type BlockCategory, blockCategories, legacyBlockDestination } from "./block-categories";

export const BlockCategoryPage = ({ category }: { category: BlockCategory }) => {
  const { blocks, label } = blockCategories[category];

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
      contentHeader={<BlockCategoryHeader category={category} />}
      sidebarHeader={<BlockCategoryPreview key={category} category={category} />}
      mainContent={
        <section class="docs-components-overview blocks-sidebar-page blocks-category-page">
          <ul class="blocks-overview-grid" aria-label={`${label} block variants`}>
            {blocks.map((block, index) => (
              <li key={block.id} id={block.id}>
                <BlockOverviewCard block={block} category={category} eager={index < 3} />
              </li>
            ))}
          </ul>
        </section>
      }
    />
  );
};
