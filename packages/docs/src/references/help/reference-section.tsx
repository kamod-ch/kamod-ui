import { ArrowUpRightIcon, InfoIcon, LinkIcon } from "@kamod-ch/icons/lucide";
import type { ComponentChildren } from "preact";
import type { CodeReferenceHelpLink } from "../types";

/** Keep a chapter's source action, miniature and continuation together as one reading unit. */
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
        </div>
        {source && (
          <a
            class="code-reference-help-section-source"
            href={source.href}
            target="_top"
            aria-label={`Open ${title} source for ${name}`}
            title={`${source.label} — ${source.href}. ${detail ? `${detail}. ` : ""}Open the complete ${title.toLowerCase()} section for ${name}, including content abbreviated in this preview.`}
          >
            <LinkIcon size={9} strokeWidth={1.75} aria-hidden="true" />
            <span>Full section</span>
            <ArrowUpRightIcon size={9} strokeWidth={1.75} aria-hidden="true" />
          </a>
        )}
      </div>
      <div class="code-reference-help-panel">{children}</div>
      {(source || note || detail || count) && (
        <p
          class="code-reference-help-section-note"
          title={[detail, count].filter(Boolean).join(" · ")}
        >
          {source && (
            <a href={source.href} target="_top">
              {detail || source.label}
            </a>
          )}
          {!source && detail}
          {count && <> · {count}</>}
          {(source || detail || count) && note && <> · </>}
          {note}
        </p>
      )}
    </section>
  );
}
