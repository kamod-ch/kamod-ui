import type { ComponentChildren } from "preact";
import { ApiReference } from "../components/ApiReference";
import { CodeBlock } from "../components/CodeBlock";
import type { DocPageModule } from "../types";

type ApiRow = {
  prop: string;
  type: string;
  defaultValue: string;
};

type GenericDocPageConfig = {
  slug: string;
  title: string;
  usageLabel: string;
  /** If omitted, the hero code tab uses the first `exampleSections` entry's `code`. */
  previewCode?: string;
  installationText: string;
  /** Optional live preview + code under the Installation section (e.g. minimal import usage). */
  installationExample?: {
    code: string;
    renderPreview: () => ComponentChildren;
  };
  usageText: string;
  /** Merged onto every Preview tab shell (e.g. overflow for focus rings). */
  previewChromeClass?: string;
  exampleSections: Array<{
    id: string;
    title: string;
    text: string;
    code: string;
    renderPreview: () => ComponentChildren;
  }>;
  apiRows: ApiRow[];
  accessibilityText: string;
};

export const createGenericDocPage = (config: GenericDocPageConfig): DocPageModule => {
  const heroCodeSnippet = config.previewCode ?? config.exampleSections[0]?.code ?? "";

  const heroExampleSectionId = config.exampleSections[0]?.id;

  const exampleCodeBySection = config.exampleSections.reduce<Record<string, string>>(
    (acc, item) => {
      acc[item.id] = item.code;
      return acc;
    },
    {},
  );
  const examplePreviewBySection = config.exampleSections.reduce<
    Record<string, () => ComponentChildren>
  >((acc, item) => {
    acc[item.id] = item.renderPreview;
    return acc;
  }, {});

  const previewTabClass = ["data-[chromeless=true]:h-auto", config.previewChromeClass]
    .filter(Boolean)
    .join(" ");

  const renderSectionExtraContent = (
    sectionId: string,
    renderPreviewAndCodeTabs: (args: {
      preview: ComponentChildren;
      codeSnippet: string;
      previewClass?: string;
    }) => ComponentChildren,
  ): ComponentChildren => {
    if (sectionId === "installation" && config.installationExample) {
      return renderPreviewAndCodeTabs({
        preview: config.installationExample.renderPreview(),
        codeSnippet: config.installationExample.code,
        previewClass: previewTabClass,
      });
    }

    if (exampleCodeBySection[sectionId]) {
      return renderPreviewAndCodeTabs({
        preview: examplePreviewBySection[sectionId]?.() ?? null,
        codeSnippet: exampleCodeBySection[sectionId],
        previewClass: previewTabClass,
      });
    }

    if (sectionId === "api-reference") {
      return (
        <ApiReference
          sections={[
            {
              title: config.title,
              description: `${config.title} component props and accepted values.`,
              rows: config.apiRows,
            },
          ]}
        />
      );
    }

    return null;
  };

  return {
    slug: config.slug,
    title: config.title,
    command: "pnpm add @kamod-ui/core",
    usageLabel: config.usageLabel,
    sections: [
      { id: "installation", title: "Installation", text: config.installationText },
      { id: "usage", title: "Usage", text: config.usageText },
      ...config.exampleSections.map((item) => ({
        id: item.id,
        title: item.title,
        text: item.text,
      })),
      {
        id: "api-reference",
        title: "API Reference",
        text: "Props, slots and variants for this component.",
      },
      { id: "accessibility", title: "Accessibility Notes", text: config.accessibilityText },
    ],
    renderMain: (context) => (
      <>
        {context.renderTitleRow()}
        {context.renderPreviewAndCodeTabs({
          preview: examplePreviewBySection[config.exampleSections[0]?.id]?.() ?? null,
          codeSnippet: heroCodeSnippet,
          previewClass: previewTabClass,
        })}
        {context.sections.map((docSection) => (
          <section key={docSection.id} id={docSection.id} class="docs-section">
            <h2>{docSection.title}</h2>
            <p class="docs-copy">{docSection.text}</p>
            {context.renderSectionExtraContent(docSection.id)}
            {docSection.id !== heroExampleSectionId
              ? renderSectionExtraContent(docSection.id, context.renderPreviewAndCodeTabs)
              : null}
          </section>
        ))}
      </>
    ),
  };
};
