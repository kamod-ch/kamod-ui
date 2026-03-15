import type { ComponentChildren } from "preact";

export type DocSection = {
  id: string;
  title: string;
  text: string;
};

export type DocRenderMainContext = {
  title: string;
  sections: DocSection[];
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
  sections: DocSection[];
  renderMain: (context: DocRenderMainContext) => ComponentChildren;
};

export type ComponentOverviewItem = {
  label: string;
  slug?: string;
};
