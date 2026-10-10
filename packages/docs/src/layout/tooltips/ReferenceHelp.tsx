import { ArrowUpRightIcon, BookOpenIcon, GlobeIcon } from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { withBasePath } from "../../base-path";
import { BrandLink } from "../../docs/components/brand/BrandText";
import type { InlineCodeExplanation } from "./inline-code-glossary";

type HelpReference = { label: string; href?: string };
const resolveHref = (href: string) => (href.startsWith("/") ? withBasePath(href) : href);

/** One compact header for the site's detailed help; destinations remain authored metadata. */
export function ReferenceHelpHeader({
  title,
  reference,
  actions = [],
}: {
  title: string;
  reference: HelpReference;
  actions?: HelpReference[];
}) {
  const code = (
    <code>
      <BrandLink link={false}>{reference.label}</BrandLink>
    </code>
  );
  return (
    <div class="reference-help-header">
      <div class="reference-help-heading">
        <strong>{title}</strong>
        <span class="reference-help-separator" aria-hidden="true">
          /
        </span>
        <span class="docs-code-explanation-path">
          {reference.href ? <a href={resolveHref(reference.href)}>{code}</a> : code}
        </span>
      </div>
      {actions.length > 0 && (
        <div class="reference-help-actions" aria-label="Reference shortcuts">
          {actions.map(({ label, href }) => {
            if (!href) return null;
            const Icon = href.startsWith("https://github.com/")
              ? BrandGithubIcon
              : href.startsWith("/")
                ? BookOpenIcon
                : GlobeIcon;
            return (
              <a
                key={href}
                href={resolveHref(href)}
                class="docs-icon-button reference-help-action"
                aria-label={label}
              >
                <Icon size={15} aria-hidden="true" />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Keep package identifiers intact while using a short, readable heading beside them. */
function helpTitle(term: string, reference: string) {
  if (term.startsWith("@formisch/")) return "Formisch";
  if (term.startsWith("@kamod-ch/")) return "Kamod";
  if (term.startsWith("@/")) return "Source";
  return term !== reference && term.length <= 28 ? term : "Reference";
}

export function ReferenceHelp({
  term,
  explanation,
}: {
  term: string;
  explanation: InlineCodeExplanation;
}) {
  const { description, details, path, href, linkLabel } = explanation;
  const reference = path ?? { label: href?.startsWith("https://") ? href : term, href };
  const destination = href ?? path?.href;
  const actions: HelpReference[] = [];
  if (path?.href)
    actions.push({
      label: `Open ${path.href.startsWith("https://github.com/") ? "source" : "reference"} for ${term}`,
      href: path.href,
    });
  if (href && href !== path?.href) actions.push({ label: `Open reference for ${term}`, href });
  const website =
    destination?.startsWith("https://") && !destination.startsWith("https://github.com/");
  return (
    <>
      <ReferenceHelpHeader
        title={helpTitle(term, reference.label)}
        reference={reference}
        actions={actions}
      />
      <p class="reference-help-description">{description}</p>
      {details}
      {destination && (
        <a class="reference-help-footer" href={resolveHref(destination)}>
          <span>{website ? destination : (linkLabel ?? "Explore the reference")}</span>
          <ArrowUpRightIcon size={13} aria-hidden="true" />
        </a>
      )}
    </>
  );
}
