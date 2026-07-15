import { CodeBlock } from "../components/CodeBlock";
import {
  PackageExternalDocsCta,
  type PackageFeature,
  PackageFeatureGrid,
  PackageTeaserHero,
  type PackageTeaserStat,
} from "../components/package-teaser";
import type { DocPageModule } from "../types";

export type PackageTeaserConfig = {
  slug: string;
  title: string;
  packagePath: string;
  command: string;
  eyebrow: string;
  headline: string;
  lead: string;
  stats: PackageTeaserStat[];
  features: PackageFeature[];
  quickStart: { import: string; usage: string };
  installationText: string;
  usageText: string;
  apiReferenceText: string;
  accessibilityText: string;
  externalDocsUrl: string;
  githubUrl: string;
  npmUrl: string;
  externalCtaTitle: string;
  externalCtaDescription: string;
};

export const createPackageTeaserDoc = (config: PackageTeaserConfig): DocPageModule => {
  const quickStartCode = `${config.quickStart.import}\n\n${config.quickStart.usage}`;

  return {
    slug: config.slug,
    title: config.title,
    navGroup: "packages",
    command: config.command,
    usageLabel: config.lead,
    packagePath: config.packagePath,
    usageImportSnippet: config.quickStart.import,
    usageExampleSnippet: config.quickStart.usage,
    sections: [
      {
        id: "installation",
        title: "Installation",
        text: config.installationText,
      },
      {
        id: "usage",
        title: "Usage",
        text: config.usageText,
      },
      {
        id: "api-reference",
        title: "API Reference",
        text: config.apiReferenceText,
      },
      {
        id: "accessibility",
        title: "Accessibility Notes",
        text: config.accessibilityText,
      },
    ],
    renderMain: (context) => (
      <>
        {context.renderTitleRow()}
        <PackageTeaserHero
          eyebrow={config.eyebrow}
          headline={config.headline}
          lead={config.lead}
          stats={config.stats}
          externalDocsUrl={config.externalDocsUrl}
          githubUrl={config.githubUrl}
          npmUrl={config.npmUrl}
        />
        <PackageFeatureGrid features={config.features} />
        {context.sections.map((section) => (
          <section key={section.id} id={section.id} class="docs-section">
            <h2>{section.title}</h2>
            <p class="docs-copy">{section.text}</p>
            {section.id === "installation" ? context.renderSectionExtraContent(section.id) : null}
            {section.id === "usage" ? (
              <CodeBlock code={quickStartCode} language="tsx" className="docs-tab-code" />
            ) : null}
            {section.id === "api-reference" ? (
              <p class="docs-copy">
                <a href={config.externalDocsUrl} target="_blank" rel="noopener noreferrer">
                  Full API reference on live docs
                </a>
              </p>
            ) : null}
          </section>
        ))}
        <PackageExternalDocsCta
          title={config.externalCtaTitle}
          description={config.externalCtaDescription}
          externalDocsUrl={config.externalDocsUrl}
        />
      </>
    ),
  };
};
