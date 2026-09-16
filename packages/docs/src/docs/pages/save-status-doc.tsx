import { createGenericDocPage } from "./create-generic-doc-page";
import { AutosaveDraftDemo, SaveStatusStatesDemo } from "./save-status-demo";

const BASIC_SNIPPET = `import { SaveStatus } from "@/components/kamod-ui/save-status";

export const Example = ({ status, labels, errorMessage, lastSavedAt, onRetry }) => (
  <SaveStatus
    status={status}
    labels={labels}
    hasUnsavedChanges={status === "dirty"}
    errorMessage={errorMessage}
    lastSavedAt={lastSavedAt}
    formatOptions={{ locale: "en-US", timeZone: "UTC" }}
    onRetry={onRetry}
  />
);`;

export const saveStatusDocPage = createGenericDocPage({
  title: "Save Status",
  slug: "save-status",
  usageLabel: "Save Status",
  previewCode: BASIC_SNIPPET,
  installationText:
    "Import from `@kamod-ch/ui/save-status`. Presentation-only — no autosave, fetch, or `navigator.onLine` logic inside the component.",
  usageText:
    "Controlled states: `pristine`, `dirty`, `saving`, `saved`, `error`, `offline`. Icons plus text (not color alone). Optional `hasUnsavedChanges` prevents a `saved`/`pristine` presentation from masking pending edits. Timestamps use absolute Intl output for SSR-stable renders. Live announcements fire once on meaningful transitions — not on every render.",
  installationExample: {
    code: `import { SaveStatusStatesDemo } from "./save-status-demo";

export const Example = () => <SaveStatusStatesDemo />;`,
    renderPreview: () => <SaveStatusStatesDemo />,
  },
  exampleSections: [
    {
      id: "states",
      title: "All states",
      text: "Toggle controlled states, compact size, retry, and absolute last-saved time.",
      code: `import { SaveStatusStatesDemo } from "./save-status-demo";

export const Example = () => <SaveStatusStatesDemo />;`,
      renderPreview: () => <SaveStatusStatesDemo />,
    },
    {
      id: "autosave-demo",
      title: "Simulated autosave (consumer-owned)",
      text: "Local draft with debounced saves, monotonic revisions, stale-response guards, retry, and optional offline flag — adapter is demo-only.",
      code: `import { AutosaveDraftDemo } from "./save-status-demo";

export const Example = () => <AutosaveDraftDemo />;`,
      renderPreview: () => <AutosaveDraftDemo />,
    },
  ],
  apiRows: [
    { prop: "status", type: "SaveStatusState", defaultValue: "controlled" },
    { prop: "labels", type: "SaveStatusLabels", defaultValue: "required" },
    { prop: "hasUnsavedChanges", type: "boolean", defaultValue: "false" },
    {
      prop: "lastSavedAt / formatOptions",
      type: "Date | string, Intl options",
      defaultValue: "optional",
    },
    { prop: "useAutosaveDraft", type: "hook + AutosaveAdapter", defaultValue: "demo/reference" },
  ],
  accessibilityText:
    'Primary status text uses `role="status"` with icons marked `aria-hidden`. A polite live region announces save success or failure once per transition. Spinner motion respects `prefers-reduced-motion`.',
});
