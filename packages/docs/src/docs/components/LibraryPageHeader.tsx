import { BookOpenIcon } from "@kamod-ch/icons/lucide";
import type { ComponentChildren } from "preact";
import { PageBreadcrumbs } from "./PageBreadcrumbs";

/** Keeps overview and guide introductions aligned while their content stays route-specific. */
export function LibraryPageHeader({
  parent,
  label,
  eyebrow,
  focus,
  title,
  description,
  children,
}: {
  parent: { label: string; href: string };
  label: string;
  eyebrow: string;
  focus: string;
  title: string;
  description: ComponentChildren;
  children: ComponentChildren;
}) {
  return (
    <header class="block-guide-header">
      <PageBreadcrumbs ancestors={[parent]} current={label} />
      <p class="block-guide-eyebrow">
        <span class="block-guide-eyebrow-label">
          <BookOpenIcon size={16} aria-hidden="true" />
          <span>{eyebrow}</span>
        </span>
        <span class="block-guide-eyebrow-focus">{focus}</span>
      </p>
      <h1>{title}</h1>
      <div class="block-guide-description">{description}</div>
      {children}
    </header>
  );
}
