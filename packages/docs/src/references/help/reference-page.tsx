import { ArrowRightIcon, BookOpenIcon } from "@kamod-ch/icons/lucide";
import type { CodeReferenceHelp } from "../types";
import type { referencePresentation } from "./reference-presentation";
import { ReferenceSentence } from "./reference-sentence";

/** A reading destination uses saved page prose and real routes, without inventing an excerpt. */
export function ReferencePage({
  reference,
  destination,
}: {
  reference: CodeReferenceHelp;
  destination: NonNullable<ReturnType<typeof referencePresentation>["page"]>;
}) {
  const { href, label, path, anchor, parentHref } = destination;
  return (
    <section class="code-reference-help-page" aria-label="Documentation destination">
      <div class="code-reference-help-summary">
        <p>
          <ReferenceSentence text={reference.description} />
        </p>
      </div>
      <a class="code-reference-help-page-destination" href={href} target="_top">
        <span class="code-reference-help-page-action">
          <BookOpenIcon size={14} strokeWidth={1.75} aria-hidden="true" />
          Read the {label.toLowerCase()}
          <ArrowRightIcon size={12} strokeWidth={1.75} aria-hidden="true" />
        </span>
        <span class="code-reference-help-page-route" dir="ltr">
          <span>{path}</span>
          {anchor && <code>{anchor}</code>}
        </span>
      </a>
      {parentHref && (
        <a class="code-reference-help-page-parent" href={parentHref} target="_top">
          See the full page <ArrowRightIcon size={11} strokeWidth={1.75} aria-hidden="true" />
        </a>
      )}
    </section>
  );
}
