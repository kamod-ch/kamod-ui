/** Shared introduction and toolbar layout for block collections and individual variants. */
import { Badge } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { BlockBreadcrumbs } from "./BlockBreadcrumbs";
import type { BlockCategory } from "./block-categories";

export type BlockPageHeaderProps = {
  category: BlockCategory;
  /** Registry title for the final breadcrumb; omit on collection pages. */
  variant?: string;
  title: ComponentChildren;
  description: ComponentChildren;
  badge: string;
  actions: ComponentChildren;
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
  badge,
  actions,
  descriptionLink,
  id,
  className = "",
}: BlockPageHeaderProps) {
  return (
    <header class={`blocks-hero blocks-page-header ${className}`} aria-labelledby={id}>
      <div class="blocks-page-header-eyebrow">Built with Preact & Kamod UI</div>
      <div class="blocks-page-header-title-row">
        <h1 id={id} tabIndex={id ? -1 : undefined}>
          {title}
        </h1>
        <Badge variant="secondary" size="md">
          {badge}
        </Badge>
      </div>
      <div class={`blocks-page-header-description${descriptionLink ? " has-link" : ""}`}>
        <p class="blocks-hero-lead">
          {description}
          {descriptionLink && <> {descriptionLink}</>}
        </p>
      </div>
      <div class="blocks-page-header-summary">
        <BlockBreadcrumbs
          category={category}
          variant={variant}
          className="blocks-page-header-breadcrumbs"
        />
        <div class="blocks-page-header-actions">{actions}</div>
      </div>
    </header>
  );
}
