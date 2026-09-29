import { createGenericDocPage } from "./create-generic-doc-page";
import { KeyboardShortcutsHelpDemo } from "./shortcuts-help-demo";

const BASIC_SNIPPET = `import {
  KeyboardShortcutsHelp,
  toAriaKeyshortcuts,
  useKeyboardShortcuts,
  type KeyboardShortcutDefinition,
} from "@kamod-ch/ui/shortcuts-help";

const SHORTCUTS: KeyboardShortcutDefinition[] = [
  { id: "help", label: "Show shortcuts", category: "General", keys: ["shift", "/"] },
];

export const Example = () => {
  const [open, setOpen] = useState(false);

  useKeyboardShortcuts({
    platform: "windows",
    shortcuts: [{ id: "help", keys: ["shift", "/"], onTrigger: () => setOpen(true) }],
  });

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-keyshortcuts={toAriaKeyshortcuts(["shift", "/"], "windows")}>
        Keyboard shortcuts
      </button>
      <KeyboardShortcutsHelp open={open} onOpenChange={setOpen} shortcuts={SHORTCUTS} labels={{ title: "Keyboard shortcuts" }} />
    </>
  );
};`;

export const shortcutsHelpDocPage = createGenericDocPage({
  title: "Keyboard Shortcuts Help",
  slug: "shortcuts-help",
  usageLabel: "Keyboard Shortcuts Help",
  previewCode: BASIC_SNIPPET,
  installationText:
    "Import from `@kamod-ch/ui/shortcuts-help`. The help overlay is display-only — register global listeners in your app via `useKeyboardShortcuts` or your own handler.",
  usageText:
    "Pass stable shortcut definitions with structured key tokens (`mod`, `shift`, literal keys). Set `platform` explicitly for SSR-stable modifier labels (⌘ vs Ctrl). Optional search filters by action text and rendered key labels. `useKeyboardShortcuts` skips inputs, textareas, selects, and nested contenteditable targets; ignores IME composition and `event.repeat`; calls `preventDefault` only for matched combos.",
  installationExample: {
    code: `import { KeyboardShortcutsHelpDemo } from "./shortcuts-help-demo";

export const Example = () => <KeyboardShortcutsHelpDemo />;`,
    renderPreview: () => <KeyboardShortcutsHelpDemo />,
  },
  exampleSections: [
    {
      id: "integration",
      title: "Help + consumer listener",
      text: "Shared shortcut data feeds the dialog; global listener lives in the demo only. A visible button always opens the overlay.",
      code: `import { KeyboardShortcutsHelpDemo } from "./shortcuts-help-demo";

export const Example = () => <KeyboardShortcutsHelpDemo />;`,
      renderPreview: () => <KeyboardShortcutsHelpDemo />,
    },
  ],
  apiRows: [
    { prop: "shortcuts", type: "KeyboardShortcutDefinition[]", defaultValue: "required" },
    { prop: "labels", type: "KeyboardShortcutsHelpLabels", defaultValue: "required" },
    { prop: "platform", type: "mac | windows | linux", defaultValue: "runtime detect" },
    { prop: "showSearch", type: "boolean", defaultValue: "true" },
    { prop: "useKeyboardShortcuts", type: "hook (consumer)", defaultValue: "optional" },
    { prop: "toAriaKeyshortcuts", type: "util for aria-keyshortcuts", defaultValue: "optional" },
  ],
  accessibilityText:
    "Dialog uses the existing modal primitive (focus trap, Escape to close). Key combinations render with `Kbd`/`KbdGroup` plus an accessible name on the group. Add `aria-keyshortcuts` on actionable controls when the combo maps cleanly to WAI-ARIA syntax.",
});
