import {
  ArrowUpRightIcon,
  BookOpenIcon,
  BracesIcon,
  ComponentIcon,
  FileCodeIcon,
  LayersIcon,
} from "@kamod-ch/icons/lucide";
import type { CodeReferenceHelp } from "../types";

const reading = {
  type: { Icon: BracesIcon, caption: "Type contract" },
  props: { Icon: ComponentIcon, caption: "Options & defaults" },
  guide: { Icon: BookOpenIcon, caption: "Documentation" },
  source: { Icon: FileCodeIcon, caption: "Source & ownership" },
};

export function ReferenceRelated({
  reference,
  links: resources = reference.related,
}: {
  reference: CodeReferenceHelp;
  links?: CodeReferenceHelp["related"];
}) {
  const links = resources?.slice(0, 5);
  if (!links?.length) return null;
  const title =
    reference.kind === "component" || reference.kind === "type"
      ? "Types & related reading"
      : reference.kind === "module" || reference.kind === "package"
        ? "Inside this reference"
        : "Keep exploring";
  return (
    <section
      class="code-reference-help-panel code-reference-help-related"
      aria-label="Related references"
    >
      <div class="code-reference-help-section-label">
        <strong>
          <LayersIcon size={13} aria-hidden="true" />
          {title}
        </strong>
        <span>
          {links.length} {links.length === 1 ? "reference" : "references"}
        </span>
      </div>
      <div class="code-reference-help-related-links">
        {links.map((link) => {
          const { Icon, caption } = reading[link.kind];
          return (
            <a
              key={link.href}
              href={link.href}
              aria-label={link.label}
              target="_top"
              class="code-reference-help-related-link"
            >
              <Icon size={14} aria-hidden="true" />
              <span>
                <code>{link.label}</code>
                <small>{caption}</small>
              </span>
              <ArrowUpRightIcon size={11} aria-hidden="true" />
            </a>
          );
        })}
      </div>
    </section>
  );
}
