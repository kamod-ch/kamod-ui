import { createContext } from "preact";
import type { DocPageModule, DocSection } from "../../types";

const referenceSections = new Set(["installation", "usage", "api-reference", "accessibility"]);

/** Explicit IDs keep conceptual sections out of mixed pages such as Formisch. */
export const getComponentExamples = (doc: DocPageModule, sections: DocSection[]) =>
  sections.filter(({ id }) =>
    doc.exampleSectionIds ? doc.exampleSectionIds.includes(id) : !referenceSections.has(id),
  );

export const componentExamplesTitle = (doc: DocPageModule) =>
  doc.navGroup === "forms" ? "Form examples & patterns" : "Component examples & variants";

/** Shared section rendering and contents navigation use the same example list. */
export const ComponentExamplesContext = createContext<{
  doc: DocPageModule;
  examples: DocSection[];
} | null>(null);
