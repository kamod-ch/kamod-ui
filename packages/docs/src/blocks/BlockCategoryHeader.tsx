/** Category introduction kept above the cards in the content column. */
import { BugIcon } from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { Button } from "@kamod-ch/ui";
import { BlockPageHeader } from "./BlockPageHeader";
import { type BlockCategory, blockCategories } from "./block-categories";
import { blockIssueUrl, blockSourceUrl } from "./block-links";
import { PreviewThemeInfo } from "./PreviewThemeInfo";

export function BlockCategoryHeader({ category }: { category: BlockCategory }) {
  const { title, description, blocks, label } = blockCategories[category];
  const sourceUrl = blockSourceUrl(category);
  return (
    <BlockPageHeader
      category={category}
      className="blocks-category-header"
      title={title}
      badge={`${blocks.length} ${blocks.length === 1 ? "variant" : "variants"}`}
      description={
        <>
          {/* Small inline markup keeps the metadata independent of JSX. */}
          {description.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, index) => {
            if (part.startsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
            if (part.startsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
            return part;
          })}
        </>
      }
      actions={
        <>
          <p class="blocks-overview-count">
            Showing <strong>{blocks.length}</strong> of {blocks.length}{" "}
            {blocks.length === 1 ? "variant" : "variants"}
          </p>
          <span class="blocks-overview-summary-separator" aria-hidden="true">
            ·
          </span>
          <div
            class="blocks-page-header-links"
            role="group"
            aria-label={`${label} category actions`}
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
            <PreviewThemeInfo />
          </div>
        </>
      }
    />
  );
}
