import { createGenericDocPage } from "./create-generic-doc-page";
import {
  CategoriesMultiSelectDemo,
  ExternalSearchMultiSelectDemo,
  LongLabelsMultiSelectDemo,
  TeamMultiSelectDemo,
} from "./multi-select-demos";

const BASIC_SNIPPET = `import { MultiSelect } from "@/components/kamod-ui/multi-select";

export const Example = ({ options, value, onValueChange, onSearchChange, selectedLabels }) => (
  <MultiSelect
    options={options}
    value={value}
    onValueChange={onValueChange}
    onSearchChange={onSearchChange}
    selectedLabels={selectedLabels}
    maxVisible={3}
    labels={{
      placeholder: "Select…",
      searchPlaceholder: "Search…",
      removeOption: (label) => \`Remove \${label}\`,
    }}
  />
);`;

export const multiSelectDocPage = createGenericDocPage({
  title: "Multi Select",
  slug: "multi-select",
  usageLabel: "Multi Select",
  previewCode: BASIC_SNIPPET,
  installationText:
    "Import from `@kamod-ch/ui/multi-select`. Built on Combobox + Command + Popover — keyboard and screen-reader behavior comes from that stack; no parallel listbox implementation.",
  usageText:
    "Controlled multi pick from options with stable `value` ids. Filter/reload options externally via `onSearchChange` — the component never fetches. Use `selectedLabels` when selected ids may be missing from the current options list. `maxVisible` collapses chips with a “+N more” control that keeps remove buttons available after expand. Version 1 does not create free-text options.",
  installationExample: {
    code: `import { TeamMultiSelectDemo } from "./multi-select-demos";

export const Example = () => <TeamMultiSelectDemo />;`,
    renderPreview: () => <TeamMultiSelectDemo />,
  },
  exampleSections: [
    {
      id: "team",
      title: "Team members",
      text: "Searchable multi pick with disabled options and labeled remove buttons on each chip.",
      code: `import { TeamMultiSelectDemo } from "./multi-select-demos";

export const Example = () => <TeamMultiSelectDemo />;`,
      renderPreview: () => <TeamMultiSelectDemo />,
    },
    {
      id: "categories",
      title: "Categories with compact summary",
      text: "Many selections collapse to `maxVisible` chips plus “+N more”, with clear-all support.",
      code: `import { CategoriesMultiSelectDemo } from "./multi-select-demos";

export const Example = () => <CategoriesMultiSelectDemo />;`,
      renderPreview: () => <CategoriesMultiSelectDemo />,
    },
    {
      id: "long-labels",
      title: "Long labels",
      text: "Chip text truncates while remove buttons stay reachable.",
      code: `import { LongLabelsMultiSelectDemo } from "./multi-select-demos";

export const Example = () => <LongLabelsMultiSelectDemo />;`,
      renderPreview: () => <LongLabelsMultiSelectDemo />,
    },
    {
      id: "external-search",
      title: "External search results",
      text: "Consumer filters options and supplies `selectedLabels` for off-list ids after reload.",
      code: `import { ExternalSearchMultiSelectDemo } from "./multi-select-demos";

export const Example = () => <ExternalSearchMultiSelectDemo />;`,
      renderPreview: () => <ExternalSearchMultiSelectDemo />,
    },
  ],
  apiRows: [
    { prop: "options", type: "MultiSelectOption[]", defaultValue: "required" },
    { prop: "value / onValueChange", type: "string[]", defaultValue: "controlled" },
    { prop: "selectedLabels", type: "Record<string, string>", defaultValue: "—" },
    { prop: "onSearchChange", type: "(query) => void", defaultValue: "—" },
    { prop: "maxVisible", type: "number", defaultValue: "3" },
    { prop: "loading / empty", type: "boolean / slot", defaultValue: "—" },
  ],
  accessibilityText:
    "Uses Combobox chips trigger, Command list navigation (ArrowUp/Down, Enter), and Popover focus management. Each selected value exposes a dedicated remove button with an accessible name.",
});
