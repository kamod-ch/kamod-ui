import { ApiReference, type ApiReferenceSection } from "../../components/ApiReference";
import { codeCustomizationApi } from "./code-api-customization";

const sections: readonly ApiReferenceSection[] = [
  {
    title: "Code",
    description:
      "Source and appearance: start with a string, then describe what the reader is looking at.",
    rows: [
      {
        prop: "code",
        type: "string",
        defaultValue: "Required",
        description: (
          <>
            The original source. Displayed as text and copied unchanged, including hidden imports
            and original whitespace.
          </>
        ),
      },
      {
        prop: "language",
        type: "string",
        defaultValue: "Inferred",
        description: (
          <>
            A supported language or alias. Recognized values take precedence over the file
            extension; use <code>{"inferLanguage={false}"}</code> to disable inference.
          </>
        ),
      },
      {
        prop: "filePath",
        type: "string",
        defaultValue: "—",
        description: (
          <>
            Adds a file header with an appropriate icon and supplies the extension for language
            selection. It is a label, not a request to load that file.
          </>
        ),
      },
      {
        prop: "inferLanguage",
        type: "boolean",
        defaultValue: "true",
        description: (
          <>
            Resolve a language from an explicit hint, file extension or recognizable source. When
            false, only the normalized language prop is used.
          </>
        ),
      },
      {
        prop: "variant",
        type: '"default" | "subtle" | "outline"',
        defaultValue: '"default"',
        description: (
          <>
            Choose the surrounding code surface. Every variant retains the same source handling,
            keyboard controls and copy behavior.
          </>
        ),
      },
      {
        prop: "class",
        type: "string",
        defaultValue: "—",
        description: (
          <>Classes on the outer container. Use for overall width, placement and layout.</>
        ),
      },
      {
        prop: "preClassName",
        type: "string",
        defaultValue: "—",
        description: (
          <>
            Classes on the source <code>pre</code> element. Useful for a local maximum height; it
            does not apply to rendered document content.
          </>
        ),
      },
      {
        prop: "className",
        type: "string",
        defaultValue: "—",
        description: (
          <>
            Compatibility alias for the source-area class. Prefer <code>preClassName</code> in new
            code; use <code>class</code> for the outer container.
          </>
        ),
      },
    ],
  },
  {
    title: "Code",
    description:
      "Reading preferences: defaults initialize local state; optional controlled props let your application own later changes.",
    rows: [
      {
        prop: "defaultWrapped",
        type: "boolean",
        defaultValue: "false",
        description: (
          <>
            Start with readable soft wrapping. This is an initial preference, not a controlled-state
            value.
          </>
        ),
      },
      {
        prop: "showWrapControl",
        type: "boolean",
        defaultValue: "true",
        description: (
          <>
            Offer the compact wrapping switch for actual file paths or recognized coding languages.
            Commands, unfiled prose and Markdown prompts omit it. Set false with{" "}
            <code>defaultWrapped</code> to present a fixed wrapped layout for eligible source.
          </>
        ),
      },
      {
        prop: "defaultImportsCollapsed",
        type: "boolean",
        defaultValue: "false",
        description: (
          <>
            Start eligible imports folded. A different source string resets import folding to this
            default.
          </>
        ),
      },
      {
        prop: "showImportControl",
        type: "boolean",
        defaultValue: "true",
        description: (
          <>
            Allow eligible leading static imports to be folded. If disabled, the declarations remain
            visible even when the collapsed default is set.
          </>
        ),
      },
    ],
  },
  {
    title: "Code",
    description:
      "Composition and copying: adapt the surrounding content without duplicating the source or clipboard logic.",
    rows: [
      {
        prop: "toolbarContent",
        type: "ComponentChildren",
        defaultValue: "—",
        description: (
          <>
            Content beside the standard actions. Replaces the automatic purpose label; an explicit
            file path can still be shown.
          </>
        ),
      },
      {
        prop: "renderToolbar",
        type: "(actions: ComponentChildren) => ComponentChildren",
        defaultValue: "Built-in header",
        description: (
          <>
            Render a custom header and place the supplied actions once. Depending on the layout, the
            actions may include wrapping as well as Copy.
          </>
        ),
      },
      {
        prop: "renderLanguage",
        type: "(language: CodeLanguage, label: string) => ComponentChildren",
        defaultValue: "Plain language label",
        description: (
          <>
            Replace the language label in an unnamed snippet’s automatic header, for example with a
            linked inline-code reference. Receives the resolved grammar and its readable label; does
            not change highlighting or override a file path or custom toolbar.
          </>
        ),
      },
      {
        prop: "renderFilePath",
        type: "(filePath: string) => ComponentChildren",
        defaultValue: "CodeFileHeader",
        description: (
          <>
            Replace only the file label while retaining <code>filePath</code> as language metadata.
            Useful when your application needs its own file links inside the standard header.
          </>
        ),
      },
      {
        prop: "renderedContent",
        type: "ComponentChildren",
        defaultValue: "—",
        description: (
          <>
            A prepared Preact document view in place of the source area. Copy retains the original
            source; syntax highlighting and code reading controls are omitted.
          </>
        ),
      },
      {
        prop: "showCopy",
        type: "boolean",
        defaultValue: "true",
        description: (
          <>Show the built-in clipboard action. Hiding it does not prevent normal text selection.</>
        ),
      },
      {
        prop: "onCopy",
        type: "(code: string) => void",
        defaultValue: "—",
        description: (
          <>
            Called with the original source after clipboard writing succeeds. Use for persistent
            context or application feedback.
          </>
        ),
      },
      {
        prop: "onCopyError",
        type: "(error: unknown) => void",
        defaultValue: "—",
        description: (
          <>
            Called when clipboard writing fails or is unavailable. Provide a recovery step such as
            selecting the text manually.
          </>
        ),
      },
    ],
  },
  ...codeCustomizationApi,
  {
    title: "CodeFileHeader",
    description:
      "Optional file-label composition for custom headers; ordinary examples can simply pass filePath to Code.",
    rows: [
      {
        prop: "path",
        type: "string",
        defaultValue: "Required",
        description: (
          <>
            The display path, including its filename and extension. The file icon exposes its type.
          </>
        ),
      },
      {
        prop: "lineCount",
        type: "number",
        defaultValue: "—",
        description: (
          <>
            An optional line total supplied by your file viewer. Code does not calculate this header
            metadata automatically.
          </>
        ),
      },
      {
        prop: "class",
        type: "string",
        defaultValue: "—",
        description: <>Additional classes for the file-label container.</>,
      },
    ],
  },
  {
    title: "CodeSnippetLabel",
    description: "Optional automatic purpose label for snippets without a meaningful file path.",
    rows: [
      {
        prop: "code",
        type: "string",
        defaultValue: "Required",
        description: <>The source used to distinguish a command from an installation command.</>,
      },
      {
        prop: "language",
        type: "CodeLanguage",
        defaultValue: "Required",
        description: (
          <>
            The resolved language. Use <code>resolveCodeLanguage</code> when your surrounding code
            does not already have this value.
          </>
        ),
      },
      {
        prop: "renderLanguage",
        type: "(language: CodeLanguage, label: string) => ComponentChildren",
        defaultValue: "Plain language label",
        description: <>Decorate the language with the same optional renderer supported by Code.</>,
      },
      {
        prop: "importsOnly",
        type: "boolean",
        defaultValue: "Required",
        description: (
          <>
            Whether the snippet consists only of imports, allowing the label to describe that
            purpose.
          </>
        ),
      },
    ],
  },
];

export function CodeApiReference() {
  return <ApiReference sections={sections} />;
}
