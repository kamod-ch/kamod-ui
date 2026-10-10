/** Shared introduction and toolbar layout for block collections and individual variants. */
import { LayersIcon } from "@kamod-ch/icons/lucide";
import type { ComponentChildren } from "preact";
import { PageEyebrow } from "../docs/components/PageEyebrow";
import { BlockBreadcrumbs } from "./BlockBreadcrumbs";
import type { BlockCategory } from "./block-categories";

export type BlockPageHeaderProps = {
  category: BlockCategory;
  /** Registry title for the final breadcrumb; omit on collection pages. */
  variant?: string;
  title: ComponentChildren;
  description: ComponentChildren;
  eyebrow: string;
  actions: ComponentChildren;
  /** Optional introduction opposite the variant navigation above its showcase. */
  summaryLabel?: ComponentChildren;
  /** Optional inline navigation; its description expands to keep the link reachable. */
  descriptionLink?: ComponentChildren;
  id?: string;
  className?: string;
};

/** Reuses the same typography, four-line description space and bottom toolbar on every block page. */
export function BlockPageHeader({
  category,
  variant,
  title,
  description,
  eyebrow,
  actions,
  summaryLabel,
  descriptionLink,
  id,
  className = "",
}: BlockPageHeaderProps) {
  return (
    <header class={`blocks-hero blocks-page-header ${className}`} aria-labelledby={id}>
      <BlockBreadcrumbs
        category={category}
        variant={variant}
        className="blocks-page-header-breadcrumbs"
      />
      <PageEyebrow icon={<LayersIcon size={16} aria-hidden="true" />}>{eyebrow}</PageEyebrow>
      <div class="blocks-page-header-title-row">
        <h1 id={id} tabIndex={id ? -1 : undefined}>
          {title}
        </h1>
      </div>
      <div class={`blocks-page-header-description${descriptionLink ? " has-link" : ""}`}>
        <p class="blocks-hero-lead">
          {description}
          {descriptionLink && <> {descriptionLink}</>}
        </p>
      </div>
      <hr class="page-intro-divider" />
      <div class="blocks-page-header-summary">
        {summaryLabel}
        <div class="blocks-page-header-actions">{actions}</div>
      </div>
    </header>
  );
}
