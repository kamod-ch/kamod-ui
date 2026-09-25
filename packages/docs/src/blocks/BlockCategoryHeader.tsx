/** Category introduction kept above the cards in the content column. */
import { BugIcon } from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { Badge, Button } from "@kamod-ch/ui";
import { BlockBreadcrumbs } from "./BlockBreadcrumbs";
import { type BlockCategory, blockCategories } from "./block-categories";
import { blockIssueUrl, blockSourceUrl } from "./block-links";

export function BlockCategoryHeader({ category }: { category: BlockCategory }) {
  const { title, description, blocks, label } = blockCategories[category];
  const sourceUrl = blockSourceUrl(category);
  return (
    <header class="blocks-hero blocks-category-header">
      <span class="blocks-category-eyebrow">Built with Preact &amp; Kamod UI</span>
      <div class="blocks-category-title-row">
        <h1>{title}</h1>
        <Badge variant="secondary" size="md">
          {blocks.length} {blocks.length === 1 ? "variant" : "variants"}
        </Badge>
      </div>
      <p class="blocks-hero-lead">
        {/* Category copy stays plain metadata; backticks mark inline API names. */}
        {description
          .split(/(`[^`]+`)/g)
          .map((part, index) =>
            part.startsWith("`") ? <code key={index}>{part.slice(1, -1)}</code> : part,
          )}
      </p>
      <p class="blocks-hero-lead">
        Previews use the Kamod theme in light or dark mode. Try other themes and screen sizes on
        each block’s detail page.
      </p>
      <div class="blocks-overview-summary">
        <BlockBreadcrumbs category={category} className="blocks-category-breadcrumbs" />
        <div class="blocks-overview-summary-actions">
          <p class="blocks-overview-count">
            Showing <strong>{blocks.length}</strong> of {blocks.length}{" "}
            {blocks.length === 1 ? "variant" : "variants"}
          </p>
          <span class="blocks-overview-summary-separator" aria-hidden="true">
            ·
          </span>
          <div
            class="blocks-overview-summary-links"
            role="group"
            aria-label={`${label} category links`}
          >
            <Button
              variant="ghost"
              size="icon-sm"
              href={sourceUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`View ${label} blocks source on GitHub (opens in a new tab)`}
              title="View category source on GitHub"
            >
              <BrandGithubIcon size={13} aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              href={blockIssueUrl(label, sourceUrl, "Category")}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`Report an issue with ${label} blocks on GitHub (opens in a new tab)`}
              title="Report an issue with this category"
            >
              <BugIcon size={13} strokeWidth={1.75} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
