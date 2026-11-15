import { ComponentDocSection } from "../components/component-detail/ComponentDocSection";
import { CodeGuideContent } from "../examples/code/code-guide";
import type { DocPageModule, DocSection } from "../types";

const sections: DocSection[] = [
  {
    id: "installation",
    title: "When to read this",
    text: "The [Code](/docs/code/installation) page covers everyday snippets, languages, headers and copy. This page is for extending that reader: syntax themes, folding rules, custom controls and delivery.",
  },
  {
    id: "syntax-themes",
    title: "Syntax Themes and Typography",
    text: "Keep the default, try a bundled palette, or derive syntax colors from your application's semantic tokens. Prism recognition, token groups and stylesheet ports are below.",
    children: [
      { id: "code-syntax-presets", label: "Explore the presets" },
      { id: "code-prism-palettes", label: "Compare the Prism palettes" },
      { id: "code-prism-pipeline", label: "How Prism and CSS work together" },
      { id: "code-syntax-token-groups", label: "Understand syntax token groups" },
      { id: "code-css-ownership", label: "Scope styles to the reader" },
      { id: "code-prism-stylesheet-ports", label: "Include another Prism theme" },
      { id: "code-palette-verification", label: "Verify a syntax palette" },
      { id: "code-theme-tokens", label: "Try all eight application palettes" },
      { id: "code-product-palette", label: "Create a product syntax palette" },
      { id: "code-shared-syntax-choice", label: "Share a reader preference" },
      { id: "code-theme-boundaries", label: "Syntax, surfaces and app themes" },
      { id: "code-syntax-overrides", label: "Customize token colors" },
      { id: "code-code-typography", label: "Fonts, spacing and emphasis" },
    ],
  },
  {
    id: "reading-behavior",
    title: "Reading Preferences",
    text: "Import folding and line wrapping stay independent. Choose defaults, preserve the complete source, and decide whether preferences carry across file selections.",
    children: [
      { id: "code-folding-rules", label: "Import folding" },
      { id: "code-wrapping-rules", label: "Line wrapping" },
      { id: "code-reading-state", label: "State and file changes" },
    ],
  },
  {
    id: "modularity",
    title: "Build Your Own Reader",
    text: "Choose which parts stay visible, connect shared preferences, or replace one action. The source stays in one place.",
    children: [
      { id: "code-visible-parts", label: "Choose visible parts" },
      { id: "code-controlled-preferences", label: "Own the reading state" },
      { id: "code-control-slots", label: "Replace a control" },
      { id: "code-content-slots", label: "Compose surrounding content" },
    ],
  },
  {
    id: "customization",
    title: "Composition and Theming",
    text: "Use surface variants, root layout classes and header composition before replacing control markup.",
    children: [
      { id: "code-surfaces", label: "Surfaces and sizing" },
      { id: "code-toolbar-composition", label: "Header composition" },
      { id: "code-theme-integration", label: "Shared theme tokens" },
    ],
  },
  {
    id: "source-links",
    title: "Source Reference Links",
    text: "Open an imported component, inspect its package, and follow the same name where the example uses it.",
    children: [
      { id: "code-reference-navigation", label: "Navigate imported names" },
      { id: "code-reference-destinations", label: "How destinations are chosen" },
      { id: "code-reference-resolver", label: "Share your own resolver" },
    ],
  },
  {
    id: "performance",
    title: "Performance and Delivery",
    text: "Load highlighting for the file a reader opens, avoid replacing stable strings, and keep large generated documents out of an ordinary example.",
    children: [
      { id: "code-lazy-highlighting", label: "Lazy highlighting" },
      { id: "code-large-files", label: "Large files" },
      { id: "code-server-rendering", label: "Server rendering" },
    ],
  },
];

export const codeInternalsDocPage: DocPageModule = {
  slug: "code-internals",
  title: "Code internals",
  navLabel: "Code internals",
  command: "pnpm add @kamod-ch/ui",
  usageLabel: "Extend the Code reader: syntax themes, folding, custom controls and delivery.",
  packagePath: "@kamod-ch/ui/code",
  snippetImports: "package",
  exampleSectionIds: [],
  sections,
  guideContents: sections.map(({ id, title, children }) => ({ id, label: title, children })),
  guideTitle: "Extending the Code reader",
  renderMain: (context) => (
    <>
      {context.renderTitleRow()}
      {context.sections.map((section) => (
        <ComponentDocSection key={section.id} section={section}>
          {section.id === "installation" ? null : <CodeGuideContent sectionId={section.id} />}
        </ComponentDocSection>
      ))}
    </>
  ),
};
