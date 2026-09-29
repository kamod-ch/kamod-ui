import {
  BulkActionBar,
  BulkActionBarActions,
  BulkActionBarClear,
  BulkActionBarCount,
  Button,
} from "@kamod-ch/ui";
import { BulkActionTableDemo } from "./bulk-action-table-demo";
import { createGenericDocPage } from "./create-generic-doc-page";

const BASIC_SNIPPET = `import {
  BulkActionBar,
  BulkActionBarActions,
  BulkActionBarClear,
  BulkActionBarCount,
  Button,
} from "@/components/kamod-ui/bulk-action-bar";

export const Example = ({ selectedCount, pending, onClear, onArchive }) => (
  <BulkActionBar
    selectedCount={selectedCount}
    pending={pending}
    onClearSelection={onClear}
    aria-label={t("bulk.toolbar")}
  >
    <BulkActionBarCount
      formatCount={(count) =>
        count === 1 ? t("bulk.oneSelected") : t("bulk.manySelected", { count })
      }
    />
    <BulkActionBarActions aria-label={t("bulk.actions")}>
      <Button size="sm" variant="outline" onClick={onArchive}>
        {t("bulk.archive")}
      </Button>
    </BulkActionBarActions>
    <BulkActionBarClear clearLabel={t("bulk.clear")} />
  </BulkActionBar>
);`;

const FOCUS_SNIPPET = `import { useRef } from "preact/hooks";
import { BulkActionBar, BulkActionBarClear } from "@/components/kamod-ui/bulk-action-bar";

export const Example = ({ selectedCount, setSelection }) => {
  const selectAllRef = useRef(null);

  const clearSelection = () => {
    setSelection({});
    // Return focus to a stable control that stays mounted when the bar hides.
    selectAllRef.current?.focus();
  };

  return (
    <>
      <button ref={selectAllRef} type="button" aria-label="Select all on page">
        …
      </button>
      <BulkActionBar
        selectedCount={selectedCount}
        onClearSelection={clearSelection}
        aria-label="Bulk actions"
      >
        <BulkActionBarClear clearLabel="Clear selection" />
      </BulkActionBar>
    </>
  );
};`;

export const bulkActionBarDocPage = createGenericDocPage({
  title: "Bulk Action Bar",
  slug: "bulk-action-bar",
  usageLabel: "Bulk Action Bar",
  previewCode: BASIC_SNIPPET,
  installationText:
    "Import from `@kamod-ch/ui/bulk-action-bar`. Selection state, row ids, and async work stay in the consumer.",
  usageText:
    "BulkActionBar renders when `selectedCount > 0` (unless `open` is controlled). Pass localized count labels via `formatCount`, slot actions as children, and wire destructive flows through AlertDialog in the consumer. The bar does not steal focus when it appears; after clear or delete, return focus to a stable element such as a select-all control.",
  installationExample: {
    code: `import { BulkActionTableDemo } from "./bulk-action-table-demo";

export const Example = () => <BulkActionTableDemo />;`,
    renderPreview: () => <BulkActionTableDemo />,
  },
  exampleSections: [
    {
      id: "data-table-demo",
      title: "Data table with archive, delete, and clear",
      text: "Selection is keyed by payment id. Select-all applies only to the current page. Delete opens AlertDialog; Archive sets a pending state that blocks duplicate clicks.",
      code: `import { BulkActionTableDemo } from "./bulk-action-table-demo";

export const Example = () => <BulkActionTableDemo />;`,
      renderPreview: () => <BulkActionTableDemo />,
    },
    {
      id: "sticky-variant",
      title: "Sticky within container",
      text: 'Set `variant="sticky"` to pin the bar to the top of its scroll container — not the viewport.',
      code: `<BulkActionBar selectedCount={3} variant="sticky" aria-label="Bulk actions">
  <BulkActionBarCount formatCount={(count) => \`\${count} selected\`} />
</BulkActionBar>`,
      renderPreview: () => (
        <div class="max-h-48 overflow-y-auto rounded-lg border p-3">
          <BulkActionBar selectedCount={3} variant="sticky" aria-label="Bulk actions preview">
            <BulkActionBarCount formatCount={(count) => `${count} files selected`} />
            <BulkActionBarActions aria-label="File actions">
              <Button size="sm" variant="outline">
                Move
              </Button>
            </BulkActionBarActions>
            <BulkActionBarClear clearLabel="Clear selection" onClear={() => undefined} />
          </BulkActionBar>
          <div class="text-muted-foreground space-y-2 pt-24 text-sm">
            <p>Scroll this container — the bar sticks below the top edge.</p>
            <p>Row content placeholder.</p>
            <p>Row content placeholder.</p>
            <p>Row content placeholder.</p>
          </div>
        </div>
      ),
    },
    {
      id: "focus-return",
      title: "Focus after the bar hides",
      text: "When selection drops to zero the bar unmounts. Restore focus in `onClearSelection` (or after delete) so keyboard users land on a control that remains visible.",
      code: FOCUS_SNIPPET,
      renderPreview: () => (
        <p class="text-muted-foreground text-sm">
          See the data table demo — clearing selection or deleting rows returns focus to the
          select-all checkbox via <code class="text-xs">selectAllRef.current?.focus()</code>.
        </p>
      ),
    },
  ],
  apiRows: [
    { prop: "selectedCount", type: "number", defaultValue: "required from consumer" },
    { prop: "open", type: "boolean", defaultValue: "selectedCount > 0 when omitted" },
    {
      prop: "pending",
      type: "boolean",
      defaultValue: "false — disables clear, sets inert on actions",
    },
    { prop: "variant", type: '"default" | "sticky"', defaultValue: '"default"' },
    { prop: "onClearSelection", type: "() => void", defaultValue: "called by BulkActionBarClear" },
    { prop: "aria-label", type: "string", defaultValue: "required toolbar name" },
    {
      prop: "BulkActionBarCount.formatCount",
      type: "(count) => ComponentChildren",
      defaultValue: "localized singular/plural",
    },
    {
      prop: "BulkActionBarClear.clearLabel",
      type: "string",
      defaultValue: "required accessible name",
    },
    {
      prop: "BulkActionBarActions.aria-label",
      type: "string",
      defaultValue: "required group name",
    },
  ],
  accessibilityText:
    'BulkActionBar uses role="toolbar" with a required aria-label. BulkActionBarActions uses role="group" with its own aria-label and inert while pending. BulkActionBarCount exposes aria-live="polite". Wire action buttons with disabled={pending} from useBulkActionBar. Do not auto-focus the bar when it appears; return focus manually when it unmounts.',
});
