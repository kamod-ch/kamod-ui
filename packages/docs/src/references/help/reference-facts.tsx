import type { CodeReferenceHelp } from "../types";
import { ReferenceSentence } from "./reference-sentence";

/** Small facts are metadata, not chapters; never give a one-word role its own card. */
export function ReferenceFacts({ reference }: { reference: CodeReferenceHelp }) {
  const facts = (reference.facts ?? []).filter(
    ({ label }) => reference.kind !== "technology" || !/^role$/i.test(label),
  );
  if (!facts.length) return null;
  return (
    <dl class="code-reference-help-facts" aria-label="Reference details">
      {facts.map(({ label, value }) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>
            <ReferenceSentence text={value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
