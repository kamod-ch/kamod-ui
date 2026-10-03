import { getComponentExamples } from "./components/component-detail/component-examples";
import { docsShowMotion, isMotionDocSection } from "./docs-feature-flags";
import type { DocPageModule, DocSection } from "./types";

/** Keep isolated examples and article sections in exactly the same order. */
export function getDocSections(doc: DocPageModule, isComponentDetail = true): DocSection[] {
  const usageSectionId = "usage";
  const apiReferenceSectionId = "api-reference";
  const accessibilitySectionId = "accessibility";
  const isRtlSection = (section: DocSection) =>
    /rtl/i.test(section.id) || /rtl/i.test(section.title);
  let sections = doc.sections;

  if (!sections.some((item) => item.id === usageSectionId)) {
    const usageSection: DocSection = {
      id: usageSectionId,
      title: "Usage",
      text: doc.usageLabel,
    };
    const installationIndex = sections.findIndex((item) => item.id === "installation");
    sections =
      installationIndex < 0
        ? [usageSection, ...sections]
        : [
            ...sections.slice(0, installationIndex + 1),
            usageSection,
            ...sections.slice(installationIndex + 1),
          ];
  }

  if (!sections.some((item) => item.id === apiReferenceSectionId)) {
    sections = [
      ...sections,
      {
        id: apiReferenceSectionId,
        title: "API Reference",
        text: `${doc.title} API surface and supported options.`,
      },
    ];
  }

  if (!sections.some((item) => item.id === accessibilitySectionId)) {
    sections = [
      ...sections,
      {
        id: accessibilitySectionId,
        title: "Accessibility Notes",
        text: `Use ${doc.title} with clear labels, keyboard-friendly interactions and semantic structure.`,
      },
    ];
  }

  const visibleSections = sections.filter(
    (item) => !isRtlSection(item) && (docsShowMotion || !isMotionDocSection(item.id)),
  );
  if (!isComponentDetail) return visibleSections;
  const examples = getComponentExamples(doc, visibleSections);
  const exampleIds = new Set(examples.map(({ id }) => id));
  // Mixed guides interleave explanations and demos; keep variants together so the
  // heading hierarchy and contents order describe the actual reading order.
  return visibleSections.flatMap((item) =>
    item.id === examples[0]?.id ? examples : exampleIds.has(item.id) ? [] : [item],
  );
}
