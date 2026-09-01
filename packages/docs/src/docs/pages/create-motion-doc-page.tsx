import type { ComponentChildren } from "preact";
import { ApiReference } from "../components/ApiReference";
import { MotionDocContext } from "../motion/MotionDocContext";
import { createGenericDocPage } from "./create-generic-doc-page";

export const MOTION_COMMAND =
  "pnpm add @kamod-ch/ui-motion @kamod-ch/motion @kamod-ch/ui preact motion";

const MOTION_INSTALLATION_TEXT =
  "Install @kamod-ch/ui-motion once with its peers. Individual motion component pages assume this package is already available.";

const MOTION_ACCESSIBILITY_TEXT =
  "Motion wrappers preserve Kamod focus traps, aria attributes, and dismiss behavior from the underlying primitives. Reduced-motion fallbacks come from @kamod-ch/motion presets.";

type ApiRow = {
  prop: string;
  type: string;
  defaultValue: string;
};

type MotionDocPageConfig = {
  slug: string;
  title: string;
  navLabel: string;
  coreSlug: string;
  coreTitle: string;
  replaces: string;
  packagePath: string;
  usageImportSnippet: string;
  usageLabel: string;
  usageText: string;
  usageExampleSnippet?: string;
  exampleSections: Array<{
    id: string;
    title: string;
    text: string;
    code: string;
    renderPreview: () => ComponentChildren;
    previewChromeClass?: string;
  }>;
  apiRows: ApiRow[];
  accessibilityText?: string;
};

export function createMotionDocPage(config: MotionDocPageConfig) {
  const page = createGenericDocPage({
    slug: config.slug,
    title: config.title,
    usageLabel: config.usageLabel,
    installationText: MOTION_INSTALLATION_TEXT,
    usageText: config.usageText,
    exampleSections: config.exampleSections,
    apiRows: config.apiRows,
    accessibilityText: config.accessibilityText ?? MOTION_ACCESSIBILITY_TEXT,
  });

  const heroExampleSectionId = config.exampleSections[0]?.id;
  const heroCodeSnippet = config.exampleSections[0]?.code ?? "";
  const examplePreviewBySection = config.exampleSections.reduce<
    Record<string, () => ComponentChildren>
  >((acc, item) => {
    acc[item.id] = item.renderPreview;
    return acc;
  }, {});
  const exampleCodeBySection = config.exampleSections.reduce<Record<string, string>>(
    (acc, item) => {
      acc[item.id] = item.code;
      return acc;
    },
    {},
  );
  const previewChromeBySection = config.exampleSections.reduce<Record<string, string | undefined>>(
    (acc, item) => {
      acc[item.id] = item.previewChromeClass;
      return acc;
    },
    {},
  );

  const renderSectionExtraContent = (
    sectionId: string,
    renderPreviewAndCodeTabs: (args: {
      preview: ComponentChildren;
      codeSnippet: string;
      previewClass?: string;
    }) => ComponentChildren,
  ): ComponentChildren => {
    if (sectionId === "api-reference") {
      return (
        <ApiReference
          sections={[
            {
              title: config.title,
              description: `${config.title} exports and options.`,
              rows: config.apiRows,
            },
          ]}
        />
      );
    }

    if (exampleCodeBySection[sectionId]) {
      const previewClass = ["data-[chromeless=true]:h-auto", previewChromeBySection[sectionId]]
        .filter(Boolean)
        .join(" ");
      return renderPreviewAndCodeTabs({
        preview: examplePreviewBySection[sectionId]?.() ?? null,
        codeSnippet: exampleCodeBySection[sectionId],
        previewClass,
      });
    }

    return null;
  };

  return {
    ...page,
    navGroup: "motion" as const,
    navLabel: config.navLabel,
    command: MOTION_COMMAND,
    packagePath: config.packagePath,
    usageImportSnippet: config.usageImportSnippet,
    usageExampleSnippet: config.usageExampleSnippet ?? config.exampleSections[0]?.code ?? "",
    renderMain: (context: Parameters<typeof page.renderMain>[0]) => (
      <>
        {context.renderTitleRow()}
        <MotionDocContext
          coreSlug={config.coreSlug}
          coreTitle={config.coreTitle}
          replaces={config.replaces}
        />
        {context.renderPreviewAndCodeTabs({
          preview: examplePreviewBySection[heroExampleSectionId]?.() ?? null,
          codeSnippet: heroCodeSnippet,
          previewClass: [
            "data-[chromeless=true]:h-auto",
            previewChromeBySection[heroExampleSectionId],
          ]
            .filter(Boolean)
            .join(" "),
        })}
        {context.sections.map((docSection) => (
          <section key={docSection.id} id={docSection.id} class="docs-section">
            <h2>{docSection.title}</h2>
            <p class="docs-copy">{docSection.text}</p>
            {docSection.id === "installation" || docSection.id === "usage"
              ? context.renderSectionExtraContent(docSection.id)
              : docSection.id === heroExampleSectionId
                ? null
                : renderSectionExtraContent(docSection.id, context.renderPreviewAndCodeTabs)}
          </section>
        ))}
      </>
    ),
  };
}
