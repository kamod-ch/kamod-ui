import { ArrowUpRightIcon, LayersIcon } from "@kamod-ch/icons/lucide";
import type { CodeReferenceHelp } from "../types";
import { referenceResource } from "./reference-resources";

/** Link collections close the reading surface; they are never presented as detail cards. */
export function ReferenceRelated({
  reference,
  links: resources = reference.related,
}: {
  reference: CodeReferenceHelp;
  links?: CodeReferenceHelp["related"];
}) {
  const links = resources?.slice(0, 5);
  if (!links?.length) return null;
  const groups = [
    { title: "Contracts", links: links.filter(({ kind }) => kind === "type" || kind === "props") },
    {
      title: "Resources",
      links: links.filter(({ kind }) => kind === "guide" || kind === "source"),
    },
  ].filter(({ links }) => links.length);
  return (
    <nav class="code-reference-help-related" aria-label="Related references">
      <div class="code-reference-help-reading-heading">
        <strong>
          <LayersIcon size={11} aria-hidden="true" /> Related reading
        </strong>
        <span>
          {links.length} {links.length === 1 ? "reference" : "references"}
        </span>
      </div>
      {groups.map((group) => (
        <div class="code-reference-help-reading-group" key={group.title}>
          <span class="code-reference-help-reading-label">{group.title}</span>
          <div class="code-reference-help-related-links">
            {group.links.map((link) => {
              const { Icon, caption } = referenceResource(link);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-label={link.label}
                  target="_top"
                  class="code-reference-help-related-link"
                  title={`${caption}: ${link.label}`}
                >
                  <Icon size={11} aria-hidden="true" />
                  <code>{link.label}</code>
                  <ArrowUpRightIcon size={9} aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
