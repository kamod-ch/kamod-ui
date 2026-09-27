/** Category introduction kept above the cards in the content column. */
import {
  ArrowUpRightIcon,
  BugIcon,
  InfoIcon,
  MonitorSmartphoneIcon,
  MousePointer2Icon,
  PaletteIcon,
} from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import {
  Badge,
  Button,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@kamod-ch/ui";
import { useId } from "preact/hooks";
import { BlockBreadcrumbs } from "./BlockBreadcrumbs";
import { type BlockCategory, blockCategories } from "./block-categories";
import { blockIssueUrl, blockSourceUrl, repositoryUrl } from "./block-links";

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
        {/* Small inline markup keeps the metadata independent of JSX. */}
        {description.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, index) => {
          if (part.startsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
          if (part.startsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
          return part;
        })}
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
        </div>
      </div>
    </header>
  );
}

/** A persistent, wrapping explanation for pointer, keyboard and touch activation. */
function PreviewThemeInfo() {
  // Stable IDs keep the trigger and panel connected across SSR hydration.
  const id = useId();
  return (
    <Popover>
      <Button asChild variant="ghost" size="icon-xs">
        <PopoverTrigger
          id={`${id}-trigger`}
          aria-controls={`${id}-content`}
          aria-label="About preview themes"
        >
          <InfoIcon size={13} strokeWidth={1.75} aria-hidden="true" />
        </PopoverTrigger>
      </Button>
      <PopoverContent
        id={`${id}-content`}
        aria-labelledby={`${id}-title`}
        class="blocks-preview-theme-info"
        side="top"
        align="end"
        sideOffset={8}
      >
        <div class="blocks-preview-theme-info-heading">
          <PopoverTitle id={`${id}-title`}>Preview guide</PopoverTitle>
          <span class="blocks-preview-theme-info-dot" aria-hidden="true">
            ·
          </span>
          <Badge variant="primary" size="xs">
            Snapshots
          </Badge>
        </div>
        <PopoverClose aria-label="Close preview guide" />
        <PopoverDescription>
          Gallery previews use the <code>Kamod</code> theme and follow your <code>light</code> or{" "}
          <code>dark</code> mode. These{" "}
          <a
            class="blocks-preview-theme-info-link"
            href={`${repositoryUrl}/blob/main/packages/docs/scripts/BLOCK-PREVIEW-IMAGES.md`}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="How preview images are generated (opens in a new tab)"
          >
            saved images <ArrowUpRightIcon size={10} strokeWidth={1.75} aria-hidden="true" />
          </a>{" "}
          keep collections quick to browse without loading every live demo.
        </PopoverDescription>
        <div class="blocks-preview-theme-info-features">
          <span id={`${id}-features`}>On the detail page</span>
          <ul aria-labelledby={`${id}-features`}>
            {[
              { icon: MousePointer2Icon, label: "Live demo" },
              { icon: PaletteIcon, label: "Themes" },
              { icon: MonitorSmartphoneIcon, label: "Screen sizes" },
            ].map(({ icon: Icon, label }) => (
              <li key={label}>
                <Icon size={14} strokeWidth={1.5} aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
        <PopoverDescription class="blocks-preview-theme-info-hint">
          Screenshots show the layout. Open any block to try the real interactions.
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  );
}
