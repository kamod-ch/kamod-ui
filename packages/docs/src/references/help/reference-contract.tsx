import { BracesIcon, CodeIcon, TerminalIcon } from "@kamod-ch/icons/lucide";
import type { CodeReferenceHelp, CodeReferenceHelpSection } from "../types";
import { referenceKinds } from "./reference-kinds";
import {
  ReferenceDefinitions,
  ReferenceExcerpts,
  ReferenceFields,
  ReferenceRows,
  ReferenceSnippet,
} from "./reference-miniatures";
import { ReferenceSection } from "./reference-section";
import { ReferenceSentence } from "./reference-sentence";

const meaningfulSection = (section: CodeReferenceHelpSection) =>
  Boolean(
    section.code?.value ||
    section.excerpts?.some((excerpt) => excerpt.description || excerpt.code?.value) ||
    section.fields?.length ||
    section.definitions?.length ||
    section.rows?.length ||
    section.description,
  );

/** A bare identifier belongs in the reference index; only explanatory content creates a chapter. */
export function hasReferenceContract({ fields, signature, sections }: CodeReferenceHelp) {
  return !!(
    sections?.some(meaningfulSection) ||
    fields?.length ||
    (signature && !/^[A-Za-z_$][\w$]*$/.test(signature))
  );
}

function fallbackSections(reference: CodeReferenceHelp): CodeReferenceHelpSection[] {
  const fields = reference.fields?.length ? reference.fields : undefined;
  const signature =
    reference.signature && !/^[A-Za-z_$][\w$]*$/.test(reference.signature)
      ? reference.signature
      : undefined;
  return fields || signature
    ? [
        {
          title: referenceKinds[reference.kind].contract,
          detail: reference.kind === "command" ? "Shell command" : "Declared contract",
          source: reference.docs ?? reference.source,
          contractName: reference.name,
          fields,
          code:
            signature && !(reference.kind === "type" && fields)
              ? {
                  value: signature,
                  language: reference.kind === "command" ? "bash" : "typescript",
                  caption: reference.kind === "command" ? "Invocation" : "Declaration",
                }
              : undefined,
          note: fields ? "Inherited contracts remain in the complete definition." : undefined,
        },
      ]
    : [];
}

/** Source-backed section data stays lazy, while lightweight page components preserve the real design. */
export function ReferenceContract({ reference }: { reference: CodeReferenceHelp }) {
  const sections = reference.sections?.filter(meaningfulSection);
  const chapters = sections?.length ? sections : fallbackSections(reference);
  return (
    <>
      {chapters.map((section, index) => (
        <ReferenceSection
          key={`${section.title}-${index}`}
          className={`code-reference-help-contract${section.definitions ? " code-reference-help-types" : ""}`}
          title={section.title}
          detail={section.detail}
          Icon={
            section.fields || section.definitions
              ? BracesIcon
              : section.code?.language === "bash"
                ? TerminalIcon
                : CodeIcon
          }
          source={section.source}
          name={reference.name}
          count={
            section.fields?.length
              ? `${section.fields.length} ${section.fields.length === 1 ? "field" : "fields"}`
              : undefined
          }
          note={section.note ? <ReferenceSentence text={section.note} /> : undefined}
        >
          {section.description && (
            <p class="code-reference-help-section-copy">
              <ReferenceSentence text={section.description} />
            </p>
          )}
          {section.rows?.length ? <ReferenceRows rows={section.rows} /> : null}
          {section.excerpts?.length ? <ReferenceExcerpts excerpts={section.excerpts} /> : null}
          {section.code && <ReferenceSnippet code={section.code} source={section.source} />}
          {section.fields?.length ? (
            <ReferenceFields
              fields={section.fields}
              name={section.contractName ?? reference.name}
              source={section.source}
            />
          ) : null}
          {section.definitions?.length ? (
            <ReferenceDefinitions definitions={section.definitions} source={section.source} />
          ) : null}
        </ReferenceSection>
      ))}
    </>
  );
}
