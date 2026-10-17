import { LayersIcon } from "@kamod-ch/icons/lucide";
import type { CodeReferenceHelp } from "../types";
import { referencePresentation } from "./reference-presentation";
import { referenceResource } from "./reference-resources";

const descriptor = "contracts · resources · guides · references · third party";

/** One flat ending preserves verified destinations, with the tooltip's chosen reference first. */
export function ReferenceRelated({
  reference,
  links: resources,
  primary,
}: {
  reference: CodeReferenceHelp;
  links?: CodeReferenceHelp["related"];
  primary?: string;
}) {
  const fallback = !resources || !primary ? referencePresentation(reference) : undefined;
  const candidates = resources ?? fallback!.resources;
  const preferred = primary ?? fallback?.primary?.href;
  const main =
    candidates.find(({ href }) => href === preferred) ??
    (reference.source && reference.source.href === preferred
      ? { ...reference.source, kind: "source" as const }
      : undefined) ??
    (reference.docs && reference.docs.href === preferred
      ? { ...reference.docs, kind: "guide" as const }
      : undefined);
  const destinations = new Map<string, (typeof candidates)[number]>();
  for (const link of [...(main ? [main] : []), ...candidates])
    if (!destinations.has(link.href)) destinations.set(link.href, link);
  const links = [...destinations.values()];
  if (!links.length) return null;
  return (
    <nav class="code-reference-help-related" aria-label="Related references">
      <div class="code-reference-help-reading-heading">
        <div class="code-reference-help-reading-heading-left">
          <strong>
            <LayersIcon size={10} strokeWidth={2} aria-hidden="true" /> Useful resources
          </strong>
          <span class="code-reference-help-reading-detail" title={descriptor}>
            <span aria-hidden="true">·</span> {descriptor}
          </span>
        </div>
        <span class="code-reference-help-reading-count">
          <strong>{links.length}</strong> {links.length === 1 ? "reference" : "references"}
        </span>
      </div>
      <ul class="code-reference-help-related-links">
        {links.map((link) => {
          const { Icon, label, caption, description } = referenceResource(link);
          const isPrimary = link.href === preferred;
          return (
            <li key={link.href} class="code-reference-help-related-item">
              <a
                href={link.href}
                aria-label={link.label}
                target="_top"
                class={`code-reference-help-related-link${isPrimary ? " code-reference-help-primary-link" : ""}`}
                data-reference-primary={isPrimary || undefined}
                title={`${caption}: ${link.label}. ${description.replace(/\*\*|`/g, "")} Destination: ${link.href}`}
              >
                <Icon size={9} strokeWidth={1.75} aria-hidden="true" />
                <code>{link.label}</code>
                <span class="code-reference-help-related-kind">
                  <span aria-hidden="true">/</span> {label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
