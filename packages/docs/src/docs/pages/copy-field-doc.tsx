import { ClipboardErrorDemo, CopyFieldExamplesDemo } from "./copy-field-code-block-demo";
import { createGenericDocPage } from "./create-generic-doc-page";

const BASIC_SNIPPET = `import { CopyField } from "@/components/kamod-ui/copy-field";

export const Example = () => (
  <CopyField
    label="Webhook URL"
    value="https://hooks.example.com/v1/inbound/9f3c2a1b"
    truncate="middle"
    copyLabel="Copy URL"
    copiedLabel="URL copied"
  />
);`;

export const copyFieldDocPage = createGenericDocPage({
  title: "Copy Field",
  slug: "copy-field",
  usageLabel: "Copy Field",
  previewCode: BASIC_SNIPPET,
  installationText:
    "Import from `@kamod-ch/ui/copy-field`. Shares clipboard logic with `CodeBlock` via `@kamod-ch/ui/copyable`. Copies the full `value` even when the display is truncated.",
  usageText:
    "Read-only mono field for IDs, URLs, tokens, and commands. Not a password field — no implicit password-manager behavior. On clipboard failure the full value is selected for manual copy and an error is announced.",
  installationExample: {
    code: `import { CopyFieldExamplesDemo } from "./copy-field-code-block-demo";

export const Example = () => <CopyFieldExamplesDemo />;`,
    renderPreview: () => <CopyFieldExamplesDemo />,
  },
  exampleSections: [
    {
      id: "ids-urls",
      title: "Long IDs and URLs",
      text: "Optional middle truncation keeps layout stable while copying the original string.",
      code: `import { CopyFieldExamplesDemo } from "./copy-field-code-block-demo";

export const Example = () => <CopyFieldExamplesDemo />;`,
      renderPreview: () => <CopyFieldExamplesDemo />,
    },
    {
      id: "clipboard-error",
      title: "Clipboard errors",
      text: "Failed copies show an alert, keep success feedback silent, and select text for manual copy.",
      code: `import { ClipboardErrorDemo } from "./copy-field-code-block-demo";

export const Example = () => <ClipboardErrorDemo />;`,
      renderPreview: () => <ClipboardErrorDemo />,
    },
  ],
  apiRows: [
    { prop: "value", type: "string", defaultValue: "required" },
    {
      prop: "truncate / maxDisplayLength",
      type: "middle | end | false, number",
      defaultValue: "middle, 48",
    },
    { prop: "copyLabel / copiedLabel", type: "string", defaultValue: "localized by consumer" },
    { prop: "fallbackHint", type: "string", defaultValue: "manual copy hint" },
  ],
  accessibilityText:
    'Labelled read-only input with an icon button exposing copy state in `aria-label`. Errors use role="alert"; truncated values expose the full string via `title`.',
});
