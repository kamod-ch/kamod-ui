import { ComponentDocSection } from "../components/component-detail/ComponentDocSection";
import { CodeApiReference } from "../examples/code/code-api";
import { CodeHero, codeExamples, codeHeroSnippet } from "../examples/code/code-examples";
import { CodeGuideContent } from "../examples/code/code-guide";
import type { DocPageModule } from "../types";

export const codeDocPage: DocPageModule = {
  slug: "code",
  title: "Code",
  headline: "Code — source worth reading and sharing",
  command: "pnpm add @kamod-ch/ui",
  packagePath: "@kamod-ch/ui/code",
  snippetImports: "package",
  usageLabel:
    "Readable source code with syntax highlighting, file labels, exact copying, collapsible imports and thoughtful line wrapping. The same component powers the code examples throughout this documentation.",
  usageImportSnippet: 'import { Code } from "@kamod-ch/ui/code";',
  usageExampleSnippet:
    '<Code code={\'const greeting = "Hello, workspace";\'} language="typescript" />',
  exampleSectionIds: [
    "source-file",
    "imports",
    "wrapping",
    "terminal",
    "data",
    "styles",
    "appearance",
    "toolbar",
    "document",
    "literal",
  ],
  sections: [
    {
      id: "installation",
      title: "Installation",
      text: "**Start with the Shared Foundation.** Code is a Preact component exported by `@kamod-ch/ui`. Its source viewer, syntax highlighting and reading controls are packaged together; your application supplies the source and the surrounding context. Follow these steps once, then reuse the same component in a guide, settings screen or file viewer.",
      children: [
        { id: "code-install-package", label: "Add the package" },
        { id: "code-install-styles", label: "Connect the styles" },
        { id: "code-first-render", label: "Render an example" },
      ],
    },
    {
      id: "usage",
      title: "Usage",
      text: "**Keep the Example Useful before Making It Elaborate.** A source string and a language are enough for a working panel. Add a filename when it tells the reader where to put the code, choose a sensible initial reading mode, and let the built-in controls do their work. You can explore every part independently in the [Examples and Variants](#component-examples) below.",
      children: [
        { id: "code-reading-model", label: "The reading model" },
        { id: "code-choose-language", label: "Choose useful metadata" },
      ],
    },
    {
      id: "source-file",
      title: "Source File",
      text: "**Give the Example a Place to Live.** Supply `filePath` when the code represents a real file or a suggested destination. The header separates the path from the filename, includes a file-type icon and helps choose the syntax grammar from the extension. Here, `.tsx` selects TypeScript with JSX without an additional `language` prop.\n\nThe path is descriptive metadata; Code does not fetch or write the file. The preview below shows a small, complete component with a single useful action. Copy includes the import and implementation, while the filename stays in the header. Compare [Custom Header](#toolbar) when your context is more useful than a path.",
    },
    {
      id: "imports",
      title: "Collapsible Imports",
      text: "**Let Readers Reach the Interesting Part Quickly.** Use `defaultImportsCollapsed` when setup declarations are familiar and the implementation deserves the first glance. The control counts complete import statements, so the multiline Card import below counts as one statement, even though it imports several parts. Introductory comments remain visible.\n\nExpand the imports to inspect the dependencies, then collapse them again to compare the composition. Hidden source leaves no blank stack of lines, and Copy always includes every declaration. See [Folding Rules](#code-folding-rules) for the supported syntax and the cases that intentionally stay visible.",
    },
    {
      id: "wrapping",
      title: "Readable Wrapping",
      text: "**Keep Long Lines inside the Reading Area.** Start with `defaultWrapped` when a snippet contains long attributes, messages or configuration values. The shared wrap switch changes how each line is displayed, preserving useful indentation while preventing a narrow panel from becoming a sideways reading exercise.\n\nTry the example at a smaller preview width, then turn wrapping off to compare. On a wide surface, lines that already fit should keep their source alignment. A visual continuation does not add a newline to copied code; read [Wrapping Behavior](#code-wrapping-rules) before using fixed columns for a text report.",
    },
    {
      id: "terminal",
      title: "Terminal Command",
      text: '**Make the Next Action Ready to Copy.** Choose `language="bash"` for shell commands and keep the source free of decorative prompts such as `$`. A one-line install command receives a compact purpose label, syntax colors and the same copy action as a larger file. A filename is unnecessary when the command simply runs in the project root.\n\nThis example includes the UI package and its peer dependencies for a new app. Existing projects should install only what is missing; the [Getting Started Guide](/docs/getting-started) explains the surrounding setup. Wrapping is initially enabled so the full command remains visible on smaller screens; command snippets do not show a wrapping switch.',
    },
    {
      id: "data",
      title: "Structured Data",
      text: "**Show Values in Their Original Shape.** A `workspace.json` label identifies both the file and the JSON grammar. Distinct keys, strings, booleans and punctuation make a nested object easier to scan without introducing a separate data viewer. The component displays the exact string you provide, including the chosen indentation.\n\nUse a small representative object when explaining an API response or settings file. Code does not parse the value into a tree, validate it or reformat it; prepare those concerns before rendering when your product needs them. See [Language Families](#code-language-list) for YAML and other supported formats.",
    },
    {
      id: "styles",
      title: "Theme-Aware Styles",
      text: "**Connect an Example to the Design System It Belongs To.** CSS examples benefit from the same file context and copy behavior as component source. The snippet below styles a workspace panel using semantic surface, foreground, border and focus tokens, keeping its meaning stable when the application switches theme.\n\nIts `.css` extension selects highlighting automatically. Change the site’s color theme or light/dark mode to compare the viewer itself, then follow [Theme Tokens](/docs/theming/installation#token-overrides) to adapt your own interface. The displayed stylesheet is reference source; Code does not inject it into the page.",
    },
    {
      id: "appearance",
      title: "Surface Variants",
      text: "**Choose How Much Framing the Context Needs.** The `default`, `subtle` and `outline` variants offer three surfaces for the same source. Use the familiar default for a standalone example, a quieter subtle surface inside another reading area, or an outline when you want the surrounding page background to remain part of the composition.\n\nThe examples deliberately use identical code and labels so their differences remain easy to compare. Reading controls and clipboard behavior do not depend on the variant. For sizing and local scroll limits, continue to [Customization](#customization); for a shared color change, adjust the theme rather than each snippet independently.",
    },
    {
      id: "toolbar",
      title: "Custom Header",
      text: "**Use the Header to Explain Why This Source Matters.** A destination path is not always the most useful label. `renderToolbar` lets you introduce a short purpose, state or piece of context while retaining the component’s own actions. The example places workspace defaults on the left and the supplied Copy action on the right.\n\nThis composition disables the wrap switch because the source is short. In a general source viewer, the supplied `actions` may include wrapping too, so render that value rather than rebuilding its buttons. Use `toolbarContent` for a smaller addition and reserve the full render function for an actual layout change.",
    },
    {
      id: "document",
      title: "Rendered Document",
      text: "**Let People Read a Document and Copy Its Source.** Supply `renderedContent` when the visible presentation should be prepared Preact content, while `code` remains the original Markdown. This is useful for an implementation brief, a setup prompt or a short reference that reads better with real headings and paragraphs.\n\nThe viewer omits code-only import and wrapping controls in this mode. The preview below is hand-authored JSX, not an automatic Markdown parser; its Copy action still returns the Markdown string. If the document comes from another source, review [Safe Content Boundaries](#code-safe-content) before rendering it.",
    },
    {
      id: "literal",
      title: "Literal Output",
      text: '**Keep a Report a Report.** Logs and build summaries often mention code-like fragments without being source files. Pair `language="text"` with `inferLanguage={false}` to keep the content deliberately unhighlighted, including the JSX-looking text in this example. Give it a useful purpose label through `toolbarContent`.\n\nPlain text still receives the shared surface and copy action. Use `defaultWrapped` to choose its layout; plain text without a filename does not show a wrapping switch. This is also a predictable fallback for an unsupported language or a custom DSL. It does not strip characters or normalize spacing: the original report remains the value the reader copies.',
    },
    {
      id: "modularity",
      title: "Build Your Own Reader",
      text: "**Keep the Parts You Need.** Start with the complete Code panel, hide controls that do not help your reader, then replace individual actions or connect their state to your own interface. The original source stays in one place while headers, controls and surrounding content adapt to your application.",
      children: [
        { id: "code-visible-parts", label: "Choose visible parts" },
        { id: "code-controlled-preferences", label: "Own the reading state" },
        { id: "code-control-slots", label: "Replace a control" },
        { id: "code-content-slots", label: "Compose surrounding content" },
      ],
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
      id: "syntax-themes",
      title: "Syntax Themes and Typography",
      text: "**Give the Source Its Own Reading Style.** Keep the familiar default or choose Dusk, Forest or Monochrome for an individual Code panel. These lightweight CSS presets follow light and dark mode without changing your application's theme. Start with a preset, then adapt token colors and typography only where your content benefits.",
      children: [
        { id: "code-syntax-presets", label: "Explore the presets" },
        { id: "code-theme-boundaries", label: "Syntax, surfaces and app themes" },
        { id: "code-syntax-overrides", label: "Customize token colors" },
        { id: "code-code-typography", label: "Fonts, spacing and emphasis" },
      ],
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
