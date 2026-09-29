import { createGenericDocPage } from "./create-generic-doc-page";
import { KeywordsTagInputDemo } from "./tag-input-demo";

const BASIC_SNIPPET = `import { TagInput } from "@/components/kamod-ui/tag-input";

export const Example = ({ tags, onTagsChange }) => (
  <TagInput
    value={tags}
    onValueChange={onTagsChange}
    separators={["Enter"]}
    enablePasteSplit
    validation={{ maxTags: 10, maxTagLength: 40 }}
    labels={{
      inputPlaceholder: "Add keyword…",
      removeTag: (tag) => \`Remove \${tag.value}\`,
    }}
  />
);`;

export const tagInputDocPage = createGenericDocPage({
  title: "Tag Input",
  slug: "tag-input",
  usageLabel: "Tag Input",
  previewCode: BASIC_SNIPPET,
  installationText:
    "Import from `@kamod-ch/ui/tag-input`. Free-text tags with stable ids — separate from `MultiSelect`, which picks from predefined options via Combobox.",
  usageText:
    "Controlled tag list with optional separators (comma is never implicit), paste splitting, duplicate policy (`reject` | `replace`), validation, and accessible remove buttons. Enter commits unless an IME composition is active. With an empty draft, Backspace removes one tag at a time; ArrowLeft/ArrowRight move tag focus; Delete removes the focused tag.",
  installationExample: {
    code: `import { KeywordsTagInputDemo } from "./tag-input-demo";

export const Example = () => <KeywordsTagInputDemo />;`,
    renderPreview: () => <KeywordsTagInputDemo />,
  },
  exampleSections: [
    {
      id: "keywords",
      title: "Keywords with validation",
      text: "Max tags/length, paste-friendly newlines, Enter-only commit. Invalid input stays in the field with an alert message.",
      code: `import { KeywordsTagInputDemo } from "./tag-input-demo";

export const Example = () => <KeywordsTagInputDemo />;`,
      renderPreview: () => <KeywordsTagInputDemo />,
    },
  ],
  apiRows: [
    { prop: "value / onValueChange", type: "TagInputTag[]", defaultValue: "controlled" },
    {
      prop: "separators",
      type: '("Enter" | "Tab" | "," | ";" | "|")[]',
      defaultValue: '["Enter"]',
    },
    { prop: "duplicatePolicy", type: "reject | replace", defaultValue: "reject" },
    { prop: "enablePasteSplit", type: "boolean", defaultValue: "true" },
    { prop: "validation", type: "{ maxTags?, maxTagLength?, validate? }", defaultValue: "—" },
  ],
  accessibilityText:
    'Tags render in a grouped chip field with uniquely labeled remove buttons. Validation errors use role="alert". Keyboard: Enter commits (skipped during IME), Backspace removes one tag when the draft is empty, arrows move focus between tags.',
});
