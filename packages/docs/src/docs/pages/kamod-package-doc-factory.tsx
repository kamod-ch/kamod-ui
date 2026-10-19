import type { PackageFeature, PackageTeaserStat } from "../components/package-teaser";
import { PackageGuide, packageGuideContents } from "../components/package-teaser/PackageGuide";
import type { packageGuideNotes } from "../components/package-teaser/package-guide-notes";
import type { DocPageModule } from "../types";

export type PackageTeaserConfig = {
  slug: keyof typeof packageGuideNotes;
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
  const contents = packageGuideContents(config);

  return {
    slug: config.slug,
    title: config.title,
    navGroup: "packages",
    command: config.command,
    usageLabel: config.lead,
    packagePath: config.packagePath,
    usageImportSnippet: config.quickStart.import,
    usageExampleSnippet: config.quickStart.usage,
    guideContents: contents,
    guideTitle: config.headline,
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
    renderMain: (context) => <PackageGuide config={config} context={context} />,
  };
};
