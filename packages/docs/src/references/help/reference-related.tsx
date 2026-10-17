import { LayersIcon } from "@kamod-ch/icons/lucide";
import type { CodeReferenceHelp } from "../types";
import { referenceResource } from "./reference-resources";

/** Link collections close the reading surface; they are never presented as detail cards. */
export function ReferenceRelated({
  reference,
  links: resources = reference.related,
  primary,
}: {
  reference: CodeReferenceHelp;
  links?: CodeReferenceHelp["related"];
  primary?: string;
}) {
  const links = resources?.filter(
    ({ href }, index) => resources.findIndex((link) => link.href === href) === index,
  );
  if (!links?.length) return null;
  const groups = [
    {
      title: "Contracts",
      detail: "types & defaults",
      links: links.filter(({ kind }) => kind === "type" || kind === "props"),
    },
    {
      title: "Resources",
      detail: "guidance & source",
      links: links.filter(({ kind }) => kind === "guide" || kind === "source"),
    },
  ].filter(({ links }) => links.length);
  const local = links.filter(({ href }) => href.startsWith("/")).length;
  return (
    <nav class="code-reference-help-related" aria-label="Related references">
      <div class="code-reference-help-reading-heading">
        <strong>
          <LayersIcon size={10} strokeWidth={2} aria-hidden="true" /> Reference index
        </strong>
        <span class="code-reference-help-reading-detail">
          <span aria-hidden="true">·</span> contracts & resources
        </span>
        <span
          class="code-reference-help-reading-count"
          title={`${local} destinations in this documentation; ${links.length - local} external resources.`}
        >
          {local ? `${local} local` : `${links.length} external`}
          {local > 0 && local < links.length && ` / ${links.length - local} external`}
        </span>
      </div>
      {groups.map((group) => (
        <div class="code-reference-help-reading-group" key={group.title}>
          <div class="code-reference-help-reading-group-heading">
            <strong>{group.title}</strong>
            <span>
              <span aria-hidden="true">·</span> {group.detail}
            </span>
          </div>
          <div class="code-reference-help-related-links">
            {group.links.map((link) => {
              const { Icon, label, caption, description } = referenceResource(link);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-label={link.label}
                  target="_top"
                  class={`code-reference-help-related-link${link.href === primary ? " code-reference-help-primary-link" : ""}`}
                  title={`${caption}: ${link.label}. ${description.replace(/\*\*|`/g, "")} Destination: ${link.href}`}
                >
                  <Icon size={9} strokeWidth={1.75} aria-hidden="true" />
                  <code>{link.label}</code>
                  <span class="code-reference-help-related-kind">
                    <span aria-hidden="true">/</span> {label}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
