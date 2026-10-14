import { ComponentDocSection } from "../components/component-detail/ComponentDocSection";
import { CodeApiReference } from "../examples/code/code-api";
import { CodeHero, codeExamples, codeHeroSnippet } from "../examples/code/code-examples";
import { CodeGuideContent } from "../examples/code/code-guide";
import type { DocPageModule } from "../types";

export const codeDocPage: DocPageModule = {
  slug: "code",
  title: "Code",
  headline: "Code — readable snippets for any interface",
  command: "pnpm add @kamod-ch/ui",
  packagePath: "@kamod-ch/ui/code",
  snippetImports: "package",
  usageLabel:
    "Display source strings as selectable code with syntax highlighting and theme-aware surfaces. Start with a small snippet, choose its language, and add optional file context or reading tools when your interface needs them.",
  usageImportSnippet: 'import { Code } from "@kamod-ch/ui/code";',
  usageExampleSnippet:
    '<Code\n  code={\'const greeting = "Hello";\'}\n  language="typescript"\n  showToolbar={false}\n  showWrapControl={false}\n/>',
  exampleSectionIds: [
    "terminal",
    "data",
    "styles",
    "literal",
    "appearance",
    "source-file",
    "toolbar",
    "document",
    "imports",
    "wrapping",
  ],
  sections: [
    {
      id: "installation",
      title: "Installation",
      text: "**Start with a Readable Snippet.** Code is a Preact component exported by `@kamod-ch/ui`. Pass a source string and use the shared stylesheet for its typography, surfaces and syntax colors. Set it up once, then use the same component in a help article, API response, settings screen or working example.",
      children: [
        { id: "code-install-package", label: "Add the package" },
        { id: "code-install-styles", label: "Connect the styles" },
        { id: "code-first-render", label: "Render an example" },
      ],
    },
    {
      id: "usage",
      title: "Usage",
      text: "**Put the Source First.** Begin with a small string and the language that matches it. Keep the presentation plain, preserve its original spacing and give it a short explanation in your surrounding page. The first examples below cover ordinary commands, data, styles and literal output; optional headers and reading tools follow later.",
      children: [
        { id: "code-reading-model", label: "Display a source string" },
        { id: "code-choose-language", label: "Choose a language" },
      ],
    },
    {
      id: "terminal",
      title: "Terminal Command",
      text: '**Show a Command, Ready to Reuse.** Choose `language="bash"` for shell commands and pass the command itself, without a decorative `$` prompt. Code highlights the text; it does not run it. A short command can sit directly beside the explanation of when to use it.\n\nThis example displays `pnpm build` as a simple source surface. Longer commands retain native horizontal scrolling, and the string stays exactly as supplied. For package setup, follow the [Getting Started Guide](/docs/getting-started); for a later copyable command with a purpose label, see [Optional File Header](#source-file) and [Copy and Content](#copy-and-content).',
    },
    {
      id: "data",
      title: "Structured Data",
      text: '**Keep Structured Values Easy to Scan.** Pass a serialized string and choose `language="json"` to distinguish keys, strings, booleans and punctuation. The plain example below preserves the original indentation without a filename or an additional header.\n\nThis works well beside an API response or a settings explanation. Code does not serialize objects, validate values or turn them into an interactive tree; prepare the string before rendering. See [Language Selection](#language-detection) for JSON aliases, YAML and other supported formats.',
    },
    {
      id: "styles",
      title: "CSS Snippet",
      text: '**Give Styles the Same Readable Surface.** Choose `language="css"` for a stylesheet excerpt and keep the explanation outside the code. The example below uses semantic color, border and focus tokens in a small workspace rule; Code displays the original selectors and declarations.\n\nAn explicit language is enough for syntax colors. No file label or extra controls are needed to explain a class. Follow [Theme Tokens](/docs/theming/installation#token-overrides) when adapting the rule to your own interface, or compare [Surface Variants](#appearance) to style the viewer itself.',
    },
    {
      id: "literal",
      title: "Literal Output",
      text: '**Keep Plain Output Plain.** Logs, build reports and generated text can contain code-like fragments without being source files. Pair `language="text"` with `inferLanguage={false}` to preserve a deliberately unhighlighted presentation, including the JSX-looking text in this report.\n\nThe example uses the same plain surface as the earlier snippets. Whitespace, punctuation and line endings remain yours; nothing is stripped or normalized. This is also a useful fallback for a language or custom DSL that has no supported grammar.',
    },
    {
      id: "language-detection",
      title: "Language Selection",
      text: "**Choose the Grammar That Matches Your Source.** A language selects syntax highlighting, not a formatter that rewrites your code. Start with an explicit language or filename, explore the supported grammars, then offer a selector when your reader needs a choice. Automatic inference and plain-text mode cover the cases where metadata is missing or colors are unnecessary.",
      children: [
        { id: "code-language-order", label: "Resolution order" },
        { id: "code-language-list", label: "Supported languages" },
        { id: "code-language-switcher", label: "Try a language selector" },
        { id: "code-literal-mode", label: "Literal mode" },
        { id: "code-language-helpers", label: "Language helpers" },
      ],
    },
    {
      id: "appearance",
      title: "Surface Variants",
      text: "**Fit the Snippet into Its Surroundings.** Choose `default`, `subtle` or `outline` to adjust the code surface without changing its source or syntax highlighting. The examples share one short string and keep their labels outside Code, so the difference in the surfaces is easy to compare.\n\nUse the default for a distinct reading area, subtle for a quiet inset, or outline when an existing parent already provides the surrounding surface. All three follow the application theme. More detailed token and font choices appear later in [Syntax Themes and Typography](#syntax-themes).",
    },
    {
      id: "source-file",
      title: "Optional File Header",
      text: "**Add File Context When It Helps.** The preceding examples use `showToolbar={false}` for a plain source surface. Code’s header is enabled by default: omit that setting when a label and copy action are useful, then supply `filePath` for an actual file or suggested destination.\n\nThe header separates the path from the filename, includes a file-type icon and shows a line count when space allows. Its `.tsx` extension also selects TypeScript with JSX here. The path is descriptive metadata; Code does not fetch or write the file. This example keeps extra reading controls out of the way so you can focus on the header. Compare [Custom Header](#toolbar) when a purpose is more useful than a path.",
    },
    {
      id: "toolbar",
      title: "Custom Header",
      text: "**Use the Header to Explain Why This Source Matters.** A destination path is not always the most useful label. `renderToolbar` lets you introduce a short purpose, state or piece of context while retaining the component’s own actions. The example places workspace defaults on the left and the supplied Copy action on the right.\n\nThis composition disables the wrap switch because the source is short. In a general source viewer, the supplied `actions` may include wrapping too, so render that value rather than rebuilding its buttons. Use `toolbarContent` for a smaller addition and reserve the full render function for an actual layout change.",
    },
    {
      id: "syntax-themes",
      title: "Syntax Themes and Typography",
      text: "**Give the Source Its Own Reading Style.** Keep the familiar default, try Dusk, Forest or Monochrome, or give the source a dedicated Prism canvas with Okaidia, Tomorrow, Twilight or Solarized Light. Compare the palettes, change them live without retokenizing, and share a typed choice across readers. Your page theme and code presentation remain separate.",
      children: [
        { id: "code-syntax-presets", label: "Explore the presets" },
        { id: "code-prism-palettes", label: "Compare the Prism palettes" },
        { id: "code-shared-syntax-choice", label: "Share a reader preference" },
        { id: "code-theme-boundaries", label: "Syntax, surfaces and app themes" },
        { id: "code-syntax-overrides", label: "Customize token colors" },
        { id: "code-code-typography", label: "Fonts, spacing and emphasis" },
      ],
    },
    {
      id: "document",
      title: "Rendered Document",
      text: "**Let People Read a Document and Copy Its Source.** Supply `renderedContent` when the visible presentation should be prepared Preact content, while `code` remains the original Markdown. This is useful for an implementation brief, a setup prompt or a short reference that reads better with real headings and paragraphs.\n\nThe viewer omits code-only import and wrapping controls in this mode. The preview below is hand-authored JSX, not an automatic Markdown parser; its Copy action still returns the Markdown string. If the document comes from another source, review [Safe Content Boundaries](#code-safe-content) before rendering it.",
    },
    {
      id: "copy-and-content",
      title: "Copy and Content",
      text: "**Make Copy Predictable.** A reader should receive the source they came for, regardless of which imports are hidden or how the text fits on screen. Build on that contract with honest success feedback, a useful failure path and a clear boundary between source strings and prepared document content.",
      children: [
        { id: "code-copy-fidelity", label: "Exact source copying" },
        { id: "code-copy-feedback", label: "Feedback and recovery" },
        { id: "code-safe-content", label: "Rendered content" },
      ],
    },
    {
      id: "imports",
      title: "Collapsible Imports",
      text: "**Add Folding to a Larger Source Example.** After choosing the source, its language and any useful header, consider hiding familiar setup declarations with `defaultImportsCollapsed`. The control counts complete import statements: the multiline Card import below is one statement even though it imports several parts. Introductory comments remain visible.\n\nExpand the imports to inspect the dependencies, then collapse them to compare the implementation. Hidden declarations leave no blank stack of lines, and Copy includes every declaration. These are optional reading tools for a fuller source viewer; see [Folding Rules](#code-folding-rules) for eligibility and syntax that intentionally stays visible.",
    },
    {
      id: "wrapping",
      title: "Readable Wrapping",
      text: "**Offer a Reading Choice for Long Lines.** Once a source viewer needs more than the plain snippets above, use `defaultWrapped` to start long attributes or messages inside the reading area. The wrap switch changes their visual layout while preserving useful indentation.\n\nCompare the example at a narrow preview width, then turn wrapping off to use native horizontal scrolling. A visual continuation never adds a newline to the original source or copied text. The control appears only when complete source would otherwise overflow; see [Wrapping Behavior](#code-wrapping-rules) for its pairing with eligible import folding.",
    },
    {
      id: "reading-behavior",
      title: "Reading Preferences",
      text: "**Separate the Source from the Way It Is Read.** Import folding and line wrapping solve different problems, so the component keeps their controls and behavior independent. Choose useful defaults, preserve the complete source, and decide whether preferences should carry across file selections.",
      children: [
        { id: "code-folding-rules", label: "Import folding" },
        { id: "code-wrapping-rules", label: "Line wrapping" },
        { id: "code-reading-state", label: "State and file changes" },
      ],
    },
    {
      id: "modularity",
      title: "Build Your Own Reader",
      text: "**Compose Only the Tools Your Reader Needs.** The earlier examples cover simple source, optional headers and built-in reading tools. Now choose which parts remain visible, connect shared preferences or replace an individual action. Source stays in one place while your surrounding interface supplies its context.",
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
      text: "**Change the Context without Rebuilding the Viewer.** Use surface variants, root layout classes and header composition before reaching for custom control markup. The component keeps clipboard, highlighting and reading behavior together, while your page remains free to explain, arrange and label the example.",
      children: [
        { id: "code-surfaces", label: "Surfaces and sizing" },
        { id: "code-toolbar-composition", label: "Header composition" },
        { id: "code-theme-integration", label: "Shared theme tokens" },
      ],
    },
    {
      id: "source-links",
      title: "Source Reference Links",
      text: "**Follow the Parts That Make an Example Work.** Open an imported component, inspect the package it comes from, and follow the same name where the example uses it. Subtle navigation preserves the source's syntax colors and spacing while connecting code to useful local references and verified repositories.",
      children: [
        { id: "code-reference-navigation", label: "Navigate imported names" },
        { id: "code-reference-destinations", label: "How destinations are chosen" },
        { id: "code-reference-resolver", label: "Share your own resolver" },
      ],
    },
    {
      id: "performance",
      title: "Performance and Delivery",
      text: "**Keep the Page Light as the Examples Grow.** Syntax highlighting is optional work layered onto readable source. Good integration still matters: load only the file a reader opens, avoid repeatedly replacing stable strings, and keep very large generated documents out of an ordinary example panel.",
      children: [
        { id: "code-lazy-highlighting", label: "Lazy highlighting" },
        { id: "code-large-files", label: "Large files" },
        { id: "code-server-rendering", label: "Server rendering" },
      ],
    },
    {
      id: "api-reference",
      title: "API Reference",
      text: "The tables group source, reading and composition options by responsibility. The source definitions below are generated from this checkout. Code also accepts root HTML attributes, excluding its own source and clipboard-specific contracts; children are supplied through the named composition slots.",
    },
    {
      id: "accessibility",
      title: "Accessibility",
      text: "Keep the surrounding purpose clear, let keyboard users reach overflowing source, and verify that copy feedback and reading controls remain understandable without syntax colors. A code example should remain usable in plain text and at narrow widths.",
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting and Next Steps",
      text: "**Check the Smallest Missing Piece First.** A missing stylesheet, ambiguous language or intentionally omitted control usually explains an unexpected result. Use the questions below to distinguish setup from presentation, then return to the smallest example that demonstrates the behavior you need.",
      children: [
        { id: "code-missing-colors", label: "Missing syntax colors" },
        { id: "code-missing-controls", label: "Missing controls" },
        { id: "code-formatting-questions", label: "Formatting and next steps" },
      ],
    },
  ],
  renderMain: (context) => (
    <>
      {context.renderTitleRow()}
      {context.renderPreviewAndCodeTabs({
        preview: <CodeHero />,
        codeSnippet: codeHeroSnippet,
        filePath: "src/examples/CodeExample.tsx",
        previewClass: "min-w-0 w-full",
      })}
      {context.sections.map((section) => {
        const example = codeExamples[section.id];
        return (
          <ComponentDocSection key={section.id} section={section}>
            {context.renderSectionExtraContent(section.id)}
            {example ? (
              context.renderPreviewAndCodeTabs({
                preview: example.preview(),
                codeSnippet: example.code,
                filePath: `src/examples/code-${section.id}.tsx`,
                previewClass: "min-w-0 w-full",
              })
            ) : section.id === "api-reference" ? (
              <CodeApiReference />
            ) : (
              <CodeGuideContent sectionId={section.id} />
            )}
          </ComponentDocSection>
        );
      })}
    </>
  ),
};
