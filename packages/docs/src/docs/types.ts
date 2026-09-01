import type { ComponentChildren } from "preact";

export type DocSection = {
  id: string;
  title: string;
  text: string;
};

export type DocRenderMainContext = {
  title: string;
  sections: DocSection[];
  activeSectionId: string;
  getSectionHref: (sectionId: string) => string;
  renderTitleRow: () => ComponentChildren;
  renderPreviewAndCodeTabs: (args: {
    preview: ComponentChildren;
    codeSnippet: string;
    previewClass?: string;
  }) => ComponentChildren;
  renderSectionExtraContent: (sectionId: string) => ComponentChildren;
};

export type DocPageModule = {
  slug: string;
  title: string;
  command: string;
  usageLabel: string;
  /** Sidebar group — defaults to components. */
  navGroup?: "components" | "forms" | "motion" | "packages";
  /** Short label for sidebar navigation (defaults to title). */
  navLabel?: string;
  /** Overrides the title-row package path (e.g. @kamod-ch/openui). */
  packagePath?: string;
  /** Overrides auto-generated usage import snippet. */
  usageImportSnippet?: string;
  /** Overrides auto-generated usage example snippet. */
  usageExampleSnippet?: string;
  sections: DocSection[];
  renderMain: (context: DocRenderMainContext) => ComponentChildren;
};

export type ComponentOverviewItem = {
  label: string;
  slug?: string;
};
