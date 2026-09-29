import { Button, Field, FieldLabel, Input } from "@kamod-ch/ui";
import {
  type KeyboardShortcutDefinition,
  KeyboardShortcutsHelp,
  toAriaKeyshortcuts,
  useKeyboardShortcuts,
} from "@kamod-ch/ui/shortcuts-help";
import { useMemo, useState } from "preact/hooks";

const SHORTCUTS: KeyboardShortcutDefinition[] = [
  {
    id: "palette",
    label: "Open command palette",
    category: "General",
    keys: ["mod", "k"],
    description: "Jump to any action quickly.",
  },
  {
    id: "save",
    label: "Save draft",
    category: "Editing",
    keys: ["mod", "s"],
    scope: "When the draft editor is focused",
  },
  {
    id: "help",
    label: "Show keyboard shortcuts",
    category: "General",
    keys: ["shift", "/"],
  },
];

const LABELS = {
  title: "Keyboard shortcuts",
  description: "Consumer-provided entries — this component does not register global listeners.",
  searchPlaceholder: "Search shortcuts…",
  emptySearch: "No shortcuts match your search.",
  empty: "No shortcuts configured.",
};

export const KeyboardShortcutsHelpDemo = () => {
  const [open, setOpen] = useState(false);
  const [lastAction, setLastAction] = useState("Press a shortcut or use the button below.");
  const [notes, setNotes] = useState("");

  const handlers = useMemo(
    () => [
      {
        id: "palette",
        keys: ["mod", "k"],
        onTrigger: () => setLastAction("Command palette (simulated)"),
      },
      {
        id: "save",
        keys: ["mod", "s"],
        onTrigger: () => setLastAction("Draft saved (simulated)"),
      },
      {
        id: "help",
        keys: ["shift", "/"],
        onTrigger: () => setOpen(true),
      },
    ],
    [],
  );

  useKeyboardShortcuts({ shortcuts: handlers, platform: "windows" });

  const helpKeys = toAriaKeyshortcuts(["shift", "/"], "windows");

  return (
    <div class="space-y-4">
      <p class="text-muted-foreground text-sm">{lastAction}</p>
      <div class="flex flex-wrap gap-2">
        <Button type="button" onClick={() => setOpen(true)} aria-keyshortcuts={helpKeys}>
          Keyboard shortcuts
        </Button>
      </div>
      <Field>
        <FieldLabel htmlFor="shortcuts-notes">Notes (shortcuts disabled here)</FieldLabel>
        <Input
          id="shortcuts-notes"
          value={notes}
          onInput={(event) => setNotes(event.currentTarget.value)}
          placeholder="Try Ctrl+K while focused here — nothing should fire."
        />
      </Field>
      <div
        contentEditable="true"
        class="border-border min-h-16 rounded-md border px-3 py-2 text-sm"
        aria-label="Rich notes"
      >
        Nested editable region — shortcuts stay inactive while typing.
      </div>
      <KeyboardShortcutsHelp
        open={open}
        onOpenChange={setOpen}
        shortcuts={SHORTCUTS}
        labels={LABELS}
        platform="windows"
      />
    </div>
  );
};
