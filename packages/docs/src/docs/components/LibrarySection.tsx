import type { ComponentChildren } from "preact";
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
}: {
  id?: string;
  headingId: string;
  title: string;
  label: string;
  meta: ComponentChildren;
  description?: ComponentChildren;
  class?: string;
  children: ComponentChildren;
}) {
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
