import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { ArrowUpRightIcon } from "@kamod-ch/icons/tabler/outline";
import type { ComponentChildren } from "preact";

/** Inline repository link; decorative marks never change copied text or its accessible name. */
export function KamodReference({
  href,
  label,
  children,
  showArrow = true,
}: {
  href?: string;
  label: string;
  children: ComponentChildren;
  showArrow?: boolean;
}) {
  const Tag = href ? "a" : "span";
  return (
    <Tag
      class="docs-brand-link docs-kamod-link"
      href={href}
      aria-label={href ? label : undefined}
      title={href ? `View ${label} on GitHub` : undefined}
    >
      <BrandGithubIcon class="docs-brand-icon" size="1em" aria-hidden="true" />
      {children}
      {showArrow && <ArrowUpRightIcon class="docs-kamod-arrow" size="1em" aria-hidden="true" />}
    </Tag>
  );
}
