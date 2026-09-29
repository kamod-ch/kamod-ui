import {
  ClipboardErrorDemo,
  CodeBlockPlainDemo,
  CodeBlockShellDemo,
} from "./copy-field-code-block-demo";
import { createGenericDocPage } from "./create-generic-doc-page";

const BASIC_SNIPPET = `import { CodeBlock } from "@/components/kamod-ui/code-block";

export const Example = () => (
  <CodeBlock
    code={"export const hello = 'world';"}
    language="typescript"
    filename="hello.ts"
    showLineNumbers
    copyLabel="Copy code"
  />
);`;

export const codeBlockDocPage = createGenericDocPage({
  title: "Code Block",
  slug: "code-block",
  usageLabel: "Code Block",
  previewCode: BASIC_SNIPPET,
  installationText:
    "Import from `@kamod-ch/ui/code-block`. Plaintext SSR output in semantic `<pre><code>` — no Prism/SyntaxHighlighter dependency. Optional `language` sets `data-language` for consumer styling.",
  usageText:
    "Preserves whitespace and line breaks. Default horizontal scroll (`wrap={false}`) prevents long lines from widening outer layouts. Copy uses the raw `code` string without line numbers, filename, or labels.",
  installationExample: {
    code: `import { CodeBlockPlainDemo } from "./copy-field-code-block-demo";

export const Example = () => <CodeBlockPlainDemo />;`,
    renderPreview: () => <CodeBlockPlainDemo />,
  },
  exampleSections: [
    {
      id: "plaintext",
      title: "Plaintext with line numbers",
      text: "Line numbers are decorative (`aria-hidden`) and excluded from clipboard output.",
      code: `import { CodeBlockPlainDemo } from "./copy-field-code-block-demo";

export const Example = () => <CodeBlockPlainDemo />;`,
      renderPreview: () => <CodeBlockPlainDemo />,
    },
    {
      id: "shell",
      title: "Shell command",
      text: "Multi-line commands copy exactly, including trailing newlines when present in `code`.",
      code: `import { CodeBlockShellDemo } from "./copy-field-code-block-demo";

export const Example = () => <CodeBlockShellDemo />;`,
      renderPreview: () => <CodeBlockShellDemo />,
    },
    {
      id: "copy-error",
      title: "Copy failure feedback",
      text: "Errors are visible; success is never reported when clipboard writes fail.",
      code: `import { ClipboardErrorDemo } from "./copy-field-code-block-demo";

export const Example = () => <ClipboardErrorDemo />;`,
      renderPreview: () => <ClipboardErrorDemo />,
    },
  ],
  apiRows: [
    { prop: "code", type: "string", defaultValue: "required" },
    { prop: "language / filename", type: "string", defaultValue: "optional metadata" },
    { prop: "showLineNumbers", type: "boolean", defaultValue: "false" },
    { prop: "wrap", type: "boolean", defaultValue: "false" },
    { prop: "showCopyButton", type: "boolean", defaultValue: "true" },
  ],
  accessibilityText:
    "Semantic pre/code content rendered as text nodes. Copy button labels reflect idle, copied, and error states. Line numbers are hidden from assistive tech.",
});
