import type { ComponentChildren } from "preact";
import { BlockHeadingLink } from "../../blocks/BlockHeadingLink";
import { LibraryHeading } from "./LibraryHeading";

/** A consistent visual boundary and introduction for each part of a directory. */
export function LibrarySection({
  id,
  headingId,
  title,
  label,
  meta,
  description,
  class: className = "",
  children,
  guide = false,
}: {
  id?: string;
  headingId: string;
  title: string;
  label: string;
  meta: ComponentChildren;
  description?: ComponentChildren;
  class?: string;
  children: ComponentChildren;
  /** Use the reading guide's section heading and spacing instead of the directory overline. */
  guide?: boolean;
}) {
  if (guide)
    return (
      <section
        id={id}
        class={`blocks-doc-section block-guide-section ${className}`}
        aria-labelledby={headingId}
      >
        <h2 id={headingId} tabIndex={-1}>
          <BlockHeadingLink id={headingId}>{title}</BlockHeadingLink>
        </h2>
        {description && <div class="block-guide-prose">{description}</div>}
        {children}
      </section>
    );
  return (
    <section id={id} class={`library-directory-section ${className}`} aria-labelledby={headingId}>
      <header class="library-section-header">
        <div class="library-section-overline">
          <span class="library-section-label">{label}</span>
          <span class="library-section-meta">{meta}</span>
        </div>
        <div class="library-directory-section-heading">
          <LibraryHeading id={headingId}>{title}</LibraryHeading>
        </div>
        {description && <div class="library-section-description">{description}</div>}
      </header>
      {children}
    </section>
  );
}
