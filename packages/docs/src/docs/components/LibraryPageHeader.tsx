import type { ComponentChildren } from "preact";
import { BrandText } from "./brand/BrandText";
import { PageBreadcrumbs } from "./PageBreadcrumbs";
import { PageEyebrow } from "./PageEyebrow";
import { PageTitle } from "./PageTitle";

/** Keeps overview and guide introductions aligned while their content stays route-specific. */
export function LibraryPageHeader({
  parent,
  label,
  eyebrow,
  title,
  description,
  children,
  decoration,
}: {
  parent: { label: string; href: string };
  label: string;
  eyebrow: ComponentChildren;
  title: string;
  description: ComponentChildren;
  children?: ComponentChildren;
  /** Optional decorative art positioned without changing the title flow. */
  decoration?: ComponentChildren;
}) {
  return (
    <header class={`block-guide-header${decoration ? " has-page-decoration" : ""}`}>
      <PageBreadcrumbs
        ancestors={parent.href === "/" ? [parent] : [{ label: "Home", href: "/" }, parent]}
        current={label}
      />
      {decoration && <span class="page-header-decoration">{decoration}</span>}
      <PageEyebrow>{eyebrow}</PageEyebrow>
      <PageTitle>{title}</PageTitle>
      <div class="block-guide-description">
        <BrandText>{description}</BrandText>
      </div>
      {children}
      <hr class="page-intro-divider" />
    </header>
  );
}
