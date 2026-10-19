import { ArrowUpRightIcon, InfoIcon } from "@kamod-ch/icons/lucide";
import { Alert } from "@kamod-ch/ui/alert";
import type { CodeReferenceHelp } from "../types";
import { ReferenceSentence } from "./reference-sentence";

/** An entrypoint remains identifiable without pretending the package preview documents that file. */
export function ReferenceNotice({ notice }: { notice: NonNullable<CodeReferenceHelp["notice"]> }) {
  return (
    <Alert
      class="code-reference-help-notice"
      variant="info"
      role="note"
      aria-label="Package subpath"
    >
      <InfoIcon size={11} strokeWidth={1.75} aria-hidden="true" />
      <div>
        <p>
          <ReferenceSentence text={notice.description} />
        </p>
        {notice.source && (
          <a href={notice.source.href} target="_top">
            {notice.source.label}
            <ArrowUpRightIcon size={9} strokeWidth={1.75} aria-hidden="true" />
          </a>
        )}
      </div>
    </Alert>
  );
}
