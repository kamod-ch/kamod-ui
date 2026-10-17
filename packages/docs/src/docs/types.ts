import type { ComponentChildren } from "preact";

export type DocSection = {
  id: string;
  title: string;
  text: string;
  children?: readonly DocContentsSection[];
};

export type DocContentsSection = {
  id: string;
  label: string;
  step?: number;
  children?: readonly DocContentsSection[];
};

export type DocRenderMainContext = {
  title: string;
  sections: DocSection[];
  activeSectionId: string;
  getSectionHref: (sectionId: string) => string;
  renderTitleRow: () => ComponentChildren;
  renderMarkdownAction: () => ComponentChildren;
  renderPreviewAndCodeTabs: (args: {
    preview: ComponentChildren;
    codeSnippet: string;
    previewClass?: string;
    filePath?: string;
  }) => ComponentChildren;
  renderSectionExtraContent: (sectionId: string) => ComponentChildren;
};

export type DocPageModule = {
  slug: string;
  title: string;
  /** Optional descriptive H1; navigation and breadcrumb labels retain the short title. */
  headline?: string;
  command: string;
  usageLabel: string;
  /** Sidebar group — defaults to components. */
  navGroup?: "components" | "forms" | "motion" | "packages";
  /** Short label for sidebar navigation (defaults to title). */
  navLabel?: string;
  /** Overrides the title-row package path (e.g. @kamod-ch/openui). */
  packagePath?: string;
  /** Preserve package imports for package-oriented guides; local-source examples are the default. */
  snippetImports?: "local" | "package";
  /** Overrides auto-generated usage import snippet. */
  usageImportSnippet?: string;
  /** Overrides auto-generated usage example snippet. */
  usageExampleSnippet?: string;
  sections: DocSection[];
  /** Restrict the example directory to actual interactive examples on mixed reference pages. */
  exampleSectionIds?: readonly string[];
  /** Opt into the shared reading-guide layout and nested in-page contents. */
  guideContents?: DocContentsSection[];
  /** Visible H1 used for the guide’s first contents link. */
  guideTitle?: string;
  renderMain: (context: DocRenderMainContext) => ComponentChildren;
  /** Optional page-specific ending in place of the shared Getting Started reference. */
  renderFooter?: () => ComponentChildren;
};

export type ComponentOverviewItem = {
  label: string;
  slug?: string;
};
