/** Shared category → detail navigation for every visible block category. */
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@kamod-ch/ui";
import { useEffect } from "preact/hooks";
import { withBasePath } from "../base-path";
import { DocsShell } from "../docs/components/DocsShell";
import { BlockOverviewCard } from "./BlockOverviewCard";
import { type BlockCategory, blockCategories, legacyBlockDestination } from "./block-categories";

export const BlockCategoryPage = ({ category }: { category: BlockCategory }) => {
  const { title, description, blocks, label } = blockCategories[category];

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
        <section class="docs-components-overview blocks-sidebar-page blocks-category-page">
          <header class="blocks-hero blocks-category-header">
            <Breadcrumb class="blocks-category-breadcrumbs">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href={withBasePath("/")}>Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={withBasePath("/blocks/sidebar")}>Blocks</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage class="capitalize">{label}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <span class="blocks-category-eyebrow">Built with Preact &amp; Kamod UI</span>
            <h1>{title}</h1>
            <p class="blocks-hero-lead">{description}</p>
            <div class="blocks-category-caption">
              <Badge variant="secondary" size="sm">
                {blocks.length} {blocks.length === 1 ? "variant" : "variants"}
              </Badge>
              <span>Find your layout. Open a block to try it and explore the code.</span>
            </div>
          </header>
          <p class="blocks-overview-count">
            Showing <strong>{blocks.length}</strong> of {blocks.length}{" "}
            {blocks.length === 1 ? "variant" : "variants"}
          </p>
          <ul class="blocks-overview-grid" aria-label={`${label} block variants`}>
            {blocks.map((block, index) => (
              <li key={block.id} id={block.id}>
                <BlockOverviewCard block={block} category={category} eager={index < 3} />
              </li>
            ))}
          </ul>
          <p class="blocks-category-note">
            Previews use the Kamod theme in light or dark mode. Try other themes and screen sizes on
            each block’s detail page.
          </p>
        </section>
      }
    />
  );
};
