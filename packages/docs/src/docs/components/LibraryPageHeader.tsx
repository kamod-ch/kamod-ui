import type { ComponentChildren } from "preact";
import { BlockHeadingLink } from "../../blocks/BlockHeadingLink";
import { utilityName } from "../../link-title";
import { BrandText } from "./brand/BrandText";
import { PageBreadcrumbs } from "./PageBreadcrumbs";
import { PageEyebrow } from "./PageEyebrow";

/** Keeps overview and guide introductions aligned while their content stays route-specific. */
export function LibraryPageHeader({
  parent,
  label,
  eyebrow,
  title,
  description,
  children,
  special = true,
}: {
  special?: boolean;
  parent: { label: string; href: string };
  label: string;
  eyebrow: ComponentChildren;
  title: string;
  description: ComponentChildren;
  children?: ComponentChildren;
}) {
  return (
    <header class="block-guide-header">
      <PageBreadcrumbs
        ancestors={parent.href === "/" ? [parent] : [{ label: "Home", href: "/" }, parent]}
        current={label}
      />
      <PageEyebrow>{eyebrow}</PageEyebrow>
      <h1 id={special ? "page-title" : undefined} tabIndex={special ? -1 : undefined}>
        {special ? (
          <BlockHeadingLink id="page-title">{title}</BlockHeadingLink>
        ) : (
          utilityName(title)
        )}
      </h1>
      <div class="block-guide-description">
        <BrandText>{description}</BrandText>
      </div>
      {children}
      <hr class="page-intro-divider" />
    </header>
  );
}
