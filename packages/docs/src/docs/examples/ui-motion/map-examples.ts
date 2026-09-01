import type { ComponentChildren } from "preact";
import type { UiMotionDocExample } from "./types.js";

export type GenericDocExampleSection = {
  id: string;
  title: string;
  text: string;
  code: string;
  renderPreview: () => ComponentChildren;
  previewChromeClass?: string;
};

/** Maps shared UI Motion examples into createGenericDocPage exampleSections. */
export function mapUiMotionExamples(examples: UiMotionDocExample[]): GenericDocExampleSection[] {
  return examples.map(({ previewClass, ...example }) => ({
    ...example,
    previewChromeClass: previewClass,
  }));
}
