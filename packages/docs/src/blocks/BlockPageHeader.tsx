/** Shared introduction and toolbar layout for block collections and individual variants. */
import { LayersIcon } from "@kamod-ch/icons/lucide";
import type { ComponentChildren } from "preact";
import { PageEyebrow } from "../docs/components/PageEyebrow";
import { PageTitle } from "../docs/components/PageTitle";
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
  /** Optional introduction opposite collection actions or variant navigation. */
  summaryLabel?: ComponentChildren;
  /** Optional anchor at the divider so a collection jump includes its toolbar. */
  summaryId?: string;
  /** Optional inline navigation; its description expands to keep the link reachable. */
  descriptionLink?: ComponentChildren;
  /** Retain an existing title bookmark alongside the canonical page-title heading. */
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
  summaryId,
  descriptionLink,
  id,
  className = "",
}: BlockPageHeaderProps) {
  const titleAlias = id === "page-title" ? undefined : id;
  return (
    <header class={`blocks-hero blocks-page-header ${className}`} aria-labelledby="page-title">
      <BlockBreadcrumbs
        category={category}
        variant={variant}
        className="blocks-page-header-breadcrumbs"
      />
      <PageEyebrow icon={<LayersIcon size={16} aria-hidden="true" />}>{eyebrow}</PageEyebrow>
      <div
        class="blocks-page-header-title-row"
        id={titleAlias}
        tabIndex={titleAlias ? -1 : undefined}
      >
        <PageTitle>{title}</PageTitle>
      </div>
      <div class={`blocks-page-header-description${descriptionLink ? " has-link" : ""}`}>
        <p class="blocks-hero-lead">
          {description}
          {descriptionLink && <> {descriptionLink}</>}
        </p>
      </div>
      <hr id={summaryId} class="page-intro-divider" />
      <div class="blocks-page-header-summary">
        {summaryLabel}
        <div class="blocks-page-header-actions">{actions}</div>
      </div>
    </header>
  );
}
