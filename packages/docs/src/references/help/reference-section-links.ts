import { basePrefix, withBasePath } from "../../base-path";
import type {
  CodeReferenceHelpField,
  CodeReferenceHelpLink,
  CodeReferenceHelpSection,
} from "../types";

const localLink = (link: CodeReferenceHelpLink | undefined) =>
  link && {
    ...link,
    href:
      link.href.startsWith("/") && !link.href.startsWith(`${basePrefix()}/`)
        ? withBasePath(link.href)
        : link.href,
  };

/** Owner links and chapter destinations share one idempotent deployment-prefix rule. */
export const referenceFieldLinks = (field: CodeReferenceHelpField) => ({
  ...field,
  owners: field.owners?.map((owner) => localLink(owner)!),
});

export const referenceSectionLinks = (
  section: CodeReferenceHelpSection,
): CodeReferenceHelpSection => ({
  ...section,
  source: localLink(section.source),
  fields: section.fields?.map(referenceFieldLinks),
  excerpts: section.excerpts?.map((excerpt) => ({ ...excerpt, source: localLink(excerpt.source) })),
  definitions: section.definitions?.map((definition) => ({
    ...definition,
    source: localLink(definition.source),
    fields: definition.fields?.map(referenceFieldLinks),
  })),
});
