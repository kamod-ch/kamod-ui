import { ArrowUpRightIcon, BookOpenIcon } from "@kamod-ch/icons/lucide";
import type { ComponentChildren } from "preact";
import { withBasePath } from "../../base-path";

/** Shared section navigation and CSS reference for library overviews and guides. */
export function LibraryJumpLinks({
  children,
  label,
  class: className = "",
  reference,
}: {
  children: ComponentChildren;
  label: string;
  class?: string;
  reference?: { label: string; href: string; external?: boolean };
}) {
  return (
    <nav class={`library-directory-jump-links ${className}`} aria-label={label}>
      <ul>{children}</ul>
      <a
        class="library-directory-start-link"
        href={reference?.href ?? withBasePath("/docs/theming/css-setup")}
        target={reference?.external ? "_blank" : undefined}
        rel={reference?.external ? "noopener noreferrer" : undefined}
      >
        <BookOpenIcon size={14} aria-hidden="true" />
        {reference?.label ?? "CSS guide"}
        <ArrowUpRightIcon size={12} aria-hidden="true" />
      </a>
    </nav>
  );
}
