import { BookOpenIcon } from "@kamod-ch/icons/lucide";
import type { ComponentChildren } from "preact";
import { BlockHeadingLink } from "../../blocks/BlockHeadingLink";
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
  special = true,
}: {
  special?: boolean;
  parent: { label: string; href: string };
  label: string;
  eyebrow: ComponentChildren;
  focus: ComponentChildren;
  title: string;
  description: ComponentChildren;
  children: ComponentChildren;
}) {
  return (
    <header class="block-guide-header">
      <PageBreadcrumbs
        ancestors={parent.href === "/" ? [parent] : [{ label: "Home", href: "/" }, parent]}
        current={label}
      />
      <p class="block-guide-eyebrow">
        <span class="block-guide-eyebrow-label">
          <BookOpenIcon size={16} aria-hidden="true" />
          <span>{eyebrow}</span>
        </span>
        <span class="block-guide-eyebrow-focus">{focus}</span>
      </p>
      <h1 id={special ? "page-title" : undefined} tabIndex={special ? -1 : undefined}>
        {special ? <BlockHeadingLink id="page-title">{title}</BlockHeadingLink> : title}
      </h1>
      <div class="block-guide-description">{description}</div>
      {children}
    </header>
  );
}
