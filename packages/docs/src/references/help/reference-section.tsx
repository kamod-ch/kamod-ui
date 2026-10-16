import { InfoIcon, LinkIcon } from "@kamod-ch/icons/lucide";
import type { ComponentChildren } from "preact";
import type { CodeReferenceHelpLink } from "../types";

/** Source chapters share miniature headings and place their source action inside the preview. */
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
  detail?: string;
  count?: string;
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
            <Icon size={10} strokeWidth={2} aria-hidden="true" />
            <strong>{title}</strong>
          </Heading>
          {detail && (
            <span class="code-reference-help-section-detail" title={detail}>
              <span aria-hidden="true">·</span> {detail}
            </span>
          )}
        </div>
        <div class="code-reference-help-section-actions">
          <span>{count}</span>
        </div>
      </div>
      <div class="code-reference-help-panel">
        {source && (
          <a
            class="docs-icon-button code-reference-help-section-open code-reference-help-panel-open"
            href={source.href}
            target="_top"
            aria-label={`Open ${title} source for ${name}`}
            title={`${source.label} — ${source.href}. ${detail ? `${detail}. ` : ""}Open the complete ${title.toLowerCase()} section for ${name}, including content abbreviated in this preview.`}
          >
            <LinkIcon size={11} strokeWidth={1.75} aria-hidden="true" />
          </a>
        )}
        {children}
      </div>
      {(source || note) && (
        <p class="code-reference-help-section-note">
          {source && (
            <a href={source.href} target="_top">
              {source.label}
            </a>
          )}
          {source && note && <> · </>}
          {note}
        </p>
      )}
    </section>
  );
}
