import type { CodeReferenceHelpExcerpt, CodeReferenceHelpSection } from "../types";

type SectionOptions = {
  detail?: string;
  href?: string;
  code?: [language: string, value: string, caption?: string];
  rows?: [label: string, value: string][];
  excerpts?: CodeReferenceHelpExcerpt[];
  note?: string;
};

/** Saved reference prose and examples are serialized at build time, never fetched by a tooltip. */
export function technologySection(
  title: string,
  description: string,
  { detail, href, code, rows, excerpts, note }: SectionOptions = {},
): CodeReferenceHelpSection {
  return {
    title,
    description,
    detail,
    source: href ? { label: title, href } : undefined,
    code: code ? { language: code[0], value: code[1], caption: code[2] } : undefined,
    rows: rows?.map(([label, value]) => ({ label, value })),
    excerpts,
    note,
  };
}

export type TechnologySections = Record<
  string,
  [CodeReferenceHelpSection, CodeReferenceHelpSection, ...CodeReferenceHelpSection[]]
>;
