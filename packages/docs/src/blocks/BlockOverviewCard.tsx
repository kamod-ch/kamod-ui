/** Visual comparison stays lightweight: only detail pages mount the interactive blocks. */
import { PackagePlusIcon, TagIcon } from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { Badge, Button, Card } from "@kamod-ch/ui";
import { withBasePath } from "../base-path";
import { BlockThumbnail } from "./BlockThumbnail";
import type { BlockCategory, BlockOverviewEntry } from "./block-categories";
import { getBlockOverviewDetails } from "./block-overview-details";

/** Preview/title navigation and footer actions are sibling links, never nested controls. */
export function BlockOverviewCard({
  block,
  category,
  eager = false,
}: {
  block: BlockOverviewEntry;
  category: BlockCategory;
  eager?: boolean;
}) {
  const tags = (block.features?.length ? block.features : block.tags).slice(0, 3);
  const { displayName, note, sourceUrl, installationId } = getBlockOverviewDetails(category, block);
  const detailUrl = withBasePath(`/blocks/${category}/${block.id}`);
  const titleId = `${block.id}-title`;
  const descriptionId = `${block.id}-description`;
  return (
    <Card class="blocks-overview-surface">
      <a
        class="blocks-overview-card"
        href={detailUrl}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <BlockThumbnail category={category} blockId={block.id} eager={eager} />
        <div class="blocks-overview-info">
          <div class="blocks-overview-title-row">
            <h2 id={titleId}>
              <span>{displayName}</span>
              <span class="blocks-overview-code-label">
                <span class="blocks-overview-title-separator" aria-hidden="true">
                  /
                </span>
                <code>{block.title}</code>
              </span>
            </h2>
          </div>
          <p id={descriptionId}>
            {block.description} {note}
          </p>
          <div class="blocks-overview-tags">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" size="xs">
                <TagIcon size={11} strokeWidth={1.75} aria-hidden="true" />
                {tag.replaceAll("-", " ")}
              </Badge>
            ))}
          </div>
        </div>
      </a>
      <BlockCardFooter
        path={block.installCommand}
        displayName={displayName}
        sourceUrl={sourceUrl}
        installationUrl={`${detailUrl}#${installationId}`}
      />
    </Card>
  );
}

/** Keep the scope and final filename visible while only the middle path truncates. */
function BlockCardFooter({
  path,
  displayName,
  sourceUrl,
  installationUrl,
}: {
  path: string;
  displayName: string;
  sourceUrl: string;
  installationUrl: string;
}) {
  const [pathScope, ...pathSegments] = path.split("/");
  const pathName = pathSegments.pop();
  return (
    <div class="blocks-overview-footer">
      <div class="blocks-overview-actions">
        <div class="blocks-overview-path">
          <code title={path}>
            <span class="sr-only">{path}</span>
            <span aria-hidden="true">{pathScope}/</span>
            <span class="blocks-overview-path-middle" aria-hidden="true">
              {pathSegments.join("/")}/
            </span>
            <span aria-hidden="true">{pathName}</span>
          </code>
        </div>
        <div class="blocks-overview-action-links">
          <Button
            variant="ghost"
            size="icon-sm"
            href={sourceUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${displayName} source on GitHub (opens in a new tab)`}
            title="View source on GitHub"
          >
            <BrandGithubIcon size={13} aria-hidden="true" />
          </Button>
          {/* Native navigation preserves fragment scrolling across PreactPress routes. */}
          <Button
            variant="ghost"
            size="icon-sm"
            href={installationUrl}
            target="_self"
            aria-label={`Add ${displayName} to your project`}
            title="Add this block"
          >
            <PackagePlusIcon size={13} strokeWidth={1.75} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
