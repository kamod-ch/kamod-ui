import { InfoIcon, LinkIcon } from "@kamod-ch/icons/lucide";
import type { ComponentChildren } from "preact";
import type { CodeReferenceHelpLink } from "../types";

/** A shared chapter heading keeps verified source links outside the transparent detail card. */
export function ReferenceSection({
  title,
  detail,
  count,
  Icon,
  source,
  name,
  className,
  note,
  children,
}: {
  title: string;
  detail: string;
  count: string;
  Icon: typeof InfoIcon;
  source?: CodeReferenceHelpLink;
  name: string;
  className: string;
  note?: ComponentChildren;
  children: ComponentChildren;
}) {
  const Heading = source ? "a" : "span";
  return (
    <section class={`code-reference-help-section ${className}`} aria-label={title}>
      <div class="code-reference-help-section-label">
        <div class="code-reference-help-section-heading">
          <Heading
            class="code-reference-help-section-title"
            href={source?.href}
            target={source ? "_top" : undefined}
            aria-label={source ? `Read ${title} for ${name}` : undefined}
          >
            <Icon size={13} strokeWidth={2.5} aria-hidden="true" />
            <strong>{title}</strong>
          </Heading>
          <span class="code-reference-help-section-detail" title={detail}>
            <span aria-hidden="true">·</span> {detail}
          </span>
        </div>
        <div class="code-reference-help-section-actions">
          <span>{count}</span>
          {source && (
            <a
              class="docs-icon-button code-reference-help-section-open"
              href={source.href}
              target="_top"
              aria-label={`Open ${title} source for ${name}`}
              title={source.label}
            >
              <LinkIcon size={13} strokeWidth={2.75} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
      <div class="code-reference-help-panel">{children}</div>
      {note && <p class="code-reference-help-section-note">{note}</p>}
    </section>
  );
}
